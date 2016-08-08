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
