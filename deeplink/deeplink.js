var Deeplink = (function() {
  var Deeplink = function(params) {
    this.appDeeplinkURL = params.appDeeplinkURL;
    this.webFallbackURL = params.webFallbackURL;
    this.fallbackDelay = params.fallbackDelay;
  };

  Deeplink.prototype.open = function () {
    var iframe = document.createElement("iframe");

    var fallbackTimeout = setTimeout(function(){
      iframe.parentNode.removeChild(iframe);
      window.open(this.webFallbackURL, '_blank');
    }, this.fallbackDelay);

    iframe.onload = function() {
      clearTimeout(fallbackTimeout);
      iframe.parentNode.removeChild(iframe);
      window.location.href = this.appDeeplinkURL;
    };

    iframe.src = this.appDeeplinkURL;
    iframe.setAttribute("style", "display:none;");
    document.body.appendChild(iframe);
  };

  return Deeplink;
})();
