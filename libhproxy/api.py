from twisted.web.resource import Resource, ForbiddenResource, NoResource, ErrorPage
from twisted.web import http
from libhproxy.honey import HoneyProxy
import re, json, os.path
from libhproxy.flowcollection import includeDecodedContent

class HoneyProxyApi(Resource):
    """
        HoneyProxy JSON API.
    """
    def __init__(self):
        Resource.__init__(self)
        self.putChild("config", ConfigApiResource())
        self.putChild("fs", FileSystemCRUDApi("./scripts"))
        self.putChild("flows", FlowsApiResource())
        self.putChild("search", SearchApiResource())
        self.putChild("token", TokenApiResource())  

def requiresAuth(f):
    assert f.__name__ in ["render_POST","render_PUT","render_DELETE"]
    def auth_func(self, request, *args, **kwargs):
        token = None
        if "token" in request.args:
            token = request.args["token"] 
        elif request.requestHeaders.hasHeader("X-Request-Token"):
            token = request.requestHeaders.getRawHeaders("X-Request-Token",[None])[0]
        if token == HoneyProxy.getApiAuthToken():
            return f(self, request, *args, **kwargs)
        else:
            return ForbiddenResource(message="Invalid response Token").render(request)
    return auth_func

class ServerErrorResource(ErrorPage):
    """
    L{ServerErrorResource} is a specialization of L{ErrorPage} which returns the HTTP
    response code I{INTERNAL SERVER ERROR}.
    """
    def __init__(self, e="", message="Internal Server Error while processing request"):
        import traceback
        print e
        traceback.print_exc()
        ErrorPage.__init__(self, http.INTERNAL_SERVER_ERROR,
                           "Internal Server Error",
                           message)

class FileSystemCRUDApi(Resource):
    
    def __init__(self, path):
        Resource.__init__(self)
        path = os.path.abspath(path)
        self.exists = os.path.exists(path)
        self.isdir = os.path.isdir(path)
        self.isfile = os.path.isfile(path)
        self.path = path
    @staticmethod
    def clean(filename):
        return re.sub(r'[^\w\.\- =]','',filename).strip(".") # the equal sign is used for read only files
    def getChild(self, name, request):
        name = FileSystemCRUDApi.clean(name)
        childPath = os.path.join(self.path,name)
        return FileSystemCRUDApi(childPath)
    @requiresAuth
    def render_DELETE(self, request):
        if not self.exists:
            return NoResource().render(request)
        if self.isdir:
            try:
                os.rmdir(self.path)
                request.setResponseCode(http.NO_CONTENT)
                return json.dumps({'success':True})
            except OSError:
                return NoResource().render(request)
        elif self.isfile:
            try:
                os.remove(self.path)
                request.setResponseCode(http.NO_CONTENT)
                return json.dumps({'success':True})
            except OSError:
                return NoResource().render(request)
    @requiresAuth
    def render_PUT(self, request):
        if not self.exists:
            return ErrorPage(http.CONFLICT,
                             "Resource does not exist",
                             "Resource does not exist and cannot be updated.").render(request)
        try:
            data = json.loads(request.content.getvalue())
            with open(self.path,"w") as f:
                f.write(data["content"])
            request.setResponseCode(http.OK)
            return json.dumps({'success':True})
        except Exception as e:
            return ServerErrorResource(e).render(request)
    @requiresAuth
    def render_POST(self, request):
        if self.exists:
            #http://stackoverflow.com/questions/3825990/http-response-code-for-post-when-resource-already-exists
            return ErrorPage(http.CONFLICT,
                             "Resource already exists",
                             "Resource already exists and cannot be created.").render(request)
        try:
            data = json.loads(request.content.getvalue())
            filedir = os.path.split(self.path)[0]
            if not os.path.exists(filedir):
                os.makedirs(filedir)
            with open(self.path,"w") as f:
                f.write(data["content"])
            request.setResponseCode(http.CREATED)
            return json.dumps({'success':True})
        except Exception as e:
            return ServerErrorResource(e).render(request)
                
    def render_GET(self, request):
        if not self.exists:
            return NoResource().render(request)
        if self.isfile:
            with open(self.path,"r") as f:
                return f.read()
        elif self.isdir:
            ret = []
            if request.args.get("recursive",["false"])[0] == "true":
                for dirpath, dirnames, filenames in os.walk(self.path):
                    ret.append((dirpath[len(self.path):], dirnames, filenames))
            else:
                files = []
                dirs = []
                for i in os.listdir(self.path):
                    if os.path.isfile(os.path.join(self.path,i)):
                        files.append(i)
                    else:
                        dirs.append(i)
                ret = ("", dirs, files)
            return json.dumps(ret)
        assert False

class TokenApiResource(Resource):
    """
    Just returnung the Api Token
    """
    isLeaf = True
    def render_GET(self, request):
        return json.dumps({"token": HoneyProxy.getApiAuthToken()})
    
        
class ConfigApiResource(Resource):
    """
        Config API - this is a minimal skeleton providing some configuration options to the GUI.
    """
    isLeaf = True
    
    #to be extended one day...
    def render_GET(self, request):
        try:
            return json.dumps(HoneyProxy.getConfig())
        except Exception as e:
            return ServerErrorResource(e).render(request)
        
class FlowsApiResource(Resource):
    """
        Flow API - returns all serialized flows from the FlowCollection.
    """
    isLeaf = True

    def render_GET(self, request):
        try:
            flows = HoneyProxy.getProxyMaster().getFlowCollection().getFlowsSerialized()
            return json.dumps(flows,separators=(',',':'),encoding='latin1')
        except Exception as e:
            return ServerErrorResource(e).render(request)
        
class SearchApiResource(Resource):
    """
        Search API. Returns all flows that match all of the the specified filters.
        
        Todo: Add AND/OR and nesting for multiple filters. Regexes should cover most jobs currently though.
        
        API Parameters:
            in = [1,2,3]
                Limit search to the given flows. Default: all flows
            filter = [filterObj,...]
                A list of filters. A flow must match all of them (AND).
                filterObj:
                    {
                        field = string
                            the field to search in, e.g. "request.content".
                            If you want to search in all fields, specify "any".
                        type = string
                            a valid search type currently the only supported types are
                            "regexp" and "contains".
                        value = string
                            the actual search string.
                            More technically: parameter for the type function
                        not = boolean
                            inverse this selector
                    }
            idsOnly = boolean
                Default: true
                Normally, only the matching ids are returned.
                Set to false if you want the complete serialized flows to be returned.
            includeContent = true
                Set to false if you don't want to search in request and response content.
                (Usually this is only the case for performance reasons)
    """
    isLeaf = True
    
    def render_GET(self, request):
        try:
            allFlows = HoneyProxy.getProxyMaster().getFlowCollection().getFlowsSerialized()
            
            #take care of the "in" parameter, only search through specified flows (or all if not specified)
            flows = []
            if("in" in request.args):
                for flowId in json.loads(request.args["in"][0]):
                    flows.append(allFlows[flowId])
            else:
                flows = list(allFlows)
            
            #prepare conditions
            conditions = json.loads(request.args["filter"][0])
            for cond in conditions:
                cond["field"] = cond["field"].split(".")
                cond["not"] = cond["not"] if "not" in cond else False
                if(cond["type"] == "regexp"):
                    prog = re.compile(cond["value"],re.DOTALL)
                    cond["match"] = lambda s: prog.search(s)
                elif(cond["type"] == "containsStrict"):
                    cond["match"] = lambda s: cond["value"] in s
                elif(cond["type"] == "similarTo"):
                    cond["field"] = []
                    flow, level = cond["value"].split(",")
                    flow = allFlows[int(flow)]
                    level = int(level)
                    cond["match"] = lambda s: similarTo(flow,s,level)
                else: #if(cond["type"] == "contains"):
                    value = cond["value"].lower()
                    cond["match"] = lambda s: value in s.lower()
            
            def similarTo(this,other,level):
                if(this == other):
                    return True #Include own flow.
                diff = ((this.get("request").get("host")               != other.get("request").get("host")) * 4 +
                        (this.get("request").get("method")             != other.get("request").get("method")) * 4 +
                        (this.get("request").get("path")               != other.get("request").get("path")) * 4 +
                        (this.get("request").get("contentLength")      != other.get("request").get("contentLength")) +
                        (this.get("response").get("code")              != other.get("response").get("code")) +
                        (this.get("response").get("contentLength")     != other.get("response").get("contentLength")))
                if(diff <= level):
                    return True
                else:
                    return False
            
            #helper function get an attribute recursively
            def rec_getattr(obj,attr):
                if(len(attr) == 0):
                    return obj
                else:
                    if type(obj) is dict:
                        obj = obj.get(attr[0])
                    else:
                        obj = getattr(obj,str(attr[0]))
                    return rec_getattr(obj,attr[1:])
            
            #helper function to determine whether the given condition matches any attribute
            def matchesAny(obj,cond):
                if type(obj) is list or type(obj) is tuple:
                    return any(matchesAny(v,cond) for v in obj)
                elif type(obj) is dict:
                    return any(matchesAny(v,cond) for v in obj.keys()+obj.values())
                else:
                    try:
                        if not type(obj) is str:
                            obj = str(obj)
                        return cond["match"](obj)
                    except:
                        import traceback
                        print traceback.format_exc()
                        return False
            
            #filter a specific flows for all conditions        
            def filterFunc(flow):
                for cond in conditions:
                    try:
                        if(cond["field"] == ["any"]):
                            if not matchesAny(flow,cond) ^ cond["not"]:
                                return False
                        else:
                            attr = rec_getattr(flow,cond["field"])
                            if not cond["match"](attr) ^ cond["not"]:
                                return False
                    except:
                        return False
                return True
            
            if("includeContent" in request.args and request.args["includeContent"][0].lower() == "true"):
                with includeDecodedContent(flows):
                    filteredFlows = filter(filterFunc,flows)
            else:
                filteredFlows = filter(filterFunc,flows)
            
            if(not("idsOnly" in request.args) or request.args["idsOnly"][0].lower() != "false"):
                filteredFlows = map(lambda flow: flow.get("id"), filteredFlows)

            return json.dumps(filteredFlows,separators=(',',':'),encoding='latin1')
        except Exception as e:
            return ServerErrorResource(e).render(request)
        
    render_POST = render_GET