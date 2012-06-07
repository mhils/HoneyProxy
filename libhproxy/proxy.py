from libmproxy import flow, controller, filt
from libmproxy.flow import FlowMaster
import os
from flowcollection import FlowCollection

class ProxyError(Exception): pass

#HoneyProxyMaster has some similarities to DumpMaster, 
#but we don't want the server/client replay stuff to be in HoneyProxy
class HoneyProxyMaster(FlowMaster):
    def __init__(self, server, options, filtstr, sessionFactory):
        FlowMaster.__init__(self, server, flow.State())        
        
        self.sessionFactory = sessionFactory
        self.o = options
        self.flows = FlowCollection()
        self.anticache = options.anticache
        self.anticomp = options.anticomp
        
        if filtstr:
            self.filt = filt.parse(filtstr)
        else:
            self.filt = None
            
        if options.stickycookie:
            self.set_stickycookie(options.stickycookie)

        if options.stickyauth:
            self.set_stickyauth(options.stickyauth)

        #TODO: Add auto-dump
        if options.wfile:
            path = os.path.expanduser(options.wfile)
            try:
                f = file(path, "wb")
                self.fwriter = flow.FlowWriter(f)
            except IOError, v:
                raise Exception(v.strerror)

        if options.replacements:
            for i in options.replacements:
                self.replacehooks.add(*i)
                
        if options.script:
            err = self.load_script(options.script)
            if err:
                raise Exception(err)
            
        if options.rfile:
            path = os.path.expanduser(options.rfile)
            try:
                f = file(path, "r")
                freader = flow.FlowReader(f)
            except IOError, v:
                raise ProxyError(v.strerror)
            try:
                self.load_flows(freader)
            except flow.FlowReadError, v:
                raise ProxyError(v)
            
    def getFlowCollection(self):
        return self.flows

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
            
    def shutdown(self):
        if(self.o.wfile):
            self.fwriter.fo.close()
        return FlowMaster.shutdown(self)

    def handle_request(self, request):
        flow = FlowMaster.handle_request(self, request)
        
        if flow:
            request._ack()
            #print "request to "+request.host
            #self.sessionFactory.write(request.host)
            
        return flow

    def handle_response(self, response):
        flow = FlowMaster.handle_response(self, response)
        
        if flow:
            response._ack()
            flowId = self.flows.addFlow(flow)
            if self.o.wfile:
                self.fwriter.add(flow)
            #print "response from "+flow.request.host
            self.sessionFactory.msg("newflow",{"data":self.flows.getFlowsAsJSON()[flowId]})
            
        return flow