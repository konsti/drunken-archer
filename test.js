var arDrone = require('ar-drone');
var client = arDrone.createClient();
var cv = require('opencv');
var http = require('http');

var server = http.createServer(handler);
server.listen(8000);

function handler(req, res) {
  res.writeHead(200, { 'Content-Type': 'multipart/x-mixed-replace; boundary=--daboundary' });

  var s = new cv.ImageStream()
  client.createPngStream().pipe(s);

  s.on('data', function(image) {
    image.detectObject("./node_modules/opencv/data/haarcascade_frontalface_alt.xml", {}, function(err, faces) {

      for (var i=0;i<faces.length; i++) {
        var face = faces[i];

        //console.log(face);
        image.ellipse(face.x + face.width/2, face.y + face.height/2, face.width/2, face.height/2);
      }

      res.write('--daboundary\nContent-Type: image/png\nContent-length: ' + image.toBuffer().length + '\n\n');
      res.write(image.toBuffer());
    });
  });
}