var t = 0;
var launchTime = '' + Math.floor((new Date()).getTime() / 1000);
var link, canvas;	// getElementById() returns null here 

function setupScreenshotLink() {	// called from HTML
  link = document.getElementById('link');
  canvas = document.getElementById('canvas');
}

function setTimestamp(_t) {	// called from main.pde
  t = _t;
}

function getTimestamp() {
  return t;
}

function saveScreenshot() {	// called on link click
  var num = ('00000000' + t).slice(-8);
  var filename = '' + launchTime + '__' + num + '.png';
  link.setAttribute('download', filename);
  link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
  link.click();
  console.log('Saved: ' + filename);
}
