default: all

all: lib/geocent_lib.js

PROJ4_VERSION := 4.9.3
PROJ4_DIR := vendor/proj-$(PROJ4_VERSION)/

EMFLAGS := -O3 --memory-init-file 0

lib/geocent_lib.js: $(PROJ4_DIR)/src/geocent.c $(PROJ4_DIR)/src/geocent.h wrapper/geocent_bind.c wrapper/geocent_postfix.js wrapper/geocent_prefix.js
	emcc -I$(PROJ4_DIR)/src wrapper/geocent_bind.c  $(PROJ4_DIR)/src/geocent.c $(EMFLAGS) -o lib/geocent_lib.js --pre-js wrapper/geocent_prefix.js --post-js  wrapper/geocent_postfix.js --closure 1 -s NO_FILESYSTEM=1 -s EXPORTED_RUNTIME_METHODS='["getValue"]' -s EXPORTED_FUNCTIONS='["_pj_GeocentricInfo_Size", "_pj_Set_Geocentric_Parameters", "_pj_Get_Geocentric_Parameters", "_pj_Convert_Geodetic_To_Geocentric", "_pj_Convert_Geocentric_To_Geodetic"]'

clean:
	rm -f lib/geocent_lib.js
