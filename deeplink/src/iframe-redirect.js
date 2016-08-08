"use strict";
var log = require('./log').log;

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


iframeRedirect("twitter://search?query=%23hash");
