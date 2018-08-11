/*global google */
/*jshint unused:true */
define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'dojo/aspect',
    'dojo/topic',
    'dojo/text!templatesPath/streetview/streetview.html',
    'dojo/dom-style',
    'dijit/MenuItem',
    'dojo/on',
    'dojo/query',
    '//cdnjs.cloudflare.com/ajax/libs/proj4js/2.2.2/proj4.js',
    'dojo/i18n!templatesPath/streetview/nls/resource',
    'dijit/form/Button',
    'library/xstyle/css!templatesPath/streetview/css/streetview.css'
 
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, aspect, topic,
             template, domStyle, MenuItem,on,query, proj4, i18n) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: template,
        i18n: i18n,
        imgToBind: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACYUlEQVRYR+3XSchOYRQH8N9nzpBINgplSAmRDAtZmJLCwryQnQXKkKQkFlhQCCllRZSNhDKVEjKEnYiFaSGFJLOio+fV9Xrv+9378S7kO8t7z/B//uf0PP/TpGU2GmPwEefwrGVpaCoZ2AmHMCcT9wWrsbdkrh/uZQFEkWU5habifFkQZQB0wSt0yClyEjMbCWAw7tcpcBdDGwmge2KgTU6RoD/aUMrKtCASH8HCnArzcaxU9RYMYQ+cxviqQtuxDt8aDSDyt8OsdA98SIBuli1c8S/agp7Yh7iA8mLiPjiMrWWYKArgKBYUPOUihH8hKwrgAQYWysgurCroW/gmfIgBBZPuxsqCvq0AWhn4dxi4jZEFJ3szNhX0LczAIEzDPEzISb4fATQuoXd/G0AlXz1FNB1nihYu+xb8nwD6YjLGptct7vd49/NEabTgKTbiMS7jIt7Wa0v1YxRyK5TNihqiY2IawnoApiSJXqn5CcexA7dqAckCCNV7ApMyju9xHZewBTubYeAe1iexMiKjHUIpbUha4RccWQAhJCI47Cz24ALiFBXL+lQfKGTatczHXmmBWZN5yqOdN7KBWQCnMANXEXR/rUFZ1yRKO1b9i9Us2KulCfsnOR/7xFIcyAOwPJ06/of+P5iShhgpKzbbYxzmYgm64XPaG0Jb/LQsAzGA27C2Svc9TzdcBMaUv0yTHQkjPvbF2Bl6ox+GYBQ6Z+q8xmIEy7kzUPkxPCma2QgZ/icW7IVQDUEbwH+zepqwbXqAgsphaZD6IIYrKI2eRmtiRX+DF3iS2ncHV/CoOfTfAUlLfCGJDWKyAAAAAElFTkSuQmCC",
        toolTip: "streetview",
        baseClass: 'OpenMap_streetview',   
        mapClickMode: null,
        panoOptions: {
            addressControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT
            },
            linksControl: false,
            panControl: false,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL
            },
            enableCloseButton: false
        },

        // in case this changes some day
        proj4BaseURL: 'http://spatialreference.org/',

        //  options are ESRI, EPSG and SR-ORG
        // See http://spatialreference.org/ for more information
        proj4Catalog: 'EPSG',

        // if desired, you can load a projection file from your server
        // instead of using one from spatialreference.org
        // i.e., http://server/projections/102642.js
        projCustomURL: null,

        postCreate: function () {

            this.inherited(arguments);            
            this.addWidgetTodiv();          

            //this.createGraphicsLayer();
            this.map.on('click', lang.hitch(this, 'getStreetView'));

            this.own(topic.subscribe('mapClickMode/currentSet', lang.hitch(this, 'setMapClickMode')));

            if (this.parentWidget) {
                if (this.parentWidget.toggleable) {
                    this.own(aspect.after(this.parentWidget, 'toggle', lang.hitch(this, function () {
                        this.onLayoutChange(this.parentWidget.open);
                    })));
                }
                this.own(aspect.after(this.parentWidget, 'resize', lang.hitch(this, function () {
                    if (this.panorama) {
                        google.maps.event.trigger(this.panorama, 'resize');
                    }
                })));
            }

            // spatialreference.org uses the old
            // Proj4js style so we need an alias
            // https://github.com/proj4js/proj4js/issues/23
            window.Proj4js = proj4;

            if (this.mapRightClickMenu) {
                this.addRightClickMenu();
            }
        },

        addWidgetTodiv: function () {
            //add to opener Base
            $('#' + this.divToBind).append('<img src="' + this.imgToBind + '" data-toggle="tooltip" title="' + this.toolTip + '" id="' + this._id + '" class="img-thumbnail ctoolicon" width="25" height="25" style=" background-color: rgba(255, 255, 255, 0); border: rgba(255, 255, 255, 0);" >');

            //add the onClick event
            on(query('#' + this._id), "click", lang.hitch(this, this.openWidget));
        },
        openWidget: function () {
            $('#_w10').modal();
            this.onOpen();
        },

        disablestreetview: function () {

            this.onClose();
        },


        addRightClickMenu: function () {

            var t = this;
            this.map.getViewport().addEventListener('contextmenu', function (evt) {
                evt.preventDefault();
                var pixel = t.map.getEventPixel(evt);
                t.mapRightClickPoint = t.map.getCoordinateFromPixel(pixel);
            });
            this.mapRightClickMenu.addChild(new MenuItem({
                label: this.i18n.rightClickMenuItem.label,
                onClick: lang.hitch(this, 'streetViewFromMapRightClick')
            }));
        },
        onOpen: function () {
            //this.pointGraphics.show();
            if (!this.panorama || !this.panoramaService) {
                this.panorama = new google.maps.StreetViewPanorama(this.panoNode, this.panoOptions);
                this.panoramaService = new google.maps.StreetViewService();
            }
            if (this.panorama) {
                google.maps.event.trigger(this.panorama, 'resize');
            }
        },
        onClose: function () {
            // end streetview on close of title pane
            //this.pointGraphics.hide();

            if (this.vectorLayer) {
                this.map.removeLayer(this.vectorLayer);
            }

            if (this.mapClickMode === 'streetview') {
                this.connectMapClick();
            }
        },
        onLayoutChange: function (open) {
            if (open) {
                this.onOpen();
            } else {
                this.onClose();
            }
        },
        placePoint: function () {
            this.disconnectMapClick();
            //get map click, set up listener in post create
        },
        disconnectMapClick: function () {
            //this.map.setMapCursor('crosshair');
            topic.publish('mapClickMode/setCurrent', 'streetview');
        },
        connectMapClick: function () {
            //this.map.setMapCursor('auto');
            topic.publish('mapClickMode/setDefault');
        },
        clearGraphics: function () {
            //this.pointGraphics.clear();
            domStyle.set(this.noStreetViewResults, 'display', 'block');
        },
        enableStreetViewClick: function () {
            this.disconnectMapClick();
        },
        disableStreetViewClick: function () {
            this.connectMapClick();
        },
        getStreetView: function (evt, overRide) {

            if (this.mapClickMode === 'streetview' || overRide) {
                var mapPoint = evt.coordinate;
                if (!mapPoint) {
                    return;
                }

                if (this.parentWidget && !this.parentWidget.open) {
                    this.parentWidget.toggle();
                }

                // convert the map point's coordinate system into lat/long
                var view = this.map.getView();
                var projection = view.getProjection();
                var str = projection.getCode();
                var res = str.split(':');

                this.spatialReferenceWKID = res[1];

                var geometry = null,
                    wkid = this.spatialReferenceWKID;
                if (wkid === 102100) {
                    wkid = 3857;
                }
                var key = this.proj4Catalog + ':' + wkid;
                if (!proj4.defs[key]) {
                    var url = this.proj4CustomURL || this.proj4BaseURL + 'ref/' + this.proj4Catalog.toLowerCase() + '/' + wkid + '/proj4js/';
                    require([url], lang.hitch(this, 'getStreetView', evt, true));
                    return;
                }
                // only need one projection as we are
                // converting to WGS84 lat/long
                var projPoint = proj4(proj4.defs[key]).inverse([mapPoint[0], mapPoint[1]]);
                if (projPoint) {
                    geometry = {
                        x: projPoint[0],
                        y: projPoint[1]
                    };
                }

                if (geometry) {
                    domStyle.set(this.noStreetViewResults, 'display', 'none');
                    domStyle.set(this.loadingStreetView, 'display', 'inline-block');
                    this.getPanoramaLocation(geometry);
                } else {
                    this.setPanoPlace = null;
                    this.clearGraphics();
                    domStyle.set(this.noStreetViewResults, 'display', 'block');
                }
            }

        },
        getPanoramaLocation: function (geoPoint) {
            var place = new google.maps.LatLng(geoPoint.y, geoPoint.x);
            this.panoramaService.getPanoramaByLocation(place, 50, lang.hitch(this, 'getPanoramaByLocationComplete', geoPoint));
            // Panorama Events -- Changed location
            google.maps.event.addListener(this.panorama, 'position_changed', lang.hitch(this, 'setPlaceMarkerPosition'));
            // Panorama Events -- Changed Rotation
            google.maps.event.addListener(this.panorama, 'pov_changed', lang.hitch(this, 'setPlaceMarkerRotation'));
        },
        getPanoramaByLocationComplete: function (geoPoint, StreetViewPanoramaData, StreetViewStatus) {
            domStyle.set(this.loadingStreetView, 'display', 'none');
            if (StreetViewStatus === 'OK') {
                this.disableStreetViewClick();
                var place = new google.maps.LatLng(geoPoint.y, geoPoint.x);
                this.setPanoPlace = place;
                this.firstSet = true;
                this.panorama.setPosition(place);
            } else if (StreetViewStatus === 'ZERO_RESULTS') {
                this.setPanoPlace = null;
                this.clearGraphics();
                // reset default map click mode
                this.connectMapClick();
                domStyle.set(this.noStreetViewResults, 'display', 'block');
            } else {
                this.setPanoPlace = null;
                this.clearGraphics();
                topic.publish('viewer/handleError', {
                    source: 'StreetView',
                    error: 'Unknown.'
                });
            }
        },
        setPlaceMarkerPosition: function () {

            if (this.vectorLayer) {
                this.map.removeLayer(this.vectorLayer);
            }
            // get the new lat/long from streetview
            var panoPosition = this.panorama.getPosition();
            var positionLat = panoPosition.lat();
            var positionLong = panoPosition.lng();
            var pov = this.panorama.getPov();
            var headingRadians = pov.heading * (Math.PI/180);

            this.vectorLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.transform([positionLong, positionLat], 'EPSG:4326',
                            'EPSG:3857')),
                        name: 'Null Island',
                        population: 4000,
                        rainfall: 500
                    })]
                }),
                style: new ol.style.Style({
                    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                        anchor: [0.5, 0.5],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        opacity: 1,
                        src: 'js/widgets/templates/streetview/images/blueArrow.png',
                        rotation: headingRadians
                    }))
                })
            });
            this.map.addLayer(this.vectorLayer);

            // Make sure they are numbers
            if (!isNaN(positionLat) && !isNaN(positionLong)) {
                // convert the resulting lat/long to the map's spatial reference
                var xy = null,
                    wkid = this.spatialReferenceWKID;
                if (wkid === 102100) {
                    wkid = 3857;
                }
                var key = this.proj4Catalog + ':' + wkid;
                if (!proj4.defs[key]) {
                    var url = this.proj4CustomURL || this.proj4BaseURL + 'ref/' + this.proj4Catalog.toLowerCase() + '/' + wkid + '/proj4js/';
                    require([url], lang.hitch(this, 'setPlaceMarkerPosition'));
                    return;
                }
            }
        },
        setPlaceMarkerRotation: function () {

            var pov = this.panorama.getPov();
            var panoPosition = this.panorama.getPosition();
            var positionLat = panoPosition.lat();
            var positionLong = panoPosition.lng();
            var headingRadians = pov.heading * (Math.PI/180);

            if (this.vectorLayer) {
                this.map.removeLayer(this.vectorLayer);
            }

            this.vectorLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.transform([positionLong, positionLat], 'EPSG:4326',
                            'EPSG:3857'))
                    })]
                }),
                style: new ol.style.Style({
                    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                        anchor: [0.5, 0.5],
                        anchorXUnits: 'fraction',
                        anchorXUnits: 'fraction',
                        opacity: 1,
                        src: 'js/gis/dijit/StreetView/images/blueArrow.png',
                        rotation: headingRadians
                    }))
                })
            });

            this.map.addLayer(this.vectorLayer);


        },
        streetViewFromMapRightClick: function () {
            var evt = {
                coordinate: this.mapRightClickPoint
            };
            this.getStreetView(evt, true);
        },
        setMapClickMode: function (mode) {
            this.mapClickMode = mode;
        }
    });
});