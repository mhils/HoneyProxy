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



import libhproxy.gui.session as session
import sys, json, urllib, os, inspect

#ensure to load our own version of mitmproxy and netlib
#http://stackoverflow.com/questions/279237/python-import-a-module-from-a-folder
def add_subfolder(name):
    subdir = os.path.realpath(os.path.abspath(os.path.join(os.path.split(inspect.getfile( inspect.currentframe() ))[0],name)))
    if subdir not in sys.path:
        sys.path.insert(0, subdir)
add_subfolder("netlib")
add_subfolder("mitmproxy")

from optparse import OptionParser

from libmproxy import proxy as mproxy, cmdline as mcmdline, dump

from twisted.web.server import Site 
from twisted.web.static import File
from twisted.internet import reactor, task
from twisted.web.resource import Resource

#from libhproxy.websockets import WebSocketsResource
from libhproxy import proxy as hproxy, cmdline as hcmdline, version, content
from libhproxy.honey import HoneyProxy

from autobahn.websocket import listenWS

def main():
    
    
    #config stuff
    parser = OptionParser(
                usage = "%prog [options] [filter]",
                version= version.NAMEVERSION,
            )
    mcmdline.common_options(parser)
    hcmdline.fix_options(parser) #remove some mitmproxy stuff

    options, args = parser.parse_args() #@UnusedVariable
    
    if args:
        filt = " ".join(args)
    else:
        filt = None
        
    dumpoptions = dump.Options(**mcmdline.get_common_options(options))
    
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
    
    root = Resource()
    root.putChild("app",File("./gui"))
    root.putChild("files", content.ContentAPI())
    reactor.listenTCP(options.guiport, Site(root))  
        
    #HoneyProxy Master
    p = hproxy.HoneyProxyMaster(server, dumpoptions, filt, guiSessionFactory)
    HoneyProxy.setProxyMaster(p)
    p.start()
    
    wsURL = "ws://localhost:"+str(options.apiport)
    contentURL = "http://localhost:"+str(options.guiport)+"/files"
    urlData = urllib.quote(json.dumps({
          "ws": wsURL,
          "auth": HoneyProxy.getAuthKey(),
          "content": contentURL
          }))
    guiURL = "http://localhost:"+str(options.guiport)+"/app#"+urlData
    
    if not options.nogui:
        #start gui
        import webbrowser
        webbrowser.open(guiURL)
    else:
        print "GUI: "+guiURL
        print "WebSocket API URL: "+wsURL
        print "HTTP Content API Root: "+contentURL
        print "Auth key: "+ HoneyProxy.getAuthKey()
        
    #run!
    l = task.LoopingCall(p.tick)
    l.start(0.01) # call every 10ms
    reactor.addSystemEventTrigger("before", "shutdown", p.shutdown)
    
    reactor.run()
    

if __name__ == '__main__':
    main()
