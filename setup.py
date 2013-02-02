from distutils.core import setup
from libhproxy import dirutils, version
import py2exe

dirutils.useOwnMitmproxy()

py2exe_options = {
        "dist_dir":"dist",
        "optimize":2
        }

setup(
    name="HoneyProxy",
    version = version.VERSION,
    url = "http://honeyproxy.org",
    console=['honeyproxy.py'],
    
    options={
        "py2exe":py2exe_options
    }
)
