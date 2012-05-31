class FlowCollection:
    def __init__(self):
        self._flows = []
        
    def getFlows(self):
        return self._flows
    
    def addFlow(self, flow):
        self._flows.append(flow)