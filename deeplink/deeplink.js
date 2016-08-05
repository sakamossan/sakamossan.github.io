var Deeplink = (function() {
  "use strict";

  var Deeplink = function(params) {
    this.appDeeplinkURL = params.appDeeplinkURL;
    this.webFallbackURL = params.webFallbackURL;
    this.fallbackDelay = params.fallbackDelay;
  };

  Deeplink.prototype.open = function () {
    var self = this;
    var iframe = document.createElement("iframe");

    var fallbackTimeout = setTimeout(function(){
      iframe.parentNode.removeChild(iframe);
      window.location.href = self.webFallbackURL;
    }, this.fallbackDelay);

    iframe.onload = function() {
      clearTimeout(fallbackTimeout);
      iframe.parentNode.removeChild(iframe);
      window.location.href = self.appDeeplinkURL;
    };

    iframe.src = self.appDeeplinkURL;
    iframe.setAttribute("style", "display:none;");
    document.body.appendChild(iframe);
  };

  return Deeplink;
})();
