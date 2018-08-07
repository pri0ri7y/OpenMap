
define([
        "dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",    
        "dojo/text!templatesPath/measurement/measurement.html",
        "dojo/_base/lang",        
        "dojo/on",
        "dojo/query",
        "dojo/dom-construct",
        "dojo/parser",
        'dojo/topic',
        'dojo/aspect',
        'dojo/_base/array',
        'library/xstyle/css!templatesPath/measurement/css/Measurement.css',
        "dojo/domReady!"
], function (declare, _WidgetBase, _TemplatedMixin, template, lang, on, query, domConstruct, parser, topic, aspect, array) {
    return declare([_WidgetBase, _TemplatedMixin], {
        widgetsInTemplate: true,
        templateString: template,
        map: null,
        imgToBind: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAABhlBMVEUAAAAzMzMzMzMyMjJEREBEREAzMzMzMzMzMzMyMjJEREBEREBEREA0NDQ0NDQzMzMyMjJEREBEREAzMzMzMzMzMzM0NDQ0NDQ0NDQ1NTREREAxMTEzMzNEREBEREAyMjIxMTEzMzIqKiowMDA7Ozk3NzYyMjIxMTEvLy80NDQAAAA0NDQ2NjUzMzMzMzM0NDQfHx0tLS0zMzMxMTEzMzIyMjIyMjItLSozMzMzMzMqKiozMzMzMzMUFBMyMjIxMTEyMjIzMzMAAAAyMjIxMTExMTE2NjUxMTE0NDQ9PTlPT00zMzM0NDQsLCsxMTEyMjIzMzMyMjI0NDQzMzMxMTEzMzM4ODgxMTE0NDQ0NDQ1NTQyMjIxMTA8PDkuLi40NDQ1NTQ2NjUyMjIxMTE0NDQ0NDQyMjIzMzMzMzM2NjU0NDQzMzMzMzM7OzgwMDA3NzZAQD8zMzMzMzMyMjIxMTE1NTQzMzMzMzM0NDMzMzMxMTE0NDQyMjIzMzMaGhk0NDMzMzM0NDSyCAKzAAAAf3RSTlMAPMc3AwQ98+80AQcI8+piMwoLRYCBhYb0NQI07g0Ptvo0Bh0oWff8EE4B7z7GebAEEcwaMzKcBqOgEstsA6Hra5QCpuwSPyukEQVfoxrSp/5apcFhnhLtY/A/QQ0TKOWkQPb3Ta6+KF49LOrwDy9EClmf+Lk9qrovpro9z+kDLJjhHQAAAe1JREFUOE+Nk+lb00AQh1dpbUwqJLUepJtKFQRJ0KikWo+AC9RWiiCIWsX7pN73LZP/3Mlk06bBD/ZLf8+809nZt88y9n+fHTsHMjJmstsT25XbUnZTUrW8pqYS8j2DQ4qih1WjYGB1b7G4b/+BoS4/ODhslhSuM9MqWyZWDgEEQTDS+/0wVrGjIjk7fGR07CiMR3wgF/KJY5O6YjsRx0mOzadkw/GtEy47eQpOm45tT/e4V8UGFe9x5izUzp2HC3i+w7nX5QwbVC2Lt73owwzM0n5e2CE5u5QzjTyZEHMw5Ub7eXx+waoTZxOXrYIWrSFq0GhaVwRGbzHm4Z2N2ITbCFpLV5epmuBWzE2r2QC+ci3NTclVzO4qrImYXy/1cyPMYh2qkt+4qVQSnGkFyqJ6K55fUtr1Hs/kjdhvvS3Pv922K9F09JCV/3qCo1OFYmSyj98RbOMunq+TU2kyyVf8e/cfhOdjx3TXZMgf0nzhw6PHT2gnj9tO12TM0enT4JmL389fmJu2rW/j6HQVfME6L1+9Lm9y3iGuJjg6rYH/Zib3tmy9W4P3xI0kR6cf4CPxT1CkAdrnPo6bfoGvzR7PfEtx3LQVfN/4EXIy+fNXiuOmLfhNPGFSvimZ/qwTT5hMv8nJTpRi/s83Tekv84trMQ/+wcAAAAAASUVORK5CYII=",
        toolTip: "Measurement",
        mapClickMode: null,
        typeSelect: 'None', 
        isGeodesic: false,
        wgs84Sphere: new ol.Sphere(6378137),
        measureSource: null,
        measureVector: null,
        sketch: null,
        helpTooltipElement: null,
        helpTooltip: null,
        measureTooltipElement: null,
        measureTooltip: null,
        measureTooltipArray: [],
        continuePolygonMsg: 'Click to continue drawing the polygon',
        continueLineMsg: 'Click to continue drawing the line',
        draw: null,

        /** 
        @@ widget base methods
        **/

        postCreate: function () {
            this.inherited(arguments);  
            this.addWidgetTodiv(); 
            var t = this;
            this.measureSource = new ol.source.Vector();
            this.measureVector = new ol.layer.Vector({
                source: t.measureSource,
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: '#ffcc33'
                        })
                    })
                })
            });
            this.map.addLayer(this.measureVector);
            this.own(topic.subscribe('mapClickMode/currentSet', lang.hitch(this, 'setMapClickMode')));            
            this.geodesicModeTextNode.innerHTML = 'geodesic mode off';

        },
        addWidgetTodiv: function () {
            //add to opener Base
            $('#' + this.divToBind).append('<img src="' + this.imgToBind + '" data-toggle="tooltip" title="' + this.toolTip + '" id="' + this._id + '" class="img-thumbnail ctoolicon" width="25" height="25" style=" background-color: rgba(255, 255, 255, 0); border: rgba(255, 255, 255, 0);" >');
   
            //add the onClick event
            on(query('#' + this._id), "click", lang.hitch(this, this.openWidget));             
        },
        openWidget: function () {
            $('#_w1').modal();
        },
        startHelp: function (e) { 
            this.trip = new Trip([                                 
                                  {
                                      sel: $('#w1ModalArea .ms-line'),
                                      content: 'click this for line measurement',
                                      position: 's',                                      
                                      delay: 3500
                                  },
                                  {
                                      sel: $('#w1ModalArea .ms-polygon'),
                                      content: 'click this for area measurement',
                                      position: 's',                                     
                                      delay: 3500
                                  },
                                 
                                  {
                                      sel: $('#w1ModalArea .fa-refresh'),
                                      content: 'click this for clearing the measurement',
                                      position: 's',                                      
                                      delay: 3500
                                  },                              
                                  {
                                      sel: $('#w1ModalArea .fa-stop-circle'),
                                      content: 'click this to stop measurement',
                                      position: 's',
                                      delay: 3500
                                  },
                                  {
                                      sel: $('#w1ModalArea .fa-globe'),
                                      content: 'enable this for geodesic measurement',
                                      position: 's',
                                      delay: 3500
                                  }]);
            this.trip.start();
        },
        closeModal: function (e) {

        },

        /** 
        @@ widget event methods
        **/

        stopMeasurement: function (e) {
            topic.publish('mapClickMode/setDefault');
            if (this.draw) {
                this.map.removeInteraction(this.draw);
                this.measureModeTextNode.innerHTML = 'None';

                this.isGeodesic = false;
                this.geodesicModeTextNode.innerHTML = 'geodesic mode off';
            }
        },
        startMeasureLength: function (e) {
            this.typeSelect = 'length';
            this.measureModeTextNode.innerHTML = this.typeSelect;
            if (this.draw) {
                this.map.removeInteraction(this.draw);
            }
            this.startMeasure();
        },
        startMeasureArea: function (e) {
            this.typeSelect = 'area';
            this.measureModeTextNode.innerHTML = this.typeSelect;
            if (this.draw) {
                this.map.removeInteraction(this.draw);
            }
            this.startMeasure();
        },      
        clearMeasurement: function (e) {
            var t = this;
            this.measureSource.clear();
            this.map.removeOverlay(this.helpTooltip);

            array.forEach(t.measureTooltipArray, function (overlay) {
                t.map.removeOverlay(overlay);
            });
            this.isGeodesic = false;
            this.geodesicModeTextNode.innerHTML = 'geodesic mode off';
        },
        geodesic: function (e) {

            if (this.isGeodesic) {
                this.isGeodesic = false;
                this.geodesicModeTextNode.innerHTML = 'geodesic mode off';
            } else { this.isGeodesic = true; this.geodesicModeTextNode.innerHTML = 'geodesic mode on'; }
             
        },

        /** 
        @@ internal methods
        **/

        setMapClickMode: function (mode) {
            this.mapClickMode = mode; 
        },
        startMeasure: function () {
            var t = this;
            topic.publish('mapClickMode/setCurrent', 'measure');
            t.addInteraction();
            t.map.on('pointermove', t.pointerMoveHandler);
            t.map.getViewport().addEventListener('mouseout', function () {
                $(t.helpTooltipElement).addClass('hidden');
            });
        },
        addInteraction: function () {

            var t = this;
            var type = (t.typeSelect == 'area' ? 'Polygon' : 'LineString');

            t.draw = new ol.interaction.Draw({
                source: t.measureSource,
                type: /** @type {ol.geom.GeometryType} */ (type),
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0, 0, 0, 0.5)',
                        lineDash: [10, 10],
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 5,
                        stroke: new ol.style.Stroke({
                            color: 'rgba(0, 0, 0, 0.7)'
                        }),
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.2)'
                        })
                    })
                })
            });
            t.map.addInteraction(t.draw);

            t.createMeasureTooltip();
            t.createHelpTooltip();

            var listener;
            t.draw.on('drawstart',
                function (evt) {
                    // set sketch
                    t.sketch = evt.feature;

                    /** @type {ol.Coordinate|undefined} */
                    var tooltipCoord = evt.coordinate;

                    listener = t.sketch.getGeometry().on('change', function (evt) {
                        var geom = evt.target;
                        var output;
                        if (geom instanceof ol.geom.Polygon) {
                            output = t.formatArea(/** @type {ol.geom.Polygon} */(geom));
                            tooltipCoord = geom.getInteriorPoint().getCoordinates();
                        } else if (geom instanceof ol.geom.LineString) {
                            output = t.formatLength(/** @type {ol.geom.LineString} */(geom));
                            tooltipCoord = geom.getLastCoordinate();
                        }
                        t.measureTooltipElement.innerHTML = output;
                        t.measureTooltip.setPosition(tooltipCoord);
                    });
                }, this);

            t.draw.on('drawend',
                function (evt) {
                    t.measureTooltipElement.className = 'tooltip tooltip-static';
                    t.measureTooltip.setOffset([0, -7]);
                    // unset sketch
                    t.sketch = null;
                    // unset tooltip so that a new one can be created
                    t.measureTooltipElement = null;
                    t.createMeasureTooltip();
                    ol.Observable.unByKey(listener);
                }, this);
             
        },
        formatLength: function (line) {
            var t = this;
            var length;
            if (this.isGeodesic) {
                var coordinates = line.getCoordinates();
                length = 0;
                var sourceProj = t.map.getView().getProjection();
                for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
                    var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
                    var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
                    length += t.wgs84Sphere.haversineDistance(c1, c2);
                }
            } else {
                length = Math.round(line.getLength() * 100) / 100;
            }
            var output;
            if (length > 100) {
                output = (Math.round(length / 1000 * 100) / 100) +
                ' ' + 'km';
            } else {
                output = (Math.round(length * 100) / 100) +
                ' ' + 'm';
            }
            return output;
        },
        formatArea: function (polygon) {
            var t = this;
            var area;
            if (this.isGeodesic) {
                var sourceProj = t.map.getView().getProjection();
                var geom = /** @type {ol.geom.Polygon} */(polygon.clone().transform(
                    sourceProj, 'EPSG:4326'));
                var coordinates = geom.getLinearRing(0).getCoordinates();
                area = Math.abs(t.wgs84Sphere.geodesicArea(coordinates));
            } else {
                area = polygon.getArea();
            }
            var output;
            if (area > 10000) {
                output = (Math.round(area / 1000000 * 100) / 100) +
                ' ' + 'km<sup>2</sup>';
            } else {
                output = (Math.round(area * 100) / 100) +
                ' ' + 'm<sup>2</sup>';
            }
            return output;
        },
        createHelpTooltip: function () {
            var t = this;
            if (t.helpTooltipElement) {
                t.helpTooltipElement.parentNode.removeChild(t.helpTooltipElement);
            }
            t.helpTooltipElement = document.createElement('div');
            t.helpTooltipElement.className = 'tooltip hidden';
            t.helpTooltip = new ol.Overlay({
                element: t.helpTooltipElement,
                offset: [15, 0],
                positioning: 'center-left'
            });
            t.map.addOverlay(t.helpTooltip);
        },
        createMeasureTooltip: function () {
            var t = this;
            if (t.measureTooltipElement) {
                t.measureTooltipElement.parentNode.removeChild(t.measureTooltipElement);
            }
            t.measureTooltipElement = document.createElement('div');
            t.measureTooltipElement.className = 'tooltip tooltip-measure';
            t.measureTooltip = new ol.Overlay({
                element: t.measureTooltipElement,
                offset: [0, -15],
                positioning: 'bottom-center'
            });
            t.map.addOverlay(t.measureTooltip);

            t.measureTooltipArray.push(t.measureTooltip);
        },
        pointerMoveHandler: function (evt) {
            if (evt.dragging) {
                return;
            }
            /** @type {string} */
            var helpMsg = 'Click to start drawing';

            if (this.sketch) {
                var geom = (this.sketch.getGeometry());
                if (geom instanceof ol.geom.Polygon) {
                    helpMsg = this.continuePolygonMsg;
                } else if (geom instanceof ol.geom.LineString) {
                    helpMsg = this.continueLineMsg;
                }
            }
        }
       
    });
});

