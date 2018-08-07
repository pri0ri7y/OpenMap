define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/topic',
    'dijit/form/Button',
    'dojo/dom-attr',
    "dojo/query",
    "dojo/on"
], function (declare, lang, topic, Button, domAttr, query, on) {
    return declare(null, {
        buttonShowStyle: 'display: block;',
        buttonNoShowStyle: 'display: none;',
        growlTemplate: 'latitude: {latitude}<br/>longitude: {longitude}<br/>accuracy: {accuracy}<br/>altitude: {altitude}<br/>altitude accuracy: {altitudeAccuracy}<br/>heading: {heading}<br/>speed: {speed}',
        constructor: function (options, node) {
            this.options = options;
            this.parentNode = node;
            this.startup();
        },
        startup: function () {

            var t = this;

            this.geolocation = new ol.Geolocation({
                projection: t.options.map.getView().getProjection()
            });
            this.geolocation.on('change', function () {                
                t._growlLocation();
            });
            this.geolocation.on('error', function (error) {
                console.log(error.message);
            });

            var accuracyFeature = new ol.Feature();
            this.geolocation.on('change:accuracyGeometry', function () {
                accuracyFeature.setGeometry(t.geolocation.getAccuracyGeometry());
            });

            var positionFeature = new ol.Feature();
            positionFeature.setStyle(new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 4,
                    fill: new ol.style.Fill({
                        color: '#3399CC'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#fff',
                        width: 2
                    })
                })
            }));

            this.geolocation.on('change:position', function () {
                var coordinates = t.geolocation.getPosition();
                positionFeature.setGeometry(coordinates ?
                    new ol.geom.Point(coordinates) : null);
 
                t.options.map.getView().setCenter(coordinates);                

            });

            this.featuresGPSOverlay = new ol.layer.Vector({
                map: t.options.map,
                source: new ol.source.Vector({
                    features: [accuracyFeature, positionFeature]
                })
            });                     

            on(query(this.options.start),'click', lang.hitch(this, this._locateStart));
            on(query(this.options.stop), 'click', lang.hitch(this, this._locateStop));

            //this.locateButton.on('locate', lang.hitch(this, '_growlLocation'));
        },

        _locateStart: function () {
            this.geolocation.setTracking(true);
            $(this.options.start).css('display', 'none');
            $(this.options.stop).css('display', 'block');             
            this.featuresGPSOverlay.setVisible(true);           
        },

        _locateStop: function () {
            this.geolocation.setTracking(false);
            $(this.options.start).css('display', 'block');
            $(this.options.stop).css('display', 'none');
            this.featuresGPSOverlay.setVisible(false);
        },

        _growlLocation: function () {
            var t = this;
            var stats = {
                accuracy: (t.geolocation.getAccuracy()) ? t.geolocation.getAccuracy() : '',
                altitude: (t.geolocation.getAltitude()) ? t.geolocation.getAltitude() : '',
                altitudeAccuracy: (t.geolocation.getAltitudeAccuracy()) ? t.geolocation.getAltitudeAccuracy() : '',
                heading: (t.geolocation.getHeading()) ? t.geolocation.getHeading() : '',
                latitude: (t.geolocation.getPosition()[0]) ? t.geolocation.getPosition()[0] : '',
                longitude: (t.geolocation.getPosition()[1]) ? t.geolocation.getPosition()[1] : '',
                speed: (t.geolocation.getSpeed()) ? t.geolocation.getSpeed() : ''
            };

            if (this.options.publishGPSPosition) {
                topic.publish('growler/growl', {
                    title: 'GPS Position',
                    message: lang.replace(this.growlTemplate, stats),
                    level: 'success', //can be: 'default', 'warning', 'info', 'error', 'success'.
                    timeout: 4000, //set to 0 for no timeout
                    opacity: 1.0
                });
            }
        }
    });
});