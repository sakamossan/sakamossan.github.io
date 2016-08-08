"use strict";
var log = require('./utils').log;
var isAndroid = require('./utils').isAndroid;
var replaceIntentScheme = require('./utils').replaceIntentScheme;


function iframeRedirect (url, androidAppId) {
  if (isAndroid() && androidAppId) {
    url = replaceIntentScheme(url, androidAppId);
    log("url is replaced. url: " + url);
  }

  log("iframeRedirect start with url:" + url);
  var iframe = document.createElement('iframe');

  iframe.onload = function() {
    log("iframe loaded");
    iframe.parentNode.removeChild(iframe);
  };

  iframe.src = url;
  iframe.setAttribute("style", "display:none;");
  document.body.appendChild(iframe);
  log("iframe appended");
}


window.__iframeRedirect = iframeRedirect;
