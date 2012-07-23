from twisted.web.resource import Resource  
import json

class Config(Resource):
    isLeaf = True
    
    #to be extended one day...
    
    def __init__(self, config):
        Resource.__init__(self)
        self._config = config if config else {}
    
    def render_GET(self, request):
        try:
            return json.dumps(self._config)
        except Exception as e:
            print e
            return "<html><body>Invalid request.</body></html>"