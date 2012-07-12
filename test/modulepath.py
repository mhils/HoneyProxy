import inspect, os

print __file__
print os.path.abspath(__file__)
print os.path.abspath(inspect.getfile(inspect.currentframe()))
print "==="

print inspect.getfile(inspect.currentframe())
print os.path.split(inspect.getfile( inspect.currentframe() ))[0]
print os.path.split(inspect.getfile( inspect.currentframe() ))[0] + "/mitmproxy"
print "==="

print os.path.abspath(os.path.split(inspect.getfile( inspect.currentframe() ))[0])
print os.path.abspath(os.path.split(inspect.getfile( inspect.currentframe() ))[0] + "/mitmproxy")
print os.path.abspath(os.path.split(inspect.getfile( inspect.currentframe() ))[0]) + "/mitmproxy"
print "==="

print os.path.realpath(os.path.abspath(os.path.split(inspect.getfile( inspect.currentframe() ))[0]))
print os.path.realpath(os.path.abspath(os.path.split(inspect.getfile( inspect.currentframe() ))[0] + "/mitmproxy"))
print os.path.realpath(os.path.abspath(os.path.split(inspect.getfile( inspect.currentframe() ))[0]) + "/mitmproxy")