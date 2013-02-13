import psutil

honeyproxy_processes = filter(lambda x: x.name in "python2" and any("honeyproxy.py" in y for y in x.cmdline), psutil.process_iter())
for p in honeyproxy_processes:
	print "Kill HoneyProxy instance..."
	p.kill()