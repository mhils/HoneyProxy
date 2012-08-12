from twisted.web.resource import Resource  
import json
from libhproxy.honey import HoneyProxy
import re
from libhproxy.flowcollection import includeDecodedContent

class HoneyProxyApi(Resource):
    def __init__(self):
        Resource.__init__(self)
        self.putChild("config", ConfigApiResource())
        self.putChild("flows", FlowsApiResource())
        self.putChild("search", SearchApiResource())
        
        
class ConfigApiResource(Resource):
    isLeaf = True
    
    #to be extended one day...
    
    def render_GET(self, request):
        try:
            return json.dumps(self.HoneyProxy.getConfig())
        except Exception as e:
            print e
            return "<html><body>Invalid request.</body></html>"
        
class FlowsApiResource(Resource):
    isLeaf = True

    def render_GET(self, request):
        try:
            flows = HoneyProxy.getProxyMaster().getFlowCollection().getFlowsSerialized()
            return json.dumps(flows,separators=(',',':'),encoding='latin1')
        except Exception as e:
            print e
            return "<html><body>Invalid request.</body></html>"         
        
class SearchApiResource(Resource):
    isLeaf = True

    def render_GET(self, request):
        try:
            allFlows = HoneyProxy.getProxyMaster().getFlowCollection().getFlowsSerialized()
            flows = []
            if("in" in request.args):
                for flowId in json.loads(request.args["in"][0]):
                    flows.append(allFlows[flowId])
            else:
                flows = list(allFlows)
            
            conditions = json.loads(request.args["filter"][0])
            
            #prepare conditions
            for cond in conditions:
                cond["field"] = cond["field"].split(".")
                cond["not"] = cond["not"] if "not" in cond else False
                if(cond["type"] == "regexp"):
                    #FIXME: why does it only match from beginning?
                    prog = re.compile(cond["value"],re.DOTALL)
                    cond["match"] = lambda s: prog.search(s)
                else: #if(cond["type"] == "contains"):
                    cond["match"] = lambda s: cond["value"] in s
                #if(cond["not"] == True and cond["field"] != "any"):
                #    match = cond["match"]
                #    cond["match"] = lambda s: not match(s)
            
            #get an attribute recursively
            def rec_getattr(obj,attr):
                if(len(attr) == 0):
                    return obj
                else:
                    if type(obj) is dict:
                        obj = obj.get(attr[0])
                    else:
                        obj = getattr(obj,str(attr[0]))
                    return rec_getattr(obj,attr[1:])
            
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
            
            if("idsOnly" in request.args and request.args["idsOnly"][0].lower() == "true"):
                filteredFlows = map(lambda flow: flow.get("id"), filteredFlows)

            return json.dumps(filteredFlows,separators=(',',':'),encoding='latin1')
        except Exception:
            import traceback
            print traceback.format_exc()
            return "<html><body>Invalid request.</body></html>"         