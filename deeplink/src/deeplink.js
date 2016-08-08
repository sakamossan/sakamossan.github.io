var log = require('./log');


var Deeplink = (function() {
  "use strict";

  log("started");

  var Deeplink = function(params) {
    this.appDeeplinkURL = params.appDeeplinkURL;
    this.webFallbackURL = params.webFallbackURL;
    this.fallbackDelay = params.fallbackDelay;
    this.delta = 500;
  };

  Deeplink.prototype.openFallbackFunc = function (ts) {
    var self = this;
    var wait = this.delta + self.fallbackDelay;

    return function () {
      if ((Date.now() - ts) < wait) {
        window.open(self.webFallbackURL, '_blank');
        log("window.open called");
      }
    };
  };

  Deeplink.prototype.open = function () {
    var self = this;
    var iframe = document.createElement('iframe');
    var timeoutId = setTimeout(self.openFallbackFunc(Date.now()),
                               this.fallbackDelay);

    // iOS9.2からonloadが呼ばれなくなっている? androidでも実行されない
    iframe.onload = function() {
      log("iframe loaded, canceling fallback...");
      clearTimeout(timeoutId);
      iframe.parentNode.removeChild(iframe);
    };

    iframe.src = self.appDeeplinkURL;
    iframe.setAttribute("style", "display:none;");
    document.body.appendChild(iframe);
    log("iframe appended");
  };

  return Deeplink;
})();
