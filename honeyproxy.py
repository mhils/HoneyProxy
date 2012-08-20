# -*- coding: utf-8 -*-

# Copyright (C) 2012 Maximilian Hils
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.


import sys, os, inspect
from argparse import ArgumentParser
from twisted.web.server import Site 
from twisted.web.static import File
from twisted.internet import reactor, task
from twisted.web.resource import Resource
from autobahn.websocket import listenWS

#ensure to load our own version of mitmproxy and netlib
#http://stackoverflow.com/questions/279237/python-import-a-module-from-a-folder
def add_subfolder(name):
    subdir = os.path.realpath(os.path.abspath(os.path.join(os.path.split(inspect.getfile( inspect.currentframe() ))[0],name)))
    if subdir not in sys.path:
        sys.path.insert(0, subdir)
add_subfolder("netlib")
add_subfolder("mitmproxy")

from libmproxy import proxy as mproxy, cmdline as mcmdline, dump
from libhproxy import proxy as hproxy, cmdline as hcmdline, version, content, api
from libhproxy.honey import HoneyProxy
from libhproxy.gui import session

def main():
    
    
    #config stuff
    defaultConfig = (len(sys.argv) == 1)
    if defaultConfig and os.path.exists('default.conf'):
        sys.argv.insert(1,'@default.conf')
    parser = ArgumentParser(
                            usage = "%(prog)s [options]",
                            fromfile_prefix_chars="@"
                            )
    ArgumentParser.convert_arg_line_to_args = hcmdline.convert_arg_line_to_args
    parser.add_argument('--version', action='version', version=version.NAMEVERSION)
    mcmdline.common_options(parser)
    hcmdline.fix_options(parser) #remove some mitmproxy stuff

    options = parser.parse_args()

    
    dumpoptions = dump.Options(dumpdir=options.dumpdir,**mcmdline.get_common_options(options))
    
    #set up proxy server
    proxyconfig = mproxy.process_proxy_options(parser, options)
    
    if options.no_server:
        server = mproxy.DummyServer(proxyconfig)
    else:
        try:
            server = mproxy.ProxyServer(proxyconfig, options.port, options.addr)
        except mproxy.ProxyServerError, v:
            print >> sys.stderr, "%(name)s:" % version.NAME, v.args[0]
            sys.exit(1)

    HoneyProxy.setAuthKey(options.apiauth)

    #set up HoneyProxy GUI
    guiSessionFactory = session.GuiSessionFactory("ws://localhost:"+str(options.apiport))
    
    #WebSocket
    listenWS(guiSessionFactory)
    #websocketRes = WebSocketsResource(guiSessionFactory)
    #reactor.listenTCP(options.apiport, Site(websocketRes))
    
    #Config
    wsURL = "ws://localhost:"+str(options.apiport)
    httpGui = "http://honey:"+HoneyProxy.getAuthKey()+"@localhost:"+str(options.guiport)
    guiURL = httpGui +"/app"
    HoneyProxy.setConfig({
        "proxy-addr":options.addr,
        "proxy-port":options.port,
        "ws": wsURL,
        "auth": HoneyProxy.getAuthKey(),
        "dumpdir": True if options.dumpdir else False
    })
    
    root = Resource()
    root.putChild("app",File("./gui"))
    root.putChild("api",api.HoneyProxyApi())
    root.putChild("files", content.ContentAPIResource())
    if(options.dumpdir):
        root.putChild("dump", File(options.dumpdir))
     
    import libhproxy.auth as auth
    root = auth.addBasicAuth(root,"HoneyProxy",honey=HoneyProxy.getAuthKey())
    
    reactor.listenTCP(options.guiport, Site(root))  
        
    #HoneyProxy Master
    p = hproxy.HoneyProxyMaster(server, dumpoptions, guiSessionFactory)
    HoneyProxy.setProxyMaster(p)
    p.start()
    
    if not options.nogui:
        #start gui
        import webbrowser
        webbrowser.open(guiURL)
        
    print "HoneyProxy has been started!"
    print "Configuration Details (normal users: ignore):"
    print "HTTP Root: "+httpGui
    print "WebSocket API: "+wsURL
    print "Auth user: " + "honey"
    print "Auth key: "+ HoneyProxy.getAuthKey()
        
    #run!
    l = task.LoopingCall(p.tick)
    l.start(0.01) # call every 10ms
    reactor.addSystemEventTrigger("before", "shutdown", p.shutdown)
    

    reactor.run()
    

if __name__ == '__main__':
    main()
