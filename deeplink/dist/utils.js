(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
  var logContainer = document.createElement('ul');
  document.body.appendChild(logContainer);

  module.exports.log = function (msg) {
    var li = document.createElement('li');
    li.innerHTML = msg;
    logContainer.appendChild(li);
    console.log(msg);
  }
})();

module.exports.isAndroid = function () {
  return navigator.userAgent.match('Android');
}

module.exports.replaceIntentScheme = function (uri, androidAppId) {
  var matches = uri.match(/([^:]+):\/\/(.+)$/i);
  var ret = "intent://" + matches[2] + "#Intent;scheme=" + matches[1];
  ret += ";package=" + androidAppId + ";end";
  return ret;
};

},{}]},{},[1]);
