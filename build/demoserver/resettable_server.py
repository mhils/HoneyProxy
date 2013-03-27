from bottle import route, run, debug
from os import system
from time import time
#import psutil

debug(False)

restart_secret = 'changeme'

@route('/restart/:secret')
def restart(secret):
        if secret != restart_secret:
                return "wrong secret"
        honeyproxy_processes = filter(lambda x: x.name in "python" and any("honeyproxy.py" in y for y in x.cmdline), psutil.process_iter())
        for p in honeyproxy_processes:
                p.kill()
        t = time()
        system("nohup python honeyproxy/honeyproxy.py -w %d.dump > %d.log 2> %d.err < /dev/null &" % (t, t, t))
        return "instance resetted."

run(host='0.0.0.0', port=8000)


