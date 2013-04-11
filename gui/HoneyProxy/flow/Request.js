/**
 * Proxy object for better access to Flows. Be aware that both Request and
 * Response objects are stateless!
 */

define(["dojo/Deferred", "../utilities", "./FlowPropertyDecorator", "./sharedFlowProperties"], function(Deferred, utilities, FlowPropertyDecorator, sharedFlowProperties) {
  "use strict";

  var requestDecorator = new FlowPropertyDecorator("request");

  requestDecorator.addProperties(sharedFlowProperties);

  var defaultPorts = {
    "http": 80,
    "https": 443
  };

  requestDecorator.addProperties({
    hostFormatted: {
      func: function() {
        return this.host_guess ? this.host_guess : this.host;
      },
      deps: ["?host", "?host_guess"]
    },
    hasFormData: {
      func: function() {
        return this.hasContent && this.contentType && !! this.contentType.match(/^application\/x-www-form-urlencoded\s*(;.*)?$/i);
      },
      deps: ["hasContent", "contentType"]
    },
    hasPayload: {
      func: function() {
        return this.hasContent && (!this.hasFormData);
      },
      deps: ["hasContent", "hasFormData"]
    },

    getFormData: {
      func: function() {
        var formData;
        return function(reset) {
          if (!formData) {
            formData = new Deferred();
            this.getContent().then(function(data) {
              var data = utilities.parseParameters(data);
              formData.resolve(data);
            });
          }
          return formData;
        }
      }
    },

    filename: {
      func: function() {
        var path = this.path.split("?", 1)[0]; 
        var lastSlashIndex = path.lastIndexOf("/");
        var lastSegmentContainsDot = (path.indexOf(".",lastSlashIndex) >= 0);
        if(lastSegmentContainsDot) {
          return path.substr(lastSlashIndex+1);
        } else {
          return path;
        }
      },
      deps: ["path"]
    },
    queryString: {
      func: function() {
        var begin = this.path.indexOf("?");
        return begin >= 0 ? this.path.substr(begin) : "";
      },
      deps: ["path"]
    },

    fullPath: {
      func: function() {
        var fullpath = this.scheme + "://" + this.hostFormatted;
        if (!(this.scheme in defaultPorts) || defaultPorts[this.scheme] !== this.port)
          fullpath += ":" + this.port;
        fullpath += this.path.split("?", 1)[0];
        return fullpath;
      },
      deps: ["scheme", "hostFormatted", "port", "path"]
    },
    rawFirstLine: {
      func: function() {
        return [this.method, this.path, "HTTP/" + this.httpversion.join(".")]
          .join(" ") + "\n";
      },
      deps: ["method", "path", "httpversion"]
    }
  });
  
  return requestDecorator;

});