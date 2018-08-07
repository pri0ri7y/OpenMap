define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/store/Memory",
        "dojo/query",
        "dojo/on",
        'dojo/topic'
       ],
   function (declare, lang, Memory, query, on, topic) {
    return declare(null, {
        constructor: function (options) {
            lang.mixin(this, options);
            this.mConfig = {
                layers: this.createBaseMap(),
                target: this.mapDiv,
                view: new ol.View({
                    center: ol.proj.transform([this.lng, this.lt], 'EPSG:4326', 'EPSG:3857'),
                    zoom: this.zoom 
                })
            };

            topic.subscribe('baseMap/current/itool/request', lang.hitch(this,function (e) {
                topic.publish('baseMap/current/itool/response', this.currentBaseMap);
            }));
             
        },
        createBaseMap: function () {
            this.basemapLayers = [];
            this.data = [];
            this.basemapStore = new Memory({
                data: this.data
            });

            var i = 0;
            for (var key in this.basemapConfig.basemaps) {

                if (this.basemapConfig.basemaps.hasOwnProperty(key)) {
                    var value = this.basemapConfig.basemaps[key];

                    //osm
                    if (value.type == 'OSM') {

                        if (value.custom == true) {  
                            this.basemapLayers.push(new ol.layer.Tile({
                                visible: value.visible,
                                source: new ol.source.OSM({
                                    'url': value.customUrl
                                })
                            }));
                        } else {
                            this.basemapLayers.push(new ol.layer.Tile({
                                visible: value.visible,
                                source: new ol.source.OSM()
                            }));
                        }
                        this.data.push({ name: value.title, id: i });
                    }

                    //googlemap
                    if (value.type == 'GoogleMap') {
                        this.basemapLayers.push(new ol.layer.Tile({
                            visible: value.visible,
                            source: new ol.source.OSM({
                                url: 'http://mt{0-3}.google.com/vt/lyrs=' + value.style + '&x={x}&y={y}&z={z}',
                                attributions: [
                                    new ol.Attribution({ html: '© Google' }),
                                    new ol.Attribution({ html: '<a href="https://developers.google.com/maps/terms">Terms of Use.</a>' })
                                ]
                            })
                        }));
                        this.data.push({ name: value.title, id: i });
                    }

                    //esri
                    if (value.type == 'ESRI') {
                        this.basemapLayers.push(new ol.layer.Tile({
                            visible: value.visible,
                            source: new ol.source.TileArcGISRest({
                                url: value.url
                            })
                        }));
                        this.data.push({ name: value.title, id: i });
                    }

                    //other custom tiled wms
                    if (value.type == 'Tiled WMS') {
                        this.basemapLayers.push(new ol.layer.Tile({
                            visible: value.visible,
                            source: new ol.source.TileWMS({
                                url: value.url,
                                params: value.params,
                                serverType: value.serverType
                            })
                        }));
                        this.data.push({ name: value.title, id: i });                      
                         
                    }


                    if (value.visible) { this.currentBaseMap = value.title; }
                  
                }
                this.basemapLayers[i].set('name', value.title);
                //add to basemap div 
                var cnt = '<img src="' + value.imgb64 + '" data-toggle="tooltip" title="' + value.title + '" class="img-rounded cbmapicon" width="25" height="25">';
                $('#' + this.bmapDiv).append(cnt);
                on(query('#' + this.bmapDiv)[0].children[i], "click", lang.hitch(this, this.basemapClick));
                i = i + 1;
                
            }
            return this.basemapLayers;
        },
        basemapClick: function (e) {
            
            for (var i = 0; i < app.mapObj.getLayers().a.length; i++) {                
                if (app.mapObj.getLayers().a[i].R.name == e.currentTarget.title) { 
                    app.mapObj.getLayers().a[i].setVisible(true);                    
                }
                if (app.mapObj.getLayers().a[i].R.name == this.currentBaseMap) {
                    app.mapObj.getLayers().a[i].setVisible(false);
                }
            }
            this.currentBaseMap = e.currentTarget.title;
            topic.publish('baseMap/current', this.currentBaseMap);
        }
    });
});