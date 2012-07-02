
def remove_option(parser, options):
    if(type(options) == str):
        options = [options]
    for option in options:
        if parser.has_option(option):
            parser.remove_option(option)
        else:
            print "Warning: Command line switch "+str(option)+" doesn't exist. Your version of mitmproxy might be incompatible."

def remove_group(parser, option):
    if parser.has_option(option):
        if parser.get_option_group(option) in parser.option_groups:
            parser.option_groups.remove(parser.get_option_group(option))    

def fix_options(parser):
    '''Fix mitmproxy proxy options - we don't want all features to be present in HoneyProxy'''
    remove_option(parser,"--confdir")
    parser.add_option(
        "--confdir",
        action="store", type = "str", dest="confdir", default='./ca-cert',
        help = "Configuration directory. (./ca-cert)"
    )
    
    parser.add_option(
        "--apiport",
        action="store", type = "int", dest="apiport", default=8082,
        help = "WebSocket API service port."
    )
    parser.add_option(
        "--guiport",
        action="store", type = "int", dest="guiport", default=8081,
        help = "GUI service port."
    )
    
    parser.add_option(
        "--api-auth",
        action="store", type = "str", dest="apiauth", default=None,
        help = "API auth key / shared secret"
    )
    
    parser.add_option(
        "--no-gui",
        action="store_true", dest="nogui",
        help="Don't open GUI in browser"
    )    

    remove_option(parser,"-e")
    remove_option(parser,"-q")
    remove_option(parser,"-v")
    
    #client replay
    remove_group(parser,"-c")
    remove_option(parser,"-c")
    
    #server replay
    remove_group(parser,"-S")
    
    remove_option(parser,"-S")
    remove_option(parser,"-k")
    remove_option(parser,"--rheader")
    remove_option(parser,"--norefresh")
    remove_option(parser,"--no-pop")