"use strict";
var log = require('./util').log;

function iframeRedirect (url) {
  log("iframeRedirect start");
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

module.exports =
window.__iframeRedirect = iframeRedirect;
