var profile = {
    basePath: "./",
    
    
    //mini: true,
    //optimize: "closure",
    //layerOptimize: "closure",
    //stripConsole: "all",
    
    releaseDir: "./release",
    hasReport: true,
    action: "release",
    packages:[
        {
            name: "dojo",
            location: "./lib/dojo",
            discard: true
        },
        {
            name: "dijit",
            location: "./lib/dijit"
        },
        {
            name: "HoneyProxy",
            location: "./HoneyProxy"
        }
    ],
    
    layers: {
        "dojo/dojo": {
            //customBase: true,
            //boot: true,
            include: [
                "HoneyProxy/main"
            ],
        },
    }
};