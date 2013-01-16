/*jshint unused:false */
var dojoConfig = {
	async: true,
	basePath: "..",
	baseUrl: "./js",
	
	packages: [ {
		name: "HoneyProxy",
		location: "./HoneyProxy"
	}, {
		name: "ReportScripts",
		location: "/api/fs/report_scripts"
	}, {
		name: "jquery",
		main: "jquery",
		location: "./lib/jquery",
		destLocation:"./lib/jquery"
	}, {
		name: "highlight",
		main: "highlight",
		location: "./lib/highlight",
		destLocation:"./lib/highlight"
	}, {
		name: "lodash",
		main: "lodash",
		location: "./lib/lodash",
		destLocation:"./lib/lodash"
	},  {
		name: "codemirror",
		location: "./lib/codemirror",
		destLocation:"./lib/codemirror"
	}, {
    name: "dojo",
    location: "./lib/dojo",
    destLocation:"./lib/dojo"
	}, {
    name: "dijit",
    location: "./lib/dijit",
    destLocation:"./lib/dijit"
	}, {
    name: "dojox",
    location: "./lib/dojox",
    destLocation:"./lib/dojox"
	}, {
    name: "legacy",
    location: "./lib/legacy",
    destLocation:"./lib/legacy"
	}
	]
};