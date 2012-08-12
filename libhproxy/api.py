from twisted.web.resource import Resource  
import json
from libhproxy.honey import HoneyProxy
import re
from libhproxy.flowcollection import includeDecodedContent

class HoneyProxyApi(Resource):
    """
        HoneyProxy JSON API.
    """
    def __init__(self):
        Resource.__init__(self)
        self.putChild("config", ConfigApiResource())
        self.putChild("flows", FlowsApiResource())
        self.putChild("search", SearchApiResource())
        
        
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
            print e
            return "<html><body>Invalid request.</body></html>"
        
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
            print e
            return "<html><body>Invalid request.</body></html>"         
        
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
                            Default behaviour for HNP is "any" currently.
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
                else: #if(cond["type"] == "contains"):
                    cond["match"] = lambda s: cond["value"] in s
            
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
            
            if("includeContent" in request.args and request.args["includeContent"][0].lower() == "false"):
                filteredFlows = filter(filterFunc,flows)
            else:
                with includeDecodedContent(flows):
                    filteredFlows = filter(filterFunc,flows)
            
            if(not("idsOnly" in request.args) or request.args["idsOnly"][0].lower() != "false"):
                filteredFlows = map(lambda flow: flow.get("id"), filteredFlows)

            return json.dumps(filteredFlows,separators=(',',':'),encoding='latin1')
        except Exception:
            import traceback
            print traceback.format_exc()
            return "<html><body>Invalid request.</body></html>"         