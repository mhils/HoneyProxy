from zope.interface import implements
from twisted.cred.portal import IRealm
from twisted.web.resource import IResource
from twisted.cred.portal import Portal
from twisted.cred.checkers import InMemoryUsernamePasswordDatabaseDontUse
from twisted.web.guard import HTTPAuthSessionWrapper, BasicCredentialFactory
    
class SimpleResourceRealm(object):
    implements(IRealm)

    def __init__(self,resource):
        self.resource = resource

    def requestAvatar(self, avatarId, mind, *interfaces):
        if IResource in interfaces:
            return (IResource, self.resource, lambda: None)
        raise NotImplementedError()

def addBasicAuth(resource,desc,**users):
    """Add basic auth for a resource.
    Twisteds modulation of everything makes this quite.. messy."""
    realm = SimpleResourceRealm(resource)
    portal = Portal(realm,[InMemoryUsernamePasswordDatabaseDontUse(**users)])
    credentialFactory = BasicCredentialFactory(desc)
    return HTTPAuthSessionWrapper(portal, [credentialFactory])