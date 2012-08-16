var profile = {
    releaseDir: "./release",
 
    basePath: ".",
 
    action: "release",
 
    cssOptimize: "comments",
 
    mini: true,
 
    optimize: "closure",
 
    layerOptimize: "closure",
 
    stripConsole: "all",
 
    selectorEngine: "acme",
    packages:[{
        name:"HoneyProxy",
        location:"../HoneyProxy"
    }],
    
    
    layers: {
        "dojo/dojo": {
            include: [ "dojo/dojo", "HoneyProxy/MainLayout" ],
            customBase: true,
            boot: true
        }
    },
 
    resourceTags: {
        amd: function (filename, mid) {
            return /\.js$/.test(filename);
        }
    }
};