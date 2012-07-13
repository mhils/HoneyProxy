# HoneyProxy
==========

HoneyProxy is a lightweight man-in-the-middle proxy that helps you analyze HTTP(S) traffic flows. It is tailored to the needs of 
security researchers and allows both real-time and log analysis. Being compatible with [mitmproxy](http://mitmproxy.org/), it focuses on features
that are useful in a forensic context and allows extended visualization capabilites.

HoneyProxy is developed as a <img src="http://www.w3.org/html/logo/downloads/HTML5_Badge.svg" alt="HTML5" height=12> 
HTML5 browser-based application working on top of a logging core written in Python. 
It is primarily developed by Maximilian Hils and mentored by Guillaume Arcas as part of the Honeynet Google Summer of Code 2012 project.

More details can be found on the Honeynet [project page](https://honeynet.org/gsoc/slot10).

## Current Status

HoneyProxy is currently in an early beta phase. While there are still many features missing, HoneyProxy is already a nice open source alternative to other proxies such as BURP. Below you can see a screenshot of the current status - a real-time log sorted by request time.

![screenshot](http://maximilianhils.com/upload/2012-07/05-0222-3E4hbjZtObwEGtx.png)

We love to hear from your experience with HoneyProxy. If you have any feature suggestions, please get in touch :)

## Quick start

Download the [**latest release**](https://github.com/mhils/HoneyProxy/downloads) or clone the git repo: `git clone --recursive git://github.com/mhils/HoneyProxy.git`.

Install all dependencies: `pip install pyOpenSSL pyasn1 Twisted Autobahn netlib`

To start HoneyProxy, just run `python honeyproxy.py` or `python honeyproxy.py --help`. If you don't use a modern browser, a kitten will die. We currently support both Firefox and Chrome!

Most command line parameters are documented in the [mitmproxy docs](http://mitmproxy.org/doc/index.html).

### Dependencies
* [Python](http://www.python.org) 2.6.x or 2.7.x.
* [pyOpenSSL](http://pypi.python.org/pypi/pyOpenSSL) 0.12 or newer.
* [pyasn1](http://pypi.python.org/pypi/pyasn1) 0.1.2 or newer.
* [Twisted](http://twistedmatrix.com/) 12.0 or newer.
* [Autobahn](http://pypi.python.org/pypi/autobahn) 0.5.2 or newer.
* [netlib](http://pypi.python.org/pypi/netlib) 0.1 or newer.

## Contributing
==========
Anyone and everyone is welcome to contribute.
Come join us in the #gsoc2012-honeynet channel on the Freenode IRC network
(irc://irc.freenode.net:6667).