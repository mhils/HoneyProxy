import os, sys, inspect

# Share import path fix + HoneyProxy directory

honeyproxy_dir = os.path.split(os.path.split(inspect.getfile( inspect.currentframe() ))[0])[0]

def add_subfolder(name):
    subdir = os.path.realpath(os.path.abspath(os.path.join(honeyproxy_dir,name)))
    if subdir not in sys.path:
        sys.path.insert(0, subdir)
        
def useOwnMitmproxy():
    #ensure to load our own version of mitmproxy and netlib
    #http://stackoverflow.com/questions/279237/python-import-a-module-from-a-folder
    add_subfolder("netlib")
    add_subfolder("mitmproxy")
