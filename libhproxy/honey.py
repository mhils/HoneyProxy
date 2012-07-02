import string, random
class HoneyProxy():
    honeyProxyMaster = None
    authKey = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(32))
    
     
    @staticmethod
    def setProxyMaster(proxymaster):
        HoneyProxy.honeyProxyMaster = proxymaster
        return proxymaster
        
    @staticmethod
    def getProxyMaster():
        return HoneyProxy.honeyProxyMaster
    
    @staticmethod
    def getAuthKey():
        return HoneyProxy.authKey
    
    @staticmethod
    def setAuthKey(key):
        if(key == None or key == ""):
            return
        HoneyProxy.authKey = key