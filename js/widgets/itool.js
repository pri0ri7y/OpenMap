define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/topic', 
    'dojo/on',
    'dojo/dom',
    'dojo/topic',
    "dojo/request/xhr",
    "dojo/text!baseconfig/itool.json"
  

], function (declare, lang, topic, on, dom, topic, xhr, itool) {
    return declare(null, {

        constructor: function (options) {
            this.options = options;           
            this.popup = new ol.Overlay.Popup();
            this.options.map.addOverlay(this.popup);
           
            this.options['map'].on("singleclick", lang.hitch(this, function (evt) {
                this.clickEvent(evt);                
            })); 

            topic.subscribe('baseMap/current/itool/response', lang.hitch(this, function (e) {
                this.currentbm = e;
            }));
            topic.subscribe('baseMap/current', lang.hitch(this, function (e) {
                this.currentbm = e;
            }));
            topic.publish('baseMap/current/itool/request', 'iToolRequest'); 

            this.content = '';
            this.tabs = '';
            this.featurecollection = {};
            this.domeventzreference = [];
            this.itoolconfig = JSON.parse(itool);
         
        },

        /**
        @@ event and feature collection from layer call back
        clickEvent() click event for itool
        **/
        clickEvent: function (evt) {

            //hide the existing popup 
            this.popup.hide();
            this.popup.setOffset([0, 0]);
            
            //instantiate the variables before creating the content
            this.lyrcounter = 1;
            this.tabcounter = 1;
            this.previouslyr = "";
            this.previoustab = "";
            
            //content creation
            this.coordinate = evt.coordinate;
            this.content = this.getFeatureInfoContent(evt, evt.coordinate);

            this.popup.show(evt.coordinate, this.content);
            this.registerDomEvents({
                'itoolhead': 'itoolheader',
                'itoollayerleft': 'itoollayerlt',
                'itoollayerright': 'itoollayerrt',
                'itooltabsleft': 'itooltabslt',
                'itooltabsright': 'itooltabsrt'
            }); 

        },
        /**
        @@ retrieve data content for wms/wfs services
        getFeatureInfoContent()
        wmslayerCallback()
        wfslayerCallback()
        **/
        getFeatureInfoContent: function (evt,coordinate) { 
            this.featurecollection = [];

            //get layer & pixel info           
            this.options['map'].forEachLayerAtPixel(
                        evt.pixel,

                        lang.hitch(this,function (layer, pixel) {
                         
                            switch (layer.get('type')) {                                 
                                case 'WMS':
                                     this.wmslayerCallback(layer);
                                    break;
                                case 'WFS':
                                    this.wfslayerCallback(layer);
                                    break;
                                default:
                                    console.log('default');
                            }
                        }),

                        null,

                        lang.hitch(this,function (layer) {
                            return layer.get('name') != this.currentbm;
                        })
                );

            

            return this.createContent(this.featurecollection);
        },
        wmslayerCallback: function (layer) {

            xhr(layer.getSource().getGetFeatureInfoUrl(this.coordinate, this.options.map.getView().getResolution(), 'EPSG:3857', { 'INFO_FORMAT': 'text/xml' }),
            {
                handleAs: "xml",
                sync: true,
            }).then(
            lang.hitch(this, function (data) {
                var x2js = new X2JS();
                if ((x2js.xml2json(data)).hasOwnProperty('FeatureCollection')) {
                    this.featurecollection.push(x2js.xml2json(data));
                } 
                })
            );

        },
        wfslayerCallback: function (layer) {

        },

        /**
        @@ create content by syncing the itoolconfig json and featurecollection
        **/
        createContent: function (featurecollection) { 
            featurecollection = this.changeCollectionMatrix(featurecollection); //change the matrix of the array to fit our logic
            featurecollection = this.syncCollectionWithConfig(featurecollection); //sync the itool config with featurecollection
            return this.buildDom(featurecollection);
        },
        buildDom: function (featurecollection) { 
            
            //navigation arrow heads
            var navigationarrowheads = '<div>' +
                                         '<span style="background-color: #6d6b6b;' +
                                                      'font-size: large; border-radius: 10px;' +
                                                      'float: left; cursor: pointer; z-index: 5; margin-top: 5px; color: white; font-family: unset;"' +

                                                      ' onMouseOver="this.style.background =' + "'" + '#9e9e9e' + "'" + '"' +
                                                      ' onMouseOut="this.style.background =' + "'" + '#6d6b6b' + "'" + '"' +
                                                 
                                                      'id = "itoollayerlt">' +
                                                      '&lt;' +
                                         '</span>' +
                                         '<span style="background-color: #6d6b6b;' +
                                                      'font-size: large; border-radius: 10px;' +
                                                      'float: right; cursor: pointer; z-index: 5; margin-top: 5px; color: white; font-family: unset;"' +

                                                      ' onMouseOver="this.style.background =' + "'" + '#9e9e9e' + "'" + '"' +
                                                      ' onMouseOut="this.style.background =' + "'" + '#6d6b6b' + "'" + '"' +

                                                      'id = "itoollayerrt">' +
                                                      '&gt;' +
                                         '</span>' +
                                      '</div>' +
                                      '<div>' +
                                        '<span style="background-color: #6d6b6b;' +
                                                     'font-size: x-large; border-radius: 10px;' +
                                                     'float: left; cursor: pointer; z-index: 5; margin-left: 1.5%; color: white; font-family: unset;"' +

                                                     ' onMouseOver="this.style.background =' + "'" + '#9e9e9e' + "'" + '"' +
                                                     ' onMouseOut="this.style.background =' + "'" + '#6d6b6b' + "'" + '"' +

                                                     'id = "itooltabslt">' +
                                                     '&lt;' +
                                        '</span>' +
                                        '<span style="background-color: #6d6b6b;' +
                                                     'font-size: x-large; border-radius: 10px;' +
                                                     'float: right; cursor: pointer; z-index: 5; margin-right: 1.5%; color: white; font-family: unset;"' +
                                                      
                                                     ' onMouseOver="this.style.background =' + "'" + '#9e9e9e' + "'" + '"' +
                                                     ' onMouseOut="this.style.background =' + "'" + '#6d6b6b' + "'" + '"' +                                                    

                                                     'id = "itooltabsrt">' +
                                                     '&gt;' +
                                        '</span>' +
                                      '</div>';
                                       
                                       

            //innercontent
            var innercontent = '';
            var firstheader = '';
            for (var i = 0; i < featurecollection['length']; i++) { //layer
                for (var j = 0; j < featurecollection[i]['tabs']['length']; j++) { //tabs

                    
                    var tableboxes = '<table class="table table-striped table-responsive">' +
                                      '<tbody>';
                    for (var k = 0; k < featurecollection[i]['tabsobj'][featurecollection[i]['tabs'][j]]['attrs']['length']; k++) {
                        tableboxes = tableboxes + '<tr>';
                        tableboxes = tableboxes + '<td>' + featurecollection[i]['tabsobj'][featurecollection[i]['tabs'][j]]['attrs'][k]['display'] + ' </td><td> ' +
                                                        (featurecollection[i]['tabsobj'][featurecollection[i]['tabs'][j]]['attrs'][k]['value'] || 'This is a sample text to see how large content works') + '</td>';
                        tableboxes = tableboxes + '</tr>';
                    }
                    tableboxes = tableboxes + '</tbody>' + '</table>';

                    var subcontent = '';
                    if (i == 0 && j == 0) {
                        subcontent = '<div data-layer="' + featurecollection[i]['name'] + '"  data-tab="' + featurecollection[i]['tabs'][j] + '" style="display:block;" >' +
                        tableboxes + 
                        '</div>';

                        this.previouslyr = featurecollection[i]['name'];
                        this.previoustab = featurecollection[i]['tabs'][j];

                        firstheader = '<div id="itoolheader"> <center> <h5> <b> ' + featurecollection[i]['name'] + ' / ' + featurecollection[i]['tabs'][j] + ' </b> </h5> </center> </div>';
                    } else {
                        subcontent = '<div data-layer="' + featurecollection[i]['name'] + '"  data-tab="' + featurecollection[i]['tabs'][j] + '" style="display:none;" >' +
                        tableboxes +
                        '</div>';
                    }

                    innercontent = innercontent + subcontent;
                }
            }
           
            //Complete integrated dom
            var dom = '<div class="container-fluid" id="itooldom">' +
                          '<div class="row" >' + navigationarrowheads + firstheader + '</div>' + //navigation arrow heads
                          '<div class="row" >' + innercontent + '</div>' + //content info within
                       '</div>'; 

            return dom;

        },
        changeCollectionMatrix: function (featurecollection) {            

            var fcollection = [];
            for (var i = 0; i < featurecollection['length']; i++) {
                var lyrname = featurecollection[i]['FeatureCollection']['featureMember']['Layer']['_Name']; //the key may change depending on the service configuration
                var attributearray = [];
                for (var j = 0; j < featurecollection[i]['FeatureCollection']['featureMember']['Layer']['Attribute']['length']; j++) {
                    
                    if (featurecollection[i]['FeatureCollection']['featureMember']['Layer']['Attribute'][j].hasOwnProperty('_xlink:href')) {
                        attributearray.push({
                            'a': featurecollection[i]['FeatureCollection']['featureMember']['Layer']['Attribute'][j]['_Name'],
                            't': featurecollection[i]['FeatureCollection']['featureMember']['Layer']['Attribute'][j]['__text']
                        });
                    }
                    else{
                        attributearray.push({
                            'a': featurecollection[i]['FeatureCollection']['featureMember']['Layer']['Attribute'][j]['_Name'],
                            't': featurecollection[i]['FeatureCollection']['featureMember']['Layer']['Attribute'][j]['_xlink:href']
                        });
                    }            
                }

                fcollection.push({'name':lyrname,'attributes':attributearray});
            } 

            return fcollection;
        },
        syncCollectionWithConfig: function (featurecollection) {

            var fcollection = [];
            this.domeventzreference = [];
            for (var i = 0; i < featurecollection['length']; i++) {
               
                var feature = {};
                feature['name'] = featurecollection[i]['name'];
                feature['tabs'] = [];
                feature['tabsobj'] = {};

                for (var j = 0; j < featurecollection[i]['attributes']['length']; j++) {

                    var att = {};
                    att['name'] = featurecollection[i]['attributes'][j]['a'];
                    att['value'] = featurecollection[i]['attributes'][j]['t'];
                    att['display'] = featurecollection[i]['attributes'][j]['a'].split("_").join(" ");

                    for (var key in this.itoolconfig['tabs'][featurecollection[i]['name']]) {
                        if (!feature['tabs'].includes(key))
                           { feature['tabsobj'][key] = { 'attrs': [] }; feature['tabs'].push(key); }
                        if (this.itoolconfig['tabs'][featurecollection[i]['name']][key].includes(featurecollection[i]['attributes'][j]['a']))
                           { feature['tabsobj'][key]['attrs'].push(att); }                        
                    }
                }

                fcollection.push(feature);
                this.domeventzreference.push([feature['name'],feature['tabs']]);
            }

            console.log(fcollection)
            return fcollection;
        },
        registerDomEvents: function (o) {

            //register all the dom events and handle their cases             
            on(dom.byId(o['itoollayerleft']), "click", lang.hitch(this, function (evt) {            
                this.lyrcounter--;
                this.tabcounter = 1;  
                if(this.lyrcounter == 0) { 
                    this.lyrcounter = this.domeventzreference['length'] ; 
                }
                this.updateitoolcontent();
            }));

            on(dom.byId(o['itoollayerright']), "click", lang.hitch(this, function (evt) {                
                this.lyrcounter++;
                this.tabcounter = 1; 
                if(this.lyrcounter > this.domeventzreference['length']) { 
                    this.lyrcounter = 1; 
                }
                this.updateitoolcontent();
            }));

            on(dom.byId(o['itooltabsleft']), "click", lang.hitch(this, function (evt) {
                this.tabcounter--;
                if(this.tabcounter == 0) {
                    this.tabcounter = this.domeventzreference[this.lyrcounter - 1][1]['length'];
                 }
                this.updateitoolcontent();
            }));

            on(dom.byId(o['itooltabsright']), "click", lang.hitch(this, function (evt) {
                this.tabcounter++;
                if(this.tabcounter > this.domeventzreference[this.lyrcounter - 1][1]['length']) {
                     this.tabcounter = 1;
                }
                this.updateitoolcontent();
            }));
             
        },
        updateitoolcontent: function(){
            //set the previous content to hidden
            $($("#itooldom").find("[data-layer='"+ this.previouslyr +"'][data-tab='"+ this.previoustab +"']")).css("display", "none");           
            $("#itoolheader").html("");

            //set the next content to block
            this.previouslyr = this.domeventzreference[this.lyrcounter-1][0];
            this.previoustab = this.domeventzreference[this.lyrcounter-1][1][this.tabcounter-1];
            $($("#itooldom").find("[data-layer='"+ this.previouslyr +"'][data-tab='"+ this.previoustab +"']")).css("display", "block");        
            $("#itoolheader").html("<center> <h5> <b> " + this.previouslyr + " / " + this.previoustab + " </b> </h5> </center>");
        }
    });
});