var profile = {
    basePath: "../gui",
    
    cssOptimize: "comments",
    mini: true,
    //optimize: "closure",
    layerOptimize: false,
    //stripConsole: "all",
    selectorEngine: "acme",
    
    releaseDir: "../dist/gui",
    hasReport: false,
    action: "release",
    layers: {
        "dojo/dojo": {
            customBase: true,
            boot: true,
            include:["HoneyProxy/main"]
        },
    }
};