import string, random
class HoneyProxy():
    """
        Static main class, containing references to all important instances.
        This is not very beautiful, but effective.
    """
    honeyProxyMaster = None
    authKey = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(32))
    apiAuthToken = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(32))
    config = {}
     
    @staticmethod
    def setProxyMaster(proxymaster):
        HoneyProxy.honeyProxyMaster = proxymaster
        
    @staticmethod
    def getProxyMaster():
        return HoneyProxy.honeyProxyMaster
    
    @staticmethod
    def setAuthKey(key):
        if(key == None or key == ""):
            return
        HoneyProxy.authKey = key
    
    @staticmethod
    def getAuthKey():
        return HoneyProxy.authKey

    @staticmethod
    def getApiAuthToken():
        return HoneyProxy.apiAuthToken
        
    @staticmethod
    def setConfig(config):
        HoneyProxy.config = config
        
    @staticmethod
    def getConfig():
        return HoneyProxy.config