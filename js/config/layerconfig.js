define(["dojo/_base/declare",
        "dojo/_base/lang",
        'dojo/_base/array'
        
],
   function (declare, lang, array) {
       return declare(null, {
           constructor: function (options) {
               lang.mixin(this, options);
               this.addLayersToMap();
           },
           addLayersToMap: function(){
           
               var t = this;
               this.layers = [];   

               array.forEach(this.operationalLayers, function (layer) {

                   var layer_type = layer.type;
                   var layer_title = layer.title;
                   var layer_options = layer.options;
                   var layerControlLayerInfos = layer.layerControlLayerInfos;
                   var visibleOn = layer_options.visible;
               
                   if (layer.type == 'GeoMediaImageWMS') {                   
                       var layer = new ol.layer.Image({
                           name: layer_title,                           
                           source: new ol.source.ImageWMS(layer.options),
                           visible: visibleOn
                       });
                       layer.set('type', 'WMS');
                       t.map.addLayer(layer);
                       t.layers.push({ type: layer_type, title: layer_title, layer: layer, options: layer_options, controlOptions: layerControlLayerInfos });                  
                   }
                   else if (layer.type == 'ImageWMS') {
                       var layer = new ol.layer.Image({
                           name: layer_title,
                           extent: layer.extent,
                           source: new ol.source.ImageWMS(layer.options),
                           visible: visibleOn
                       });
                       layer.set('type', 'WMS');
                       t.map.addLayer(layer);
                       t.layers.push({ type: layer_type, title: layer_title, layer: layer, options: layer_options, controlOptions: layerControlLayerInfos });
                   }

                   else if (layer.type == 'TileWMS') {
                       var layer = new ol.layer.Tile({
                           name: layer_title,
                           extent: layer.extent,
                           source: new ol.source.TileWMS(layer.options),
                           visible: visibleOn
                       });
                       layer.set('type', 'WMS');
                       t.map.addLayer(layer);
                       t.layers.push({ type: layer_type, title: layer_title, layer: layer, options: layer_options, controlOptions: layerControlLayerInfos });
                   }

                   else if (layer.type == 'Heatmap') {
                       var layer = new ol.layer.Heatmap({
                           name: layer_title,
                           source: new ol.source.Vector({
                               url: layer.options.url,
                               format: new ol.format.KML({
                                   extractStyles: false
                               })
                           }),
                           blur: layer.blur,
                           radius: layer.radius
                       });
                       layer.set('type', 'WMS');
                       t.map.addLayer(layer);
                       t.layers.push({ type: layer_type, title: layer_title, layer: layer, options: layer_options, controlOptions: layerControlLayerInfos });
                   }

                   else if (layer.type == 'TileArcGISRest') {
                       var layer = new ol.layer.Tile({
                           name: layer_title,
                           extent: [-13884991, 2870341, -7455066, 6338219],
                           source: new ol.source.TileArcGISRest(layer.options)
                       });
                       layer.set('type','WMS');
                       t.map.addLayer(layer);
                       t.layers.push({ type: layer_type, title: layer_title, layer: layer, options: layer_options, controlOptions: layerControlLayerInfos });
                   }

                   else if (layer.type == 'Vector') {
                       var format = null;

                       if (layer.options.format == 'EsriJSON') {
                           format = new ol.format.EsriJSON();
                       }
                       else if (layer.options.format == 'GeoJSON') {
                           format = new ol.format.GeoJSON();
                       }
                       else if (layer.options.format == 'TopoJSON') {
                           format = new ol.format.TopoJSON();
                       }
                       else if (layer.options.format == 'IGC') {
                           format = new ol.format.IGC();
                       }
                       else if (layer.options.format == 'Polyline') {
                           format = new ol.format.Polyline();
                       }
                       else if (layer.options.format == 'WKT') {
                           format = new ol.format.WKT();
                       }
                       else if (layer.options.format == 'GMLBase') {
                           format = new ol.format.GMLBase();
                       }
                       else if (layer.options.format == 'GPX') {
                           format = new ol.format.GPX();
                       }
                       else if (layer.options.format == 'KML') {
                           format = new ol.format.KML();
                       }
                       else if (layer.options.format == 'OSMXML') {
                           format = new ol.format.OSMXML();
                       }
                       else if (layer.options.format == 'WFS') {
                           format = new ol.format.WFS();
                       }

                       var layer = new ol.layer.Vector({
                           name: layer_title,
                           source: new ol.source.Vector({
                               format: format,
                               url: layer.options.url
                           })
                       });
                       layer.set('type', 'VECTOR');
                       t.map.addLayer(layer);
                       t.layers.push({ type: layer_type, title: layer_title, layer: layer, options: layer_options, controlOptions: layerControlLayerInfos });
                   }

               }); 
           }
           
       });
   });