import os
from libmproxy import encoding
class DirDumper:
    def __init__(self, path):
        self.path = os.path.abspath(path)

    def add(self, flow):
        content = flow.response.content
        enc = flow.response.headers.get("content-encoding")
        if enc and enc[0] != "identity":
            decoded = encoding.decode(enc[0], content)
            if decoded:
                content = decoded
        
        #FIXME: proper filename 
        
        filename = os.path.join(self.path,flow.request.host,"response.txt")
        
        directory = os.path.split(filename)[0]
        if not os.path.isdir(directory):
            os.makedirs(directory)
        
        filename, ext = os.path.splitext(filename)
        
        appendix = ""
        while(os.path.isfile(filename+str(appendix)+ext)):
            with open(filename+str(appendix)+ext) as f:
                s = f.read()
                if(s == content):
                    return
            if(appendix == ""):
                appendix = 1
            else:
                appendix += 1
            
        filename = filename + str(appendix) + ext
            
        with open(filename, 'w') as f:
            f.write(content)