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
    def setAuthKey(key):
        if(key == None or key == ""):
            return
        HoneyProxy.authKey = key
    
    @staticmethod
    def getAuthKey():
        return HoneyProxy.authKey
        
    @staticmethod
    def setConfig(proxymaster):
        HoneyProxy.honeyProxyMaster = proxymaster
        return proxymaster
        
    @staticmethod
    def getConfig():
        return HoneyProxy.honeyProxyMaster
        
    @staticmethod
    def isAuthenticated(request):
        try:
            return request.args["auth"][0] == HoneyProxy.getAuthKey()
        except:
            return False