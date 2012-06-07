# -*- coding: utf-8 -*-
from twisted.internet.protocol  import Factory, Protocol
import string, random, json
from libhproxy.honey import HoneyProxy
random = random.SystemRandom()

#WebSocket GUI Session        
class GuiSession(Protocol):
    def __init__(self):
        self.authenticated = False
    def connectionMade(self):
        pass
        #self.factory.write("HoneyProxySession: connectionMade")
        
    def connectionLost(self,reason):
        if self.authenticated:
            self.factory.sessions.remove(self)
        #self.factory.write("HoneyProxySession: connectionLost: "+str(reason))
    def dataReceived(self, data):
        try:
            data = json.loads(data)
        except ValueError:
            self.factory.msg("Cannot decode WebSocket request.")
            return
        if not "action" in data:
            return
        
        if data.get("action") == "auth" and data.get("key") == self.factory.authKey and not self.authenticated:
            self.authenticated = True
            self.factory.sessions.add(self)
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
                self.factory.msg("read",{"id":data.get("id"), "data": f.getFlowsAsJSON()[data.get("id")]})
            else:
                flows = f.getFlowsAsSingleJSON()
                self.factory.msg("read",{"id":"all","data": flows})
        
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
class GuiSessionFactory(Factory):
    def __init__(self,authKey):
        self.sessions = set()
        if(authKey == None or authKey == ""):
            self.authKey = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(32))
        else:
            self.authKey = authKey
            
    def write(self,msg):
        #print msg
        #import time
        #print "prepare@"+str(time.time())
        msg = msg.decode('latin1').encode('utf-8')
        #print "send@"+str(time.time())
        for session in self.sessions:
                session.transport.write(msg)
    def msg(self,msg,data={}):
        data["msg"] = msg
        self.write(json.dumps(data,separators=(',',':'),encoding='latin1'))
        #del data["msg"]
    protocol = GuiSession