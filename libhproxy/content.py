from twisted.web.resource import Resource  
from libhproxy.honey import HoneyProxy
#serve request content via HTTP
class ContentAPIResource(Resource):
    isLeaf = True
    def render_GET(self, request):
        try:
            if(len(request.postpath) != 3):
                raise Exception("invalid parameter length")
            flow = HoneyProxy.getProxyMaster().getFlowCollection().getFlow(int(request.postpath[0]))
            isResponse = request.postpath[1] == "response"
            
            obj = getattr(flow,request.postpath[1])
            
            isView = request.postpath[2] == "inline"
            if (isResponse):
                #add important headers from original request
                headers = ["Content-Type","Content-Encoding"]
                for h in headers:
                    if(h in obj.headers):
                        request.setHeader(h,obj.headers.get(h)[0])
                
                #this would fail on 301 redirects
                #fix responsecode      
                #request.setResponseCode(obj.code)
                
            #fix content disposition for attachment download
            cdisp = obj.headers.get("Content-Disposition")
            if(cdisp == None):
                #do minimal file name guessing
                cdisp = 'inline; filename="'+flow.request.path.split("?")[0].split("/")[-1]+'"'
            else:
                cdisp = cdisp[0]
            if isView:
                request.setHeader("Content-Disposition",cdisp.replace("attachment", "inline"))
            else:
                request.setHeader("Content-Disposition",cdisp.replace("inline", "attachment"))
        
            return obj.content
        except Exception as e:
            print e
            return "<html><body>Invalid request.</body></html>"         