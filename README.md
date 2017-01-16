# This project has moved.
HoneyProxy is now part of mitmproxy: http://docs.mitmproxy.org/en/stable/mitmweb.html

HoneyProxy
==========

HoneyProxy is a lightweight man-in-the-middle proxy that helps you analyze HTTP(S) traffic flows. It is tailored to the needs of 
security researchers and allows both real-time and log analysis. Being compatible with [mitmproxy](http://mitmproxy.org/), it focuses on features
that are useful in a forensic context and allows extended visualization capabilites.

HoneyProxy is developed as a <img src="http://www.w3.org/html/logo/downloads/HTML5_Badge.svg" alt="HTML5" height=12> 
HTML5 browser-based application working on top of a logging core written in Python. 
It is primarily developed by Maximilian Hils and mentored by Guillaume Arcas as part of the Honeynet Google Summer of Code 2012 project.

More details can be found on the Honeynet [project page](https://honeynet.org/gsoc/slot10) and [honeyproxy.org](http://honeyproxy.org).

## Current Status

HoneyProxy has grown steadily over the last months and is considered to be stable now. While there are still some features missing, HoneyProxy is already a nice open source alternative to other proxies such as BURP. Below you can see a screenshot of the current status.

![screenshot](http://honeyproxy.org/img/current-status.png)

We love to hear from your experience with HoneyProxy. If you have any feature suggestions, please get in touch :)

## Quick start

Download the [**latest release**](http://honeyproxy.org/download/honeyproxy-latest.zip), a [development snapshot](http://honeyproxy.org/download.html) or clone the git repo: `git clone --recursive git://github.com/mhils/HoneyProxy.git`.

**Install all dependencies**: `pip install pyOpenSSL pyasn1 Twisted Autobahn`   
Windows users: Install the binaries for [pyOpenSSL](http://pypi.python.org/pypi/pyOpenSSL) and [Twisted](http://twistedmatrix.com/trac/wiki/Downloads) manually.   
Ubuntu / Debian users: Install twisted as a package (sudo apt-get install python-twisted)

**Start HoneyProxy** with `python honeyproxy.py` or `python honeyproxy.py --help`.   
If you don't use a modern browser, a kitten will die. We currently support both Firefox and Chrome!

Most command line parameters are documented in the [mitmproxy docs](http://mitmproxy.org/doc/index.html).

### Dependencies
* [Python](http://www.python.org) 2.7.x.
* [pyOpenSSL](http://pypi.python.org/pypi/pyOpenSSL) 0.12 or newer.
* [pyasn1](http://pypi.python.org/pypi/pyasn1) 0.1.2 or newer.
* [Twisted](http://twistedmatrix.com/) 12.3.0 or newer.

## Contributing
==========
Anyone and everyone is welcome to contribute. If you have any questions, feel free to ping me directly or open a ticket at GitHub. I'll try to answer as soon as possible.
