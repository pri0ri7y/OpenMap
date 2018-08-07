define([
    'dojo/_base/declare'
], function (declare) {
    return declare(null, {
        constructor: function (options) {
            this.options = options;
            this.startup();
        },
        startup: function () {
            this.options.map.addControl
                (new ol.control.OverviewMap({ className: 'ol-overviewmap ol-custom-overviewmap' }));
        }
    });
});