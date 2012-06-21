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

While HoneyProxy is usable at its current state, some highly desireable features are still missing. Below you can see a screenshot of the current status - a real-time log sorted by request time.

![screenshot](http://maximilianhils.com/upload/2012-06/22-0101-RuD200uVXlgd4Tl.png)

## Quick start

Clone the git repo - `git clone git://github.com/mhils/HoneyProxy.git` - or [download it](https://github.com/mhils/HoneyProxy/zipball/master)

Install all dependencies listed below.

### Dependencies
* [Python](http://www.python.org) 2.6.x or 2.7.x.
* [PyOpenSSL](http://pypi.python.org/pypi/pyOpenSSL) 0.12 or newer.
* [pyasn1](http://pypi.python.org/pypi/pyasn1) 0.1.2 or newer.
* [Twisted](http://twistedmatrix.com/) 12.0 or newer.
* [Autobahn](http://pypi.python.org/pypi/autobahn) 0.5.2 or newer.

## Contributing
==========
Anyone and everyone is welcome to contribute.
Come join us in the #gsoc2012-honeynet channel on the Freenode IRC network
(irc://irc.freenode.net:6667).