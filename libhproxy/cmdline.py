
def remove_option(parser, options):
    if(type(options) == str):
        options = [options]
    for option in options:
        parser.has_option(option) and parser.remove_option(option)

def fix_options(parser):
    '''Fix mitmproxy proxy options - we don't want all features to be present in HoneyProxy'''
    remove_option(parser,"--confdir")
    parser.add_option(
        "--confdir",
        action="store", type = "str", dest="confdir", default='./ca-cert',
        help = "Configuration directory. (./ca-cert)"
    )
    

    remove_option(parser,"-e")
    remove_option(parser,"-n")
    remove_option(parser,"-q")
    remove_option(parser,"-r")
    remove_option(parser,"-v")
    
    #client replay
    parser.option_groups.remove(parser.get_option_group("-c"))
    remove_option(parser,"-c")
    
    #server replay
    parser.option_groups.remove(parser.get_option_group("-k"))
    
    remove_option(parser,"-S")
    remove_option(parser,"-k")
    remove_option(parser,"--rheader")
    remove_option(parser,"--norefresh")
    remove_option(parser,"--no-pop")