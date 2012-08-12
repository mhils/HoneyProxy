from libmproxy import encoding
from libhproxy.honey import HoneyProxy
import re

class FlowCollection:
    """
    Collects all flows, gives them an id, decodes content.
    """
    regex_charset = re.compile("charset=\s*([\S]+|['\"][^'\"]+['\"])")
    
    def __init__(self):
        self._flows_serialized = []
        self._flows = []
        self._decoded_contents = []

    def getFlow(self,flowId):
        return self._flows[flowId]
    
    def getDecodedContents(self):
        return self._decoded_contents
    
    def getFlowsSerialized(self):
        return self._flows_serialized
    
    def addFlow(self, flow):
        """
        Adds a flow to all lists in the corresponding format
        """
        flowRepr = flow._get_state()
        flowRepr["id"] = len(self._flows_serialized)
        
        decoded_content = {}
        
        for i in ["request","response"]:
            #strip content out of the flowRepr
            flowRepr[i]["contentLength"] = len(flowRepr[i]["content"])
            del flowRepr[i]["content"]
            
            r = getattr(flow,i)
            decoded = r.content
            
            #decode with http content-encoding
            ce = r.headers["content-encoding"]
            if ce and ce[0] in encoding.ENCODINGS:
                decoded = encoding.decode(ce[0],r.content)
            
            #decode with http content-type encoding
            ct = r.headers["content-type"]
            default_charset = "latin-1" #HTTP 1.1 says that the default charset is ISO-8859-1
            charset = default_charset
            if ct:
                m = FlowCollection.regex_charset.search(ct[0])
                if m:
                    charset = m.group(1).strip('"').strip('"\'')
            #TODO: guess from html metadata
            try:
                decoded = decoded.decode(charset)
            except:
                try:
                    decoded = decoded.decode(default_charset)
                except:
                    print "Warning: Could not decode request."
                    import traceback
                    print traceback.format_exc()
                    
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