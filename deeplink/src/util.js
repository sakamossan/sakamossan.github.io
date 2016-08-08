var logContainer = document.createElement('ul');
document.body.appendChild(logContainer);

function log (msg) {
  var li = document.createElement('li');
  li.innerHTML = msg;
  logContainer.appendChild(li);
  console.log(msg);
}

module.exports.log = log;
