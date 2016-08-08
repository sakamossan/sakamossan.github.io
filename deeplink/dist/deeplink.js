(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var logContainer = document.createElement('ul');
document.body.appendChild(logContainer);

function log (msg) {
  var li = document.createElement('li');
  li.innerHTML = msg;
  logContainer.appendChild(li);
  console.log(msg);
}

module.exports.log = log;

},{}],2:[function(require,module,exports){
var log = require('./common').log;


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

},{"./common":1}]},{},[2]);
