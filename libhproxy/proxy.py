from libmproxy import flow, controller
from libmproxy.flow import FlowMaster
import os
from flowcollection import FlowCollection
from dirdumper import DirDumper

class ProxyError(Exception): pass

class HoneyProxyMaster(FlowMaster):
    """
        The HoneyProxy proxy core, in some parts pretty similar to mitmproxys DumpMaster.
    """
    def __init__(self, server, options, sessionFactory):
        FlowMaster.__init__(self, server, flow.State())        
        
        self.sessionFactory = sessionFactory
        self.o = options
        self.flows = FlowCollection()
        self.anticache = options.anticache
        self.anticomp = options.anticomp
            
        if options.stickycookie:
            self.set_stickycookie(options.stickycookie)

        if options.stickyauth:
            self.set_stickyauth(options.stickyauth)

        if options.wfile:
            path = os.path.expanduser(options.wfile)
            directory = os.path.split(path)[0]
            if not os.path.exists(directory):
                os.makedirs(directory)
            try:
                f = file(path, "wb")
                self.fwriter = flow.FlowWriter(f)
            except IOError, v:
                raise Exception(v.strerror)
            
        if options.dumpdir:
            path = os.path.expanduser(options.dumpdir)
            if not os.path.exists(path):
                os.makedirs(path)
            if os.listdir(path):
                print "Notice: Your dump directory (%s) is not empty." % path
                print "HoneyProxy won't overwrite your files."
            self.dirdumper = DirDumper(path)

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
                f = file(path, "rb")
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
            if self.o.dumpdir:
                self.dirdumper.add(flow)
            #print "response from "+flow.request.host
            self.sessionFactory.onNewFlow(self.flows.getFlowsSerialized()[flowId])
            
        return flow