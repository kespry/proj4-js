proj4-js
===

This is a light emscripten wrapper for proj4.  Presently only implements the
lat/lng/height to geocentric coordinate functions, although I intend to add
full proj4 conversion later.

Compiling
--

* Have emscripten installed.
* Download and extract proj4 as vendor/proj-<version>.  
* Run `make`.
