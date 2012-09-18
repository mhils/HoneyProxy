import urllib2, json, getpass, base64

username = raw_input("User:")
password = getpass.getpass("Password:")

params = {"scopes":["repo"],"note":"download-deploy"}
request = urllib2.Request(
    url="https://api.github.com/authorizations",
    data=json.dumps(params))
#basic auth
base64string = base64.encodestring('%s:%s' % (username, password)).replace('\n', '')
request.add_header("Authorization", "Basic %s" % base64string)

result = urllib2.urlopen(request)

token = json.loads(result.read()).get("token")

with open("github_oauth_token.txt","w") as f:
    f.write(token)
    
print "Token saved to github_oauth_token.txt!"
raw_input("Press any key to continue...")