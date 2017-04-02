var geocent = require("./geocent");

var converter = new geocent(geocent.WGS84);

var out = converter.geodeticToGeocentric(-121, 37, 0)
console.log(out, converter.geocentricToGeodetic(out[0], out[1], out[2]));
