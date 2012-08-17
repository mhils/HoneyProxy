import argparse
"""
see mitmproxy/libmproxy/cmdline
we remove all unwanted parameters and add everything we need for HoneyProxy
"""
def suppress_option(parser, options):
    if(type(options) == str):
        options = [options]
    for option in options:
        for action in parser._actions:
            if(option in action.option_strings):
                action.help = argparse.SUPPRESS
                return
        print "Warning: Command line switch "+str(option)+" doesn't exist. Your version of mitmproxy might be incompatible."

def convert_arg_line_to_args(self, arg_line):
    if arg_line.lstrip().startswith("#"):
        return
    for arg in arg_line.split():
        if not arg.strip():
            continue
        yield arg

def suppress_group(parser, option):
    for action_group in parser._action_groups:
            if(option == action_group.title):
                action_group.title = action_group.description = argparse.SUPPRESS 
                return
    print "Warning: Command line group "+str(option)+" doesn't exist. Your version of mitmproxy might be incompatible."

def allow_overwrite(parser, option):
    for action in parser._actions:
        if(option in action.option_strings):
            action.container.conflict_handler = "resolve"

def fix_options(parser):
    '''Fix mitmproxy proxy options - we don't want all features to be present in HoneyProxy'''
    suppress_option(parser,"--confdir")
    allow_overwrite(parser,"--confdir")
    parser.add_argument(
        "--confdir",
        action="store", type = str, dest="confdir", default='./ca-cert',
        help = "Configuration directory. (./ca-cert)"
    )
    
    parser.add_argument(
        "--dump-dir",
        action="store", type = str, dest="dumpdir", default=None,
        help = "Folder to dump all response objects into"
    )
    
    parser.add_argument(
        "--apiport",
        action="store", type = int, dest="apiport", default=8082,
        help = "WebSocket API service port."
    )
    parser.add_argument(
        "--guiport",
        action="store", type = int, dest="guiport", default=8081,
        help = "GUI service port."
    )
    
    parser.add_argument(
        "--api-auth",
        action="store", type = str, dest="apiauth", default=None,
        help = "API auth key / shared secret"
    )
    
    parser.add_argument(
        "--no-gui",
        action="store_true", dest="nogui",
        help="Don't open GUI in browser"
    )    

    suppress_option(parser,"-e")
    suppress_option(parser,"-q")
    suppress_option(parser,"-v")
    
    #client replay
    suppress_group(parser,"Client Replay")
    suppress_option(parser,"-c")
    
    #server replay
    suppress_group(parser,"Server Replay")
    
    suppress_option(parser,"-S")
    suppress_option(parser,"-k")
    suppress_option(parser,"--rheader")
    suppress_option(parser,"--norefresh")
    suppress_option(parser,"--no-pop")