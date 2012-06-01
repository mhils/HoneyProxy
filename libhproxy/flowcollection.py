import json

class FlowCollection:
    def __init__(self):
        self._flows = []
        self._flows_json = []
        
    def getFlows(self):
        return self._flows
    
#    def getFlow(self,i):
#        if(i < len(self._flows)):
#            return self._flows[i]
#        return None
    
    def getFlowsAsJSON(self):
        return self._flows_json
    
    def getFlowsAsSingleJSON(self):
        return ''.join(["[",','.join(self._flows_json),"]"])
    
    def addFlow(self, flow):
        self._flows.append(flow)
        self._flows_json.append(json.dumps(flow._get_state(),ensure_ascii=None))
        
