from datetime import datetime
import pytz

f = open("./dump/access.log","a")

def response(context, flow):
    size = str(len(flow.response.content))
    if(size == "0"):
        size = "-"
    logstr = ('%(addr)s - - [%(timestamp)s] "%(method)s %(path)s HTTP/%(httpver)s" %(code)i %(size)s "%(referer)s" "%(ua)s"\n' %
        {
         'addr': flow.request.client_conn.address[0],
         'timestamp': datetime.fromtimestamp(flow.request.timestamp_start).replace(tzinfo=pytz.utc).strftime('%d/%b/%Y:%H:%M:%S %z'),
         'method': flow.request.method,
         'path': flow.request.path,
         'httpver': ".".join(str(i) for i in flow.request.httpversion),
         'code': flow.response.code,
         'size': size,
         'referer': flow.request.headers.get("Referer",["-"])[0],
         'ua': flow.request.headers.get("User-Agent",["-"])[0] 
         })
    f.write(logstr)
    """
            
            
        addr + 
        ' - - [' +
        datetime.fromtimestamp(flow.request.timestamp).strftime('%d/%b/%Y:%H:%M:%S %z')+
        '] "' +
        flow.request.method +
        ' '+
        flow.request.path +
        ' HTTP/' + flow.request.httpversion.join(".") + 
        '" ' + 
        str(flow.response.code) +
        ' ' + str(len(flow.response.content)) +
        ' "'+referer +'" "'+ua
        ""\n")"""
    f.flush()
