class FlowCollection:
    def __init__(self):
        self._flows_serialized = []
        self._flows = []
    
    def getLastFlow(self):
        return self._flows_serialized[-1]

    def getFlow(self,flowId):
        return self._flows[flowId]
    
    def getFlowsSerialized(self):
        return self._flows_serialized
    
    def addFlow(self, flow):
        flowRepr = flow._get_state()
        flowRepr["id"] = len(self._flows_serialized)
        
        #remove content out of the flowRepr
        for i in ["request","response"]:
            flowRepr[i]["contentLength"] = len(flowRepr[i]["content"])
            del flowRepr[i]["content"]
        
        self._flows.append(flow)
        self._flows_serialized.append(flowRepr)
        return len(self._flows_serialized)-1
        
