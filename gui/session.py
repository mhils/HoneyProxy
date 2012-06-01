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
            self.factory.write("Cannot decode WebSocket request.")
            return
        if not "action" in data:
            return
        
        if data.get("action") == "auth" and data.get("key") == self.factory.authKey and not self.authenticated:
            self.authenticated = True
            self.factory.sessions.add(self)
            self.factory.write("Authenticated.")
            return
            
        if not self.authenticated:
            self.factory.write("Unauthorized request to WebSocket API.")
            return
        
        def notImplemented():
            self.factory.write("Unimplemented function call")
            raise NotImplementedError()
        
        def read(data):
            f = HoneyProxy.getProxyMaster().getFlowCollection()
            if "id" in data:
                self.factory.write(f.getFlowsAsJSON()[data.get("id")])
            else:
                import time
                print time.time()
                flows = f.getFlowsAsSingleJSON()
                print time.time()
                #flows = map(lambda x: x._get_state(), f.getFlows())
                #print flows
                self.factory.write(flows)#json.dumps(flows, None, None, None, None, None, None, None, None, None))
        
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
    def __init__(self):
        self.sessions = set()
        self.authKey = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(32))

    def write(self,msg):
        #print "Sending \""+msg+"\""
        #import base64
        #msg = base64.b64encode(msg) # somewhat crazy unicode bugs.
        #print msg
        import time
        print "prepare@"+str(time.time())
        msg = msg.decode('latin1').encode('utf-8')
        print "send@"+str(time.time())
        for session in self.sessions:
                session.transport.write(msg)
    protocol = GuiSession