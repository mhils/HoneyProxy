import os.path, urllib, pycurl as curl, cStringIO, json
from datetime import date
config = {
    "user": "mhils",
    "repo": "HoneyProxy"
}
filename = "snapshot-%(date)s.zip" % {"date": date.today().strftime("%Y%m%d")}
filepath = os.path.abspath("../dist/"+filename)
assert os.path.isfile(filepath)
filesize = os.path.getsize(filepath)

def common_curl_options(c):
    
    c.setopt(curl.CAINFO, os.path.abspath("cacert.pem"))
    #c.setopt(curl.FAILONERROR, True)
    #c.setopt(curl.VERBOSE, True)
    #c.setopt(curl.SSL_VERIFYPEER, 0)   
    #c.setopt(curl.SSL_VERIFYHOST, 0)
    #c.setopt(curl.PROXY, 'http://localhost:8080')

buf = cStringIO.StringIO()
c = curl.Curl()
common_curl_options(c)
c.setopt(curl.URL, 'https://api.github.com/repos/%(user)s/%(repo)s/downloads' % config)
c.setopt(curl.WRITEFUNCTION, buf.write)

with open("github_oauth_token.txt","r") as f:
    c.setopt(curl.HTTPHEADER, ['Authorization: token ' + f.read()])

params = {"name":filename, "size":filesize}
c.setopt(curl.POSTFIELDS,json.dumps(params))
print "Create Download @ GitHub..."
c.perform()
data = json.loads(buf.getvalue())
buf.close()
c.close()
print "Download created."

#s3 upload
c = curl.Curl()
common_curl_options(c)
c.setopt(curl.URL,str(data.get("s3_url")))
class ProgressDisplay:
    last_progress = -1
    def progress(self,download_t, download_d, upload_t, upload_d):
        if(upload_t > 0):
            progress = int(100 * upload_d / upload_t)
            if(progress - self.last_progress > 0):
                print "%02d%%" % progress
                self.last_progress = progress
        
c.setopt(c.NOPROGRESS, 0)
c.setopt(curl.WRITEFUNCTION, cStringIO.StringIO().write)
c.setopt(curl.PROGRESSFUNCTION, ProgressDisplay().progress)
values = [
     ("key", str(data.get("path"))),
     ("acl",str(data.get("acl"))),
     ("success_action_status","201"),
     ("Filename",str(data.get("name"))),
     ("AWSAccessKeyId",str(data.get("accesskeyid"))),
     ("Policy",str(data.get("policy"))),
     ("Signature",str(data.get("signature"))),
     ("Content-Type",str(data.get("mime_type"))),
     ("file", (curl.FORM_FILE, filepath))
]
c.setopt(curl.HTTPPOST, values)
print "Start Upload..."
c.perform()
c.close()
print "Finished!"