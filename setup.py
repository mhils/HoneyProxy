from distutils.core import setup
from libhproxy import dirutils, version
import py2exe

dirutils.useOwnMitmproxy()

py2exe_options = {
        "dist_dir":"dist",
        "optimize":2,
        "compressed": False,
        "bundle_files": 1
        }

setup(
    name="HoneyProxy",
    version = version.VERSION,
    url = "http://honeyproxy.org",
    console=[{
              "script":"honeyproxy.py",
              "icon_resources":[(1,"docs/logo/icon.ico")]}],
    
    options={
        "py2exe":py2exe_options
    }
)
