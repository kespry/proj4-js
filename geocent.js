var GeocentModule = require("./lib/geocent_lib");

function pjGeocentErrorString(code) {
  if (code == 0) {
    return null;
  }
  var messages = [];
  if (code & 0x01) {
    messages.push("GEOCENT_LAT_ERROR");
  }
  if (code & 0x02) {
    messages.push("GEOCENT_LON_ERROR");
  }
  if (code & 0x04) {
    messages.push("GEOCENT_ELLIPSOID_A_ERROR");
  }
  if (code & 0x08) {
    messages.push("GEOCENT_ELLIPSOID_B_ERROR");
  }
  if (code & 0x10) {
    messages.push("GEOCENT_ELLIPSOID_A_LESS_B_ERROR");
  }
  return messages.join(" ") + "(" + code + ") ";
}

function makeGeocentricInfo(ellipsoid) {
  var info = GeocentModule._malloc(GeocentModule._pj_GeocentricInfo_Size());
  var err = GeocentModule._pj_Set_Geocentric_Parameters(info, ellipsoid["a"], ellipsoid["b"]);
  if (err != 0) {
    throw "makeGeocentricInfo error: " + pjGeocentErrorString(err);
  }
  return info;
}

function freeGeocentric(info) {
  GeocentModule._free(info);
}

function deg2rad(deg) {
  return deg / 180.0 * Math.PI;
}

function rad2deg(rad) {
  return rad / Math.PI * 180.0;
}

function GeocentricConverter(ellipsoid) {
  var info = makeGeocentricInfo(ellipsoid);
  var out = GeocentModule._malloc(24);
  return {
    geocentricToGeodetic: function(x, y, z) {
      GeocentModule._pj_Convert_Geocentric_To_Geodetic(info, x, y, z, out, out+8, out+16);

      return [
        rad2deg(GeocentModule.getValue(out, "double")),
        rad2deg(GeocentModule.getValue(out+8, "double")),
        GeocentModule.getValue(out+16, "double"),
      ];
    },

    geodeticToGeocentric: function(lng, lat, height) {
      var err = GeocentModule._pj_Convert_Geodetic_To_Geocentric(info, deg2rad(lat), deg2rad(lng), height, out, out+8, out+16);
      if (err != 0) {
        throw "geodeticToGeocentric error: " + pjGeocentErrorString(err);
      }
      return [
        GeocentModule.getValue(out, "double"),
        GeocentModule.getValue(out+8, "double"),
        GeocentModule.getValue(out+16, "double"),
      ];
    },

    dispose: function() {
      freeGeocentric(info);
      GeocentModule._free(out);
    },
  }
}

GeocentricConverter.WEB_MERCATOR_SPHERICAL = {
  a: 6378137,
  b: 6378137,
}

GeocentricConverter.WGS84 = {
  a: 6378137.0,
  b: 6356752.314,
}

module.exports = GeocentricConverter;
