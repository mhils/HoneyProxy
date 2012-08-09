from libmproxy import encoding
from libhproxy.honey import HoneyProxy

class FlowCollection:
    def __init__(self):
        self._flows_serialized = []
        self._flows = []
        self._decoded_contents = []
    
    def getLastFlow(self):
        return self._flows_serialized[-1]

    def getFlow(self,flowId):
        return self._flows[flowId]
    
    def getDecodedContents(self):
        return self._decoded_contents
    
    def getFlowsSerialized(self):
        return self._flows_serialized
    
    def addFlow(self, flow):
        flowRepr = flow._get_state()
        flowRepr["id"] = len(self._flows_serialized)
        
        decoded_content = {}
        
        #remove content out of the flowRepr
        for i in ["request","response"]:
            flowRepr[i]["contentLength"] = len(flowRepr[i]["content"])
            del flowRepr[i]["content"]
            
            r = getattr(flow,i)
            decoded = r.content
            ce = r.headers["content-encoding"]
            if ce and ce[0] in encoding.ENCODINGS:
                decoded = encoding.decode(ce[0],r.content)
            decoded_content[i] = decoded
                
        
        self._flows.append(flow)
        self._flows_serialized.append(flowRepr)
        self._decoded_contents.append(decoded_content)
        return len(self._flows_serialized)-1
        
class includeDecodedContent(object):
    """

        A context manager that adds the decoded request and response content to a serialized list of flows
        and removes it after execution of the block

        Example:

        with includeDecodedContent(flows):
            search(flows)
    """
    def __init__(self, flows):
        self.flows = flows

    def __enter__(self):
        for flow in self.flows:
            for i in ["request","response"]:
                flow[i]["content"] = HoneyProxy.getProxyMaster().getFlowCollection().getDecodedContents()[flow.get("id")][i]

    def __exit__(self, exc_type, value, tb):
        for flow in self.flows:
            for i in ["request","response"]:
                del flow[i]["content"]