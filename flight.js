var arDrone = require('ar-drone');
var client = arDrone.createClient();

var referenceHeight = 2;

client.config('general:navdata_demo', 'FALSE');

client.takeoff();

client.on('navdata', function(nav) {
  console.log(nav);
  console.log(nav.demo.altitudeMeters);
  if (nav.droneState.flying == 1) {
    if (nav.demo.altitudeMeters >= referenceHeight) {
      this.stop();
    } else {
      this.up(0.1);
    }
  }
});

client
  .after(30000, function() {
    this.stop();
    this.land();
  });