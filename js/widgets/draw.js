define([    
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/topic',
    'dojo/aspect',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin', 
    'dojo/on',
    'dojo/query',
    'dojo/text!templatesPath/draw/draw.html', 
    'library/xstyle/css!templatesPath/draw/css/draw.css',
    "dojo/domReady!"
     
], function (declare, lang,
             topic, aspect,
             _WidgetBase, _TemplatedMixin, on, query, 
             template) {

    return declare([_WidgetBase, _TemplatedMixin], {
        widgetsInTemplate: true,
        templateString: template,
        map: null,
        imgToBind: "data:image/png;base64,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",
        toolTip: "Draw",
        baseClass: 'OpenMap_draw', 
        mapClickMode: null,
        typeSelect: 'None',
        draw: null,
        drawsource: null,
        drawVector: null,

        /** 
        @@ widget base methods
        **/

        postCreate: function () {
            this.inherited(arguments);
            
            this.addWidgetTodiv();
            this.drawsource = new ol.source.Vector({wrapX: false});
            this.drawVector = new ol.layer.Vector({
                source: this.drawsource,
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

            this.map.addLayer(this.drawVector);
            this.own(topic.subscribe('mapClickMode/currentSet', lang.hitch(this, 'setMapClickMode'))); 
        },
        addWidgetTodiv: function () {
            //add to opener Base
            $('#' + this.divToBind).append('<img src="' + this.imgToBind + '" data-toggle="tooltip" title="' + this.toolTip + '" id="' + this._id + '" class="img-thumbnail ctoolicon" width="25" height="25" style=" background-color: rgba(255, 255, 255, 0); border: rgba(255, 255, 255, 0);" >');

            //add the onClick event
            on(query('#' + this._id), "click", lang.hitch(this, this.openWidget));
        },
        openWidget: function () {
            $('#_w2').modal();
        }, 
 
        closeModal: function (e) {

        },

        /** 
        @@ widget event methods
        **/

        StartDrawPoint: function () {
            this.typeSelect = 'Point';
            this.drawModeTextNode.innerHTML = this.typeSelect;
            if (this.draw) {
                this.map.removeInteraction(this.draw);
            }
            this.startdraw();
        },
        StartDrawCircle: function () {
            this.typeSelect = 'Circle';
            this.drawModeTextNode.innerHTML = this.typeSelect;
            if (this.draw) {
                this.map.removeInteraction(this.draw);
            }
            this.startdraw();
        },
        StartDrawPolyline: function () {
            this.typeSelect = 'LineString';
            this.drawModeTextNode.innerHTML = this.typeSelect;
            if (this.draw) {
                this.map.removeInteraction(this.draw);
            }
            this.startdraw();
        },
        StartDrawPolygon: function () {
            this.typeSelect = 'Polygon';
            this.drawModeTextNode.innerHTML = this.typeSelect;
            if (this.draw) {
                this.map.removeInteraction(this.draw);
            }
            this.startdraw();
        },
        StartDrawFPolygon: function () {
            this.typeSelect = 'Square';
            this.drawModeTextNode.innerHTML = this.typeSelect;
            if (this.draw) {
                this.map.removeInteraction(this.draw);
            }
            this.startdraw();
        },
        stopDrawing: function () {
            topic.publish('mapClickMode/setDefault');
            if (this.draw) {
                this.map.removeInteraction(this.draw);
                this.drawModeTextNode.innerHTML = 'None';
            }
        },
        clearGraphics: function () {
            this.drawsource.clear();
        },

        /** 
        @@ internal methods
        **/
        startdraw: function () {
            topic.publish('mapClickMode/setCurrent', 'draw');
            var value = this.typeSelect;
            if (value !== 'None') {
                var geometryFunction, maxPoints;
                if (value === 'Square') {
                    value = 'Circle';
                    geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
                } else if (value === 'Box') {
                    value = 'LineString';
                    maxPoints = 2;
                    geometryFunction = function (coordinates, geometry) {
                        if (!geometry) {
                            geometry = new ol.geom.Polygon(null);
                        }
                        var start = coordinates[0];
                        var end = coordinates[1];
                        geometry.setCoordinates([
                            [start, [start[0], end[1]], end, [end[0], start[1]], start]
                        ]);
                        return geometry;
                    };
                }
                this.draw = new ol.interaction.Draw({
                    source: this.drawsource,
                    type: /** @type {ol.geom.GeometryType} */ (value),
                    geometryFunction: geometryFunction,
                    maxPoints: maxPoints
                });
                this.map.addInteraction(this.draw);
            }
        },
        onLayoutChange: function (open) {
            // end drawing on close of title pane
            if (!open) {
                //this.endDrawing();
                if (this.mapClickMode === 'draw') {
                    topic.publish('mapClickMode/setDefault');
                }
                this.stopDrawing();
            }
        },
        setMapClickMode: function (mode) {
            this.mapClickMode = mode;
        }
         
    });
});
