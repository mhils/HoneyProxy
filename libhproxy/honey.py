class HoneyProxy():
    honeyProxyMaster = None
    flowCollection = None
     
    @staticmethod
    def setProxyMaster(proxymaster):
        HoneyProxy.honeyProxyMaster = proxymaster
        return proxymaster
        
    @staticmethod
    def getProxyMaster():
        return HoneyProxy.honeyProxyMaster