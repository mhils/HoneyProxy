from libmproxy import encoding
from libhproxy.honey import HoneyProxy
import re, socket
import hashlib #@UnusedImport

class FlowCollection:
    """
    Collects all flows, gives them an id, decodes content.
    """
    regex_charset = re.compile("charset=\s*([\S]+|['\"][^'\"]+['\"])")
    regex_isip = re.compile("^([0-9]{1,3}\.){3}[0-9]{1,3}$")
    
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
        
        #In transparent mode, we are unsure about the actual host, but we want to show it in the GUI.
        #Firstly, we get the Host from the request headers.
        #As this might be faked, we go on and check whether the request IP matches one of the DNS entries belonging to the headerHost
        if(True or FlowCollection.regex_isip.match(flowRepr["request"]["host"])):
            try:
                headerHost = flow.request.headers["Host"]
                if(headerHost):
                    headerHost = headerHost[0]
                    info = socket.getaddrinfo(flowRepr["request"]["host"], flowRepr["request"]["port"],0,0,socket.SOL_TCP)
                    for i in info:
                        if(i[4][0] == flowRepr["request"]["host"] and i[4][1] == flowRepr["request"]["port"]):
                            flowRepr["request"]["hostFormatted"] = headerHost
                            break
            except socket.gaierror:
                pass
            except:
                import traceback
                print traceback.format_exc()
            
        
        #Save decoded content    
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
            #RFC2616 3.7.1
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
        
        #calculate hashsums
        algorithms = ["md5","sha256"]
        for i in ["request","response"]:
            flowRepr[i]["contentChecksums"] = {}
            #TODO: Analyze request and split it up into parameters to match file upload
            for item, data in (("Checksum",decoded_content[i].encode('utf-8')),):
                checksums = {}
                for a in algorithms:
                    checksums[a] = getattr(hashlib,a)(data).hexdigest()
                flowRepr[i]["contentChecksums"][item] = checksums
        
        
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