# Copyright (C) 2010  Aldo Cortesi
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



import gui.session
import os 

from libmproxy import controller, proxy

from twisted.web.server import Site 
from twisted.web.static import File
from twisted.internet import reactor, task
from lib.websockets import WebSocketsResource

class HoneyProxyMaster(controller.Master):
    def __init__(self, server, sessionFactory):
        controller.Master.__init__(self, server)
        self.sessionFactory = sessionFactory

    def start(self):
        #see controller.Master.run()
        global should_exit
        should_exit = False
        self.server.start_slave(controller.Slave, self.masterq)
        
    def tick(self):
        if not should_exit:
            controller.Master.tick(self, self.masterq)
        else:
            self.shutdown()

    def handle_request(self, msg):
        #hid = (msg.host, msg.port)
        #if msg.headers["cookie"]:
        #    self.stickyhosts[hid] = msg.headers["cookie"]
        #elif hid in self.stickyhosts:
        #    msg.headers["cookie"] = self.stickyhosts[hid]
        print "request to "+msg.host
        self.sessionFactory.write(msg.host)
        msg._ack()

    def handle_response(self, msg):
        #hid = (msg.request.host, msg.request.port)
        #if msg.headers["set-cookie"]:
        #    self.stickyhosts[hid] = msg.headers["set-cookie"]
        print "response from "+msg.request.host
        gui.session.GuiSession()
        msg._ack()

def main():
    #TODO add libmproxy options - evaluate OptionsParser (see mitmdump / mitmproxy)
    config = proxy.ProxyConfig(
        cacert = os.path.expanduser("~/.mitmproxy/mitmproxy-ca.pem")
    )
    
    guiSessionFactory = gui.session.GuiSessionFactory()
    websocketRes = WebSocketsResource(guiSessionFactory)
    
    server = proxy.ProxyServer(config, 8080)
    m = HoneyProxyMaster(server, guiSessionFactory)
    
    
    
    
    reactor.listenTCP(8082, Site(websocketRes))
    reactor.listenTCP(8081, Site(File("./gui/static")))
    m.start()
    
    import urllib, webbrowser
    webbrowser.open("http://localhost:8081/#"+urllib.quote("ws://localhost:8082"))
    
    
    l = task.LoopingCall(m.tick)
    l.start(0.01) # call every 10ms
    reactor.run()
    

if __name__ == '__main__':
    main()