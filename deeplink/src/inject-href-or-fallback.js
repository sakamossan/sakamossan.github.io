"use strict";
var log = require('./utils').log;


function injectHrefOrFallBack (appUrl, webUrl) {
  log("inject-href-or-fallback start with urls:" + appUrl + webUrl);

  var fallbackTimeoutId = setTimeout(function () {
    log("fallback called");
    location.href = webUrl;
  }, 1000);

  log("injecting appUrl...");
  location.href = appUrl;
}


window.__injectHrefOrFallBack = injectHrefOrFallBack;
