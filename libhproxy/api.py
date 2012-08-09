from twisted.web.resource import Resource  
import json
from libhproxy.honey import HoneyProxy
import re

class HoneyProxyApi(Resource):
    def __init__(self):
        Resource.__init__(self)
        self.putChild("flows", FlowsApiResource())
        self.putChild("search", SearchApiResource())
        
        
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
            flows = list(HoneyProxy.getProxyMaster().getFlowCollection().getFlowsSerialized())
            conditions = json.loads(request.args["filter"][0])
            
            #prepare conditions
            for cond in conditions:
                cond["field"] = cond["field"].split(".")
                cond["not"] = cond["not"] if "not" in cond else False
                if(cond["type"] == "regexp"):
                    prog = re.compile(cond["value"])
                    cond["match"] = lambda s: prog.match(str(s))
                else: #if(cond["type"] == "contains"):
                    cond["match"] = lambda s: cond["value"] in str(s)
                if(cond["not"] == True and cond["field"] != "any"):
                    cond["match"] = lambda s: not cond["match"](s)
            
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
                if type(obj) is dict:
                    #TODO: keys too?
                    return any(matchesAny(v,cond) for v in obj.keys()+obj.values())
                else:
                    return cond["match"](obj)
                    
            def filterFunc(flow):
                for cond in conditions:
                    try:
                        if(cond["field"] == "any"):
                            if not (cond["not"] ^ matchesAny(flow,cond)):
                                return False
                        else:
                            attr = rec_getattr(flow,cond["field"])
                            if not cond["match"](attr):
                                return False
                    except Exception as e:
                        print e.message
                        return False
                return True
            
            filteredFlows = filter(filterFunc,flows)
            
            if("idsOnly" in request.args):
                filteredFlows = map(lambda flow: flow.get("id"), filteredFlows)

            return json.dumps(filteredFlows,separators=(',',':'),encoding='latin1')
        except Exception as e:
            print e
            return "<html><body>Invalid request.</body></html>"         