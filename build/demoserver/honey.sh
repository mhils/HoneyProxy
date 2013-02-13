#!/bin/sh
nohup python2 honeyproxy/honeyproxy.py @honeyproxy/scripts/demo.conf > honey.log 2> honey.err < /dev/null &