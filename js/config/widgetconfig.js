﻿define(["dojo/_base/declare",        
        "dojo/_base/lang",
        "dojo/dom-construct",
        "js/widgets/measurement.js",
        "js/widgets/draw.js",
        "js/widgets/overviewmap.js",
        "js/widgets/layercontrolbase.js",
        "js/widgets/geolocate.js",
        "js/widgets/print.js",
        "js/widgets/itool.js",
        "js/widgets/speechcommand.js"

       ],
   function (declare, lang, domConstruct, measurement, draw, overviewmap, layercontrolbase, geolocate, print, itool, jarvis) {
    return declare(null, {
        constructor: function (options) {
            lang.mixin(this, options);
            this.addedWidgets = [];
            this.addWidgets();
            
        },       
        addWidgets: function () {
                 
            if (this.addToApp.includes('w1')) {

                //create dynamically a node to attach the widget 
                domConstruct.create("div", { id: "_w1" }, "toolDisplayDiv");

                //create and push the widget
                this.addedWidgets.push(new measurement({
                    map: this.map,
                    divToBind: this.divToBind,
                    displayDiv:this.displayDiv,
                    _id: 'iw1',
                    useVoiceRecognition: this.useVoiceRecognition
                }, '_w1'));
            } // end if

            if (this.addToApp.includes('w2')) {

                //create dynamically a node to attach the widget 
                domConstruct.create("div", { id: "_w2" }, "toolDisplayDiv");

                //create and push the widget
                this.addedWidgets.push(new draw({
                    map: this.map,
                    divToBind: this.divToBind,
                    displayDiv: this.displayDiv,
                    _id: 'iw2',
                    useVoiceRecognition: this.useVoiceRecognition
                }, '_w2'));
            } // end if

            if (this.addToApp.includes('w3')) {                  
                //create and push the widget
                this.addedWidgets.push(new overviewmap({
                    map: this.map                   
                }));
            } // end if

            if (this.addToApp.includes('w4')) {

                //create dynamically a node to attach the widget 
                domConstruct.create("div", { id: "_w4" }, "toolDisplayDiv");

                //create and push the widget
                this.addedWidgets.push(new layercontrolbase({
                    map: this.map,
                    divToBind: this.divToBind,
                    displayDiv: this.displayDiv,
                    _id: 'iw4',
                    useVoiceRecognition: this.useVoiceRecognition,
                    layers: this.layersObject.layers
                }, '_w4'));
            } // end if

            if (this.addToApp.includes('w5')) {

                 

                //create and push the widget
                this.addedWidgets.push(new geolocate({
                    map: this.map,
                    useVoiceRecognition: this.useVoiceRecognition,
                    publishGPSPosition: true,
                    highlightLocation: true,
                    useTracking: true,
                    start: '#geolocate_widget_st',
                    stop: '#geolocate_widget_sp',
                    geolocationOptions: {
                        maximumAge: 0,
                        timeout: 15000,
                        enableHighAccuracy: true
                    }
                }, 'geolocate_widget'));
            } // end if

            if (this.addToApp.includes('w6')) {

                //create dynamically a node to attach the widget 
                domConstruct.create("div", { id: "_w6" }, "toolDisplayDiv");

                //create and push the widget
                this.addedWidgets.push(new print({
                    map: this.map,
                    divToBind: this.divToBind,
                    displayDiv: this.displayDiv,
                    _id: 'iw6',
                    useVoiceRecognition: this.useVoiceRecognition                  
                }, '_w6'));
            } // end if

            if (this.addToApp.includes('w7')) {
              
                this.addedWidgets.push(new itool({
                    map: this.map                 
                }));
            } // end if


            if (this.addToApp.includes('jarvis')) {
              
                this.addedWidgets.push(new jarvis({
                    _safemodetoggle:'#jarvis-safe-mode-toggle',
                    _recordsound: '#jarvis-recorder', 
                    _jarvisreplyTrigger: "#jarvis-click-trigger",
                    _jarviscontentNode: "#jarvis-reply-base-content",
                    _map:this.map,
                    _jarvis: jarvisGlobal
                }));
            } // end if
          
        }
    });
 });