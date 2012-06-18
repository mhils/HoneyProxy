# -*- coding: utf-8 -*-
import string, random, json
from libhproxy.honey import HoneyProxy
from autobahn.websocket import WebSocketServerFactory, WebSocketServerProtocol
random = random.SystemRandom()

#WebSocket GUI Session        
class GuiSession(WebSocketServerProtocol):
    def __init__(self):
        self.authenticated = False
    def onOpen(self):
        pass
        #self.factory.write("HoneyProxySession: connectionMade")
        
    def connectionLost(self,reason):
        if self.authenticated:
            self.factory.clients.remove(self)
        #self.factory.write("HoneyProxySession: connectionLost: "+str(reason))
    def onMessage(self, data, binary):
        try:
            data = json.loads(data)
        except ValueError:
            self.factory.msg("Cannot decode WebSocket request.")
            return
        if not "action" in data:
            return
        
        if data.get("action") == "auth" and data.get("key") == self.factory.authKey and not self.authenticated:
            self.authenticated = True
            self.factory.clients.add(self)
            self.factory.msg("Authenticated.")
            return
            
        if not self.authenticated:
            self.factory.msg("Unauthorized request to WebSocket API.")
            return
        
        def notImplemented():
            self.factory.msg("Unimplemented function call")
            raise NotImplementedError()
        
        def read(data):
            f = HoneyProxy.getProxyMaster().getFlowCollection()
            if "id" in data and data["id"] != "all":
                self.factory.msg("read",{"id":data.get("id"), "data": f.getFlowsAsJSON()[data.get("id")]},client=self)
            else:
                flows = f.getFlowsAsSingleJSON()
                self.factory.msg("read",{"id":"all","data": flows},client=self)
        
        try:
            {
                #'create': notImplemented,
                'read'  : read,
                #'update': notImplemented,
                #'delete': notImplemented,
            }[data.get("action")](data)
        except KeyError:
            notImplemented()
        
        
        #self.factory.write("HoneyProxySession: dataReceived: "+data+" ("+str(len(self.factory.sessions))+")")

#WebSocket GUI Session Management
class GuiSessionFactory(WebSocketServerFactory):
    def __init__(self,url,authKey):
        WebSocketServerFactory.__init__(self, url)
        self.clients = set()
        if(authKey == None or authKey == ""):
            self.authKey = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(32))
        else:
            self.authKey = authKey
            
    def write(self,msg,client):
        #print msg
        #import time
        #print "prepare@"+str(time.time())
        #msg = msg.decode('latin1').encode('utf-8')
        #print "send@"+str(time.time())
        msg = self.prepareMessage(msg)
        if(client == None):
            for client in self.clients:
                    client.sendPreparedMessage(msg)
        else:
            client.sendPreparedMessage(msg)
    def msg(self,msg,data={},client=None):
        data["msg"] = msg
        self.write(json.dumps(data,separators=(',',':'),encoding='latin1'),client=client)
        #del data["msg"]
    protocol = GuiSession