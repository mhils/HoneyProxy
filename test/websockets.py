###############################################################################
##
##  Copyright 2011,2012 Tavendo GmbH
##
##  Licensed under the Apache License, Version 2.0 (the "License");
##  you may not use this file except in compliance with the License.
##  You may obtain a copy of the License at
##
##      http://www.apache.org/licenses/LICENSE-2.0
##
##  Unless required by applicable law or agreed to in writing, software
##  distributed under the License is distributed on an "AS IS" BASIS,
##  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
##  See the License for the specific language governing permissions and
##  limitations under the License.
##
###############################################################################

from twisted.internet import reactor
from autobahn.websocket import WebSocketClientFactory, \
                               WebSocketClientProtocol, \
                               connectWS


class BroadcastClientProtocol(WebSocketClientProtocol):
    """
    Simple client that connects to a WebSocket server, send a HELLO
    message every 2 seconds and print everything it receives.
    """

    def sendHello(self):
        print "Send auth"
        self.sendMessage('{"action":"auth","key":"foo"}')
        #reactor.callLater(2, self.sendHello)

    def onOpen(self):
        self.sendHello()

    def onMessage(self, msg, binary):
        print "onMessage - Send read"
        self.sendMessage('{"action":"read","id":"all"}')


if __name__ == '__main__':
    #factory = WebSocketClientFactory("ws://localhost:8082")
    factory = WebSocketClientFactory("ws://127.0.0.1:8082")
    factory.protocol = BroadcastClientProtocol
    connectWS(factory)
    
    reactor.run()