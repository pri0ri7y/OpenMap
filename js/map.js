/**
Author ~ pri0ri7y !!
Map.js
loads all the necessary modules and instantiates all major classes/widgets.

**/
require(["dojo/_base/lang",
         "js/config/bootstrapconfig.js",
         "js/config/mapconfig.js",
         "js/config/layerconfig.js",
         "js/config/widgetconfig.js",
         "dojo/text!baseconfig/basemapconfig.json",
         "dojo/text!baseconfig/operationallayers.json",
         "dojo/domReady!"],
 function (lang, bootstrapconfig, mapconfig, layerconfig, widgetconfig, basemapconfig, operationallayers) {

     /**                                 **\
     * Bootstrap events configuration area *
     \**                                 **/
     app.bootConfig = new bootstrapconfig();

     /*************************************/


     /**
     * basemap configuration is done in config/json/basemapconfig.json
     * Note: 1. visible property is mandatory. 
     *       2. Only one must be visible at the starting of the application.
     *     Example : 
     *     ***  custom base map only in case of OSM.
     *     ***  "customBaseMapName": {
	 *		        "type": "custom",
	 *		        "title": "OSM",
	 *		        "visible": false, //visibility in map
	 *		        "custom": true, // indicate if it is custom or not
	 *		        "customUrl": "//{a-n}.tile.custom.com/custom/{z}/{x}/{y}.png",
	 *		        "imgb64": "image_to_bind_in_basemap_app_as_base_64"
	 *	        },
     *
     *     ***  other usual base maps as ol.layer.Tile.
     *     ***  "basemapName": {
	 *		        "type": "_type_",
	 *		        "title": "_title_",
	 *		        "visible": true, //visibility in map 
	 *		        "url": "_url_", //example: http://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer
	 *		        "imgb64": "image_to_bind_in_basemap_app_as_base_64"
	 *	        },
     *
     *
     **/
    jarvisGlobal = new Artyom(); 

     //ol3 map instance.     
     app.mapObj = {};
     app.mapObj = new ol.Map(new mapconfig({
         mapDiv: 'mapDiv',
         zoom: 4, 
         lng: -100,  
         lt:  39,  
         extnt: [-13884991, 2870341, -7455066, 6338219],
         basemapConfig: JSON.parse(basemapconfig),
         bmapDiv: 'bmapDiv'
     }).mConfig);


     /**
     * operational layers configuration is done in config/json/operationallayers.json
     * Note:  1. available "type" in this application is "GeoMediaImageWMS", "ImageWMS", "TileWMS", "Heatmap", "TileArcGISRest", "Vector"
     *        2. formats available in "Vector" : ["EsriJSON", "GeoJSON", "TopoJSON", "IGC", "Polyline", "WKT", "GMLBase", "GPX", "KML", "OSMXML", "WFS" ]
     *
     *   Example: 
     *         
     *          [
     *                {
     *                    type: 'TileWMS',
     *                    title: 'USA',
     *                    extent: [-13884991, 2870341, -7455066, 6338219],
     *                    options: {
     *                        serverType: 'geoserver',
     *                        params: {
     *                            LAYERS: 'ne:ne',
     *                            STYLES: '',
     *                            VERSION: '1.3.0',
     *                            TILED: true
     *                        },
     *                        ratio: 1.5,
     *                        url: 'http://demo.boundlessgeo.com/geoserver/wms'
     *                    }
     *
     *                },
     *                {
     *                    type: 'Vector',
     *                    title: 'GeoJSON Countries',
     *                    extent: [-13884991, 2870341, -7455066, 6338219],
     *                    options: {
     *                        format: 'GeoJSON',
     *                        url: 'http://openlayers.org/en/v3.9.0/examples/data/geojson/countries.geojson'
     *                    }
     *
     *                },
     *                {
     *                    type: 'Heatmap',
     *                    title: 'Earthquakes heatmap',
     *                    url: 'http://openlayers.org/en/v3.9.0/examples/data/kml/2012_Earthquakes_Mag5.kml',
     *                    format: 'KML',
     *                    blur: 10,
     *                    radius: 10,
     *                    options: {
     *                        url: 'http://openlayers.org/en/v3.9.0/examples/data/kml/2012_Earthquakes_Mag5.kml'
     *                    }
     *
     *                },
     *                {
     *                    type: 'TileArcGISRest',
     *                    title: 'Tiled ArcGIS MapServer',
     *                    extent: [-13884991, 2870341, -7455066, 6338219],
     *                    options: {
     *                        params: {
     *                            FORMAT: 'PNG32',
     *                            TRANSPARENT: true
     *                        },
     *                        url: 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer'
     *                    }
     *
     *                }
     *                ...
     *                ..
     *                .
     *
     *           ]
     * 
     *
     **/

     app.lyrObj = new layerconfig({
         map: app.mapObj,
         operationalLayers: JSON.parse(operationallayers)
     });


     /* 
      * Widget Config Details
      *   w1 :  Measurement
      *   w2 :  Draw
      *   w3 :  Overview Map
      *   w4 :  Layer Control
      *   w5 :  Geolocate
      *   w6 :  Print // to be added later.
      *   w7 :  I-Tool
      *
      */
     
    ///// throw an alert that only chrome is supported, and they gotta install /////
    if(window.chrome != undefined)
    { console.log('Chrome browser detected.');  }
    else
    { alert('Only chrome Version 60+ is supported. Contact MetroBIM team for other details'); }
   
     app.widgetObj = new widgetconfig({
         addToApp: ['w1', 'w2', 'w3', 'w4', 'w5', 'w6','w7','jarvis'],
         map: app.mapObj,
         divToBind: 'toolDiv',
         displayDiv: 'toolDisplayDiv',
         layersObject: app.lyrObj,         
         useVoiceRecognition: true
     });


});

 