from libmproxy import encoding
from libhproxy.honey import HoneyProxy
import re, socket, cgi, StringIO
import hashlib #@UnusedImport

"""
flatten a given fieldStorage and return a dict with the following structure:
{"filenameA":"filecontentA",...}
This dict will be processed for creating hash checksums
"""
def getParts(fieldStorage,parts={}):
                if type(fieldStorage.value) != type([]):
                    name = ""
                    # empty strings -> None; else: strip()
                    fieldStorage.name     = fieldStorage.name.strip()     if (fieldStorage.name     != None and fieldStorage.name.strip()     != "") else None
                    fieldStorage.filename = fieldStorage.filename.strip() if (fieldStorage.filename != None and fieldStorage.filename.strip() != "") else None
                    if fieldStorage.name == None and fieldStorage.filename == None:
                        if "Checksum" in parts:
                            return parts
                        name = "Checksum"
                    else:
                        if fieldStorage.name != None:
                            name = str(fieldStorage.name)
                            if fieldStorage.filename != None:
                                name += ": " + str(fieldStorage.filename)
                            else:
                                if len(fieldStorage.value) < 1025:
                                    return parts #don't calculate md5s for really small chunks
                        elif fieldStorage.filename != None:
                            name = str(fieldStorage.filename)
                            
                    #find next avail. name
                    i=2
                    if name in parts:
                        name += " (2)"
                    while name in parts:
                        i += 1
                        name = name[:-(2+len(str(i)))] + ("(%d)" % i)

                    parts[name] = str(fieldStorage.value)
                else:
                    for i in fieldStorage.value:
                        getParts(i,parts)
                return parts

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
            try:
                ce = r.headers["content-encoding"]
                if ce and ce[0] in encoding.ENCODINGS:
                    decoded = encoding.decode(ce[0],r.content)
            except:
                print "Warning: Data cannot be decoded with given Content Encoding."
            
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
            
            try:
                decoded = decoded.encode('utf-8')
            except:
                print "Warning: Cannod encode request to utf8"
            decoded_content[i] = decoded
        
        #calculate hashsums
        algorithms = ["md5","sha256"]
        for i in ["request","response"]:
            
            flowRepr[i]["contentChecksums"] = {}
            
            parts = {"Checksum":decoded_content[i]}
            
            #Handle multipart checksums
            if i == "request":        
                try:
                    headers = dict(map(str.lower, map(str,a)) for a in flow.request.headers) # odict -> (lowered) dict
                    fs = cgi.FieldStorage(StringIO.StringIO(decoded_content[i]),headers,environ={ 'REQUEST_METHOD':'POST' })
                    parts = getParts(fs)
                except Exception as e:
                    import traceback
                    traceback.print_exc()
                    print "Warning: Cannot decode multipart"
            
            #TODO: Analyze request and split it up into parameters to match file upload
            for item, data in parts.viewitems():
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