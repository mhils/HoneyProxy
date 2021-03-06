import os, re
from libmproxy import encoding
from urllib2 import unquote 
allowed_chars = re.compile("[^\\w\\-\\.\\\\\\/]")

class DirDumper:
    """
    The dirdumper dumps all response objects to disk.
    
    Todo: Dump request content, too.
    """
    def __init__(self, path):
        self.path = os.path.abspath(path)

    def add(self, flow):
        """
        Gets called whenever a new flow has been added.
        """
        
        #dumping empty flows is stupid
        if(len(flow.response.content) == 0):
            return
        
        content = flow.response.content
        enc = flow.response.headers.get("content-encoding")
        if enc and enc[0] != "identity":
            decoded = encoding.decode(enc[0], content)
            if decoded:
                content = decoded
        
        #get host and path
        host = flow.request.host
        if(flow.request.port != 80):
            host += "-"+str(flow.request.port)
        path = unquote(flow.request.path.split("#")[0].split("?")[0].lstrip("/\\"))
        if(path == ""):
            path = "__root__"
        
        #subdir is our relative path
        subdir = os.path.join(host,path)

        #remove invalid characters
        subdir = os.path.normpath(allowed_chars.sub('_', subdir))
        
        #forbid relative directory changes.
        subdir = "/".join(i.lstrip(".") for i in subdir.replace("\\","/").split("/"))
        subdir = "/".join(i[:20]+"[...]"+i[-20:] if (len(i) > 40) else i for i in subdir.split("/"))
        
        
        #cut off too long filenames
        MAX_DIR_LENGTH  = 150
        MAX_FILE_LENGTH = 50
        MAX_EXT_LENGTH  = 30
        if(len(subdir) > MAX_DIR_LENGTH):
            if(subdir[MAX_DIR_LENGTH] == "/"):
                subdir = subdir[0:MAX_DIR_LENGTH+1]
            else:
                subdir = subdir[0:MAX_DIR_LENGTH]
            subdir += "[...]"
        
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
        
        
        #rename if file already exists and content is different
        if(os.path.isdir(filename+ext)):
            os.rename(filename+ext, filename+ext+"[dir]")
        while(os.path.isfile(filename+str(appendix)+ext)):
            with open(filename+str(appendix)+ext,"rb") as f:
                s = f.read()
                if(s == content):
                    return
            if(appendix == ""):
                appendix = 1
            else:
                appendix += 1
            
        filename = filename + str(appendix) + ext
                    
        with open(filename, 'wb') as f:
            f.write(str(content))
