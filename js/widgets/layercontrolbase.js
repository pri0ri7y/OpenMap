define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/topic', 
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/on',
    'dojo/query',
    'dojo/text!templatesPath/layercontrolbase/layercontrolbase.html',
    "js/widgets/layercontrol.js",
    'library/xstyle/css!templatesPath/layercontrolbase/css/layercontrolbase.css',
    "dojo/domReady!"

], function (declare, lang,
             topic, _WidgetBase, _TemplatedMixin, on, query,
             template,LayerControl) {

    return declare([_WidgetBase, _TemplatedMixin], {
        widgetsInTemplate: true,
        templateString: template,
        map: null,
        imgToBind: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAQNJREFUWIXt0U0OAUEQQOG3wNyBxFmcBQuLOQCJxCFYOM5chETiDsyKTUUmpZuu/iERldTKqO8N8J+0Gct+Bd4Drez+UyFd+Ka2aIgPPsoWC3kFz4Ae0AfmuUNCYD1ZQnzwAZh64CwhOeDokJUDvgHrSNgVsnHcb8VmACyAk3rgAmyBYQI+AnbAVd0+iTnoPuwLuUaEmGA9KSFJcCUbErITLAbWDhVQA2fZ2hhigZ3O0nHAEmKB9Qss3/2EoSFWWP+Fj4kJyQKnhGSDJ7LWECv85EyApvPFxhhigZ2O/iAmxAJ778eGJMN6rCHZ4JSQrLD1cDE4NKQ4HBpSHPaFfBz+rbkDh+NIU+kWPUgAAAAASUVORK5CYII=",
        toolTip: "layercontrol",
        baseClass: 'OpenMap_layercontrols_base',       
        typeSelect: 'None',
 
        /** 
        @@ widget base methods
        **/

        postCreate: function () {
            this.inherited(arguments);
            this.addWidgetTodiv();       
            
            /**
             *  LayerControl class instantiation 
             */       
            new LayerControl({
                map: this.map,
                divToBind: this.divToBind,
                displayDiv: this.displayDiv,
                _id: 'iw4_controls',
                useVoiceRecognition: this.useVoiceRecognition,
                layers: this.layers
            }, this.controllerbase);


        },
        addWidgetTodiv: function () {
            //add to opener Base
            $('#' + this.divToBind).append('<img src="' + this.imgToBind + '" data-toggle="tooltip" title="' + this.toolTip + '" id="' + this._id + '" class="img-thumbnail ctoolicon" width="25" height="25" style=" background-color: rgba(255, 255, 255, 0); border: rgba(255, 255, 255, 0);" >');

            //add the onClick event
            on(query('#' + this._id), "click", lang.hitch(this, this.openWidget));
        },
        openWidget: function () {
            $('#_w4').modal();
        },
        startHelp: function (e) {
           
        },
        closeModal: function (e) {

        }

         


 
 

    });
});
