from libmproxy import flow, controller
from libmproxy.flow import FlowMaster

class HoneyProxyMaster(FlowMaster):
    def __init__(self, server, options, sessionFactory):
        FlowMaster.__init__(self, server, flow.State())        
        
        self.sessionFactory = sessionFactory

    def start(self):
        #see controller.Master.run()
        global should_exit
        should_exit = False
        self.server.start_slave(controller.Slave, self.masterq)
        
    def tick(self):
        if not should_exit:
            controller.Master.tick(self, self.masterq)
        else:
            self.shutdown()

    def handle_request(self, request):
        flow = FlowMaster.handle_request(self, request)
        
        if flow:
            request._ack()
            print "request to "+request.host
            self.sessionFactory.write(request.host)
            
        return flow

    def handle_response(self, response):
        flow = FlowMaster.handle_response(self, response)
        
        if flow:
            response._ack()
            print "response from "+flow.request.host
            
        return flow