from twisted.internet.protocol  import Factory, Protocol

#WebSocket GUI Session        
class GuiSession(Protocol):
    def connectionMade(self):
        self.factory.write("HoneyProxySession: connectionMade")
        self.factory.sessions.add(self)
    def connectionLost(self,reason):
        self.factory.sessions.remove(self)
        self.factory.write("HoneyProxySession: connectionLost: "+str(reason))
    def dataReceived(self, data):
        self.factory.write("HoneyProxySession: dataReceived: "+data+" ("+str(len(self.factory.sessions))+")")

#WebSocket GUI Session Management
class GuiSessionFactory(Factory):
    def __init__(self):
        self.sessions = set()
    def write(self,msg):
        print "Sending \""+msg+"\""
        import base64
        msg = base64.b64encode(msg) # somewhat crazy unicode bugs.
        for session in self.sessions:
                session.transport.write(msg)
    protocol = GuiSession