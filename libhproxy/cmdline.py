
def fix_options(parser):
    '''Fix mitmproxy proxy options - we don't want all features to be present in HoneyProxy'''
    parser.remove_option("--confdir")
    parser.add_option(
        "--confdir",
        action="store", type = "str", dest="confdir", default='./ca-cert',
        help = "Configuration directory. (./ca-cert)"
    )
    parser.remove_option("-e")
    parser.remove_option("-n")
    parser.remove_option("-q")
    parser.remove_option("-r")
    parser.remove_option("-v")
    
    #client replay
    parser.option_groups.remove(parser.get_option_group("-c"))
    parser.remove_option("-c")
    
    #server replay
    parser.option_groups.remove(parser.get_option_group("-S"))
    parser.remove_option("-S")
    parser.remove_option("-k")
    parser.remove_option("--rheader")
    parser.remove_option("--norefresh")
    parser.remove_option("--no-pop")