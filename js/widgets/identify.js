define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'library/dijit/_OCMVMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/topic',
    'dojo/dom-construct',
    'dojo/request/xhr',
    'dojo/store/Memory',
    'dojo/text!templatesPath/identify/identify.html',
    'dojo/i18n!templatesPath/identify/nls/resource',
    'dijit/form/Form',
    'dijit/form/FilteringSelect',
    'library/xstyle/css!templatesPath/identify/css/identify.css'
], function (declare, _WidgetBase, _OCMVMixin, _TemplatedMixin, _WidgetsInTemplateMixin, lang, array, topic,
             domconstruct, xhr, Memory, IdentifyTemplate, i18n) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _OCMVMixin], {
        widgetsInTemplate: true,
        templateString: IdentifyTemplate,
        baseClass: 'gis_IdentifyDijit',
        i18n: i18n,
        mapClickMode: null,
        postCreate: function () {
            var t = this;
            this.inherited(arguments);
          
  
        
            var container = document.getElementById('popup');
            var content = document.getElementById('popup-content');
            var closer = document.getElementById('popup-closer');

            /**
             * Add a click handler to hide the popup.
             * @return {boolean} Don't follow the href.
             */
            closer.onclick = function () {
                overlay.setPosition(undefined);
                closer.blur();
                return false;
            };

            /**
             * Create an overlay to anchor the popup to the map.
             */
            var overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
                element: container,
                autoPan: true,
                autoPanAnimation: {
                    duration: 250
                }
            }));

            this.map.addOverlay(overlay);

            var identifyItems = [];

            var i = this.basemaps.length - 1;

            array.forEach(this.layers, function (layer) {

                if (layer.type == 'ImageWMS' || layer.type == 'TileWMS') {

                    identifyItems.push({
                        name: layer.title,
                        id: i,
                        layer: layer.layer,
                        options: layer.options
                    });
                }

                i = i + 1;
            });


            var identify = new Memory({
                data: identifyItems
            });
            this.identifyLayerDijit.set('store', identify);
            this.identifyLayerDijit.set('value', this.basemaps.length - 1);


            var view = this.map.getView();

            this.own(topic.subscribe('mapClickMode/currentSet', lang.hitch(this, 'setMapClickMode')));

            this.map.on('singleclick', function (evt) {

                if (t.mapClickMode === 'identify') {
                    var wmsSource = t.identifyLayerDijit.item.layer.getSource();
                    var viewResolution = /** @type {number} */ (view.getResolution());
                    var url = wmsSource.getGetFeatureInfoUrl(
                        evt.coordinate,
                        viewResolution,
                        'EPSG:3857',
                        {
                            'INFO_FORMAT': 'application/json'
                        }
                    );

                    if (url) {
                    
                        if (true){ //setting default as false as no proxy is being used
                            url = 'https://pri0ri7y.com/proxy/getWMS_info.php?url=' + url;
                        }
                        
                        xhr(url, {
                            handleAs: 'json',
                            headers: {
                                "X-Requested-With": null                         
                            }
                        }).then(function (result) {
                                var obj = result;

                                var fieldsToShow = [];
                                for (var property0 in t.identifies) {
                                    if(property0 == t.identifyLayerDijit.item.name){
                                        for(var item in t.identifies[property0]){
                                            if(item){
                                                fieldsToShow.push(t.identifies[property0][item]);
                                            }
                                        }
                                    }
                                }

                                domconstruct.destroy('divInfo');
                                var div = document.createElement('div');
                                div.setAttribute('id', 'divInfo');
                                div.setAttribute('style', 'overflow:auto;height:200px;width:100%;max-width:300px;');

                                domconstruct.destroy('tableInfo');
                                var tbl = document.createElement('table');
                                tbl.setAttribute('id', 'tableInfo');
                                tbl.setAttribute('style', 'overflow:auto;height:90px;width:100%;');
                                tbl.setAttribute('border', '1');
                                var tbdy = document.createElement('tbody');

                                if(obj.features.length > 0) {
                                    for (var property in obj.features[0].properties) {

                                        if (fieldsToShow.length > 0) {

                                            array.forEach(fieldsToShow[0], function (field) {
                                                if (field == property) {
                                                    var tr = document.createElement('tr');
                                                    var tdTitle = document.createElement('td');
                                                    tdTitle.appendChild(document.createTextNode(property));
                                                    tr.appendChild(tdTitle);
                                                    tbdy.appendChild(tr);
                                                    var tdValue = document.createElement('td');
                                                    tdValue.appendChild(document.createTextNode(obj.features[0].properties[property]));
                                                    tr.appendChild(tdValue);
                                                    tbdy.appendChild(tr);
                                                }
                                            });

                                        }
                                        else {
                                            if (property != 'bbox') {
                                                var tr = document.createElement('tr');
                                                var tdTitle = document.createElement('td');
                                                tdTitle.appendChild(document.createTextNode(property));
                                                tr.appendChild(tdTitle);
                                                tbdy.appendChild(tr);
                                                var tdValue = document.createElement('td');
                                                tdValue.appendChild(document.createTextNode(obj.features[0].properties[property]));
                                                tr.appendChild(tdValue);
                                                tbdy.appendChild(tr);
                                            }
                                        }
                                    }

                                    var title = document.createElement('div');
                                    title.innerHTML = 'Layer: ' + t.identifyLayerDijit.item.name;
                                    title.setAttribute('style', 'margin-bottom:5px;font-weight: bold;');

                                    tbl.appendChild(tbdy);
                                    div.appendChild(title);
                                    div.appendChild(tbl);

                                    var coordinate = evt.coordinate;
                                    content.appendChild(div);
                                    overlay.setPosition(coordinate);

                                    /** to fix css issue */
                                    $("#popup").css('width', '20em');
                                    $("#popup").css('height', '20em');
                                    $("#popup").css('display', 'block');

                      
                                }
                                else{
                                    overlay.setPosition(undefined);
                                    closer.blur();
                                  
                                    return false;
                                }

                               

                            }, function(error) {
                                //alert('Error occurred');
                                //TODO
                        });
                    }
                }
            });
        },

        setMapClickMode: function (mode) {
            this.mapClickMode = mode;
        }
    });
});