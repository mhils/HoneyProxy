import os
from libmproxy.flow import decoded

class DirDumper:
    def __init__(self, path):
        self.path = os.path.abspath(path)

    def add(self, flow):
        if(len(flow.response.content) == 0):
            return
        with decoded(flow.response):
            content_decoded = flow.response.content
        
        #get host and path
        host = flow.request.host
        if(flow.request.port != 80):
            host += "-"+str(flow.request.port)
        path = flow.request.path.split("#")[0].split("?")[0].lstrip("/\\")
        if(path == ""):
            path = "__root__"
        
        #subdir is our relative path
        subdir = os.path.join(host,path)
        
        #forbid relative directory changes.
        subdir = "/".join(i.lstrip(".") for i in subdir.replace("\\","/").split("/"))
        subdir = "/".join(i[:25]+"[HoneyProxy - cut off]"+i[-25:] if (len(i) > 50) else i for i in subdir.split("/"))
        
        #remove invalid characters
        subdir = os.path.normpath("".join(i for i in subdir if i not in r':*?"<>|'))
        
        #cut off too long filenames
        MAX_DIR_LENGTH  = 200
        MAX_FILE_LENGTH = 200
        MAX_EXT_LENGTH  = 30
        if(len(subdir) > MAX_DIR_LENGTH):
            if(subdir[MAX_DIR_LENGTH] == "/"):
                subdir = subdir[0:MAX_DIR_LENGTH+1]
            else:
                subdir = subdir[0:MAX_DIR_LENGTH]
            subdir += "[HoneyProxy - cut off]"
        
        #ensure that subdir is relative, otherwise it could exploit outside of self.path
        #os.path.join(foo,"/bar") => "/bar"
        subdir = os.path.normpath("./"+subdir)
        
        filename = os.path.join(self.path,subdir)
        
        #We have the problematic situation that a both foo.com/bar
        #and foo.com/bar/baz can be both valid files.
        #However, we cannot create both a folder and a file both called "baz" in the same directory
        #A possible approach would be using folders for everything and placing __resource__ files in them.
        #While this would be a much consistent structure, it doesn't represent the file system very well.
        #As this view is for visualization purposes only, we took the approach to append [dir] to conflicting folders.
        #to accomplish this, we use a slightly modified version of os.makedirs
        def makedirs(directory):
            head,tail = os.path.split(directory)
            if not os.path.isdir(head):
                head = makedirs(head)
                directory = os.path.join(head,tail)
            if(os.path.isfile(directory)): #our special case - rename current dir
                tail += "[dir]"
                directory = os.path.join(head,tail)
                return makedirs(directory)
            if(not os.path.isdir(directory)):
                os.mkdir(directory)  
            return directory
        d, filename = os.path.split(filename)
        filename = os.path.join(makedirs(d),filename)
        
        filename, ext = os.path.splitext(filename)
        if(len(filename) > MAX_DIR_LENGTH+MAX_FILE_LENGTH):
            filename = filename[0:MAX_DIR_LENGTH+MAX_FILE_LENGTH]+"[...]"
        if(len(ext) >= MAX_EXT_LENGTH):
            ext = "[..]" + ext[-MAX_EXT_LENGTH:]
        appendix = ""
        
        if(os.path.isdir(filename+ext)):
            os.rename(filename+ext, filename+ext+"[dir]")
        while(os.path.isfile(filename+str(appendix)+ext)):
            with open(filename+str(appendix)+ext) as f:
                s = f.read()
                if(s == content_decoded):
                    return
            if(appendix == ""):
                appendix = 1
            else:
                appendix += 1
            
        filename = filename + str(appendix) + ext
                    
        with open(filename, 'wb') as f:
            f.write(str(content_decoded))