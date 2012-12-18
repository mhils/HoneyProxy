import os.path, json, ftplib
from datetime import date

filename = "snapshot-%(date)s.zip" % {"date": date.today().strftime("%Y%m%d")}
filepath = os.path.abspath("../dist/"+filename)
print "File Path: "+str(filepath)
assert os.path.isfile(filepath)
filesize = os.path.getsize(filepath)

with open("ftp_config.json","r") as f:
    config = json.loads(f.read())

print "Connecting..."

ftp = ftplib.FTP()
ftp.connect(config["host"], config["port"])

ftp.login(config["user"],config["password"])

ftp.cwd(config["uploaddir"])

print "Start Upload..."

done = float(0)
percent = 0
def progress(x):
    global done, percent
    done += len(x)
    currPercent = round(100*(done / filesize))
    if currPercent > percent:
        percent = currPercent
        print "%3d%%" % currPercent

with open(filepath,"rb") as snapshotf:
    
    #just try to delete the file
    try:
        ftp.delete(filename) 
    except ftplib.error_perm:
        pass
    #and upload...
    ftp.storbinary("STOR %s" % filename, snapshotf, callback=progress)

print "Finished!"
