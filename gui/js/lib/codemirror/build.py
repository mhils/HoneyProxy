files = ["codemirror.js",
         "mode-javascript.js",
         "util/continuecomment.js",
         "util/formatting.js",
         "util/simple-hint.js",
         "util/javascript-hint.js",
         "util/matchbrackets.js",
         "util/searchcursor.js",
         "util/match-highlighter.js"]
with open("codemirror.combined.js", "w") as out:
    out.write("// Combined build\n")
    out.write("// Files: %s\n\n" % " ".join(files))
    for srcfile in files:
        with open(srcfile,"r") as src:
            out.write(src.read())
