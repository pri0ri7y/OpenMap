define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/topic', 
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/on',
    'dojo/query',
    'dojo/text!templatesPath/print/print.html',
    'library/xstyle/css!templatesPath/print/css/print.css',
    "dojo/domReady!"

], function (declare, lang,
             topic, _WidgetBase, _TemplatedMixin, on, query,
             template) {

    return declare([_WidgetBase, _TemplatedMixin], {
        widgetsInTemplate: true,
        templateString: template,
        map: null,
        imgToBind: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAG1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACUUeIgAAAACHRSTlMATU9S6Onq6whXwGQAAACJSURBVEjHY2AYTMC8AwkkYVFQgaygFYuCDhRAngLs7FEFowpIVGCOmcxQE3cFbgWQxJ2BWwFESJWQAtyOJFkBRsYhVoF5EqpnQKAFWUFFK6pnQMARt1OwuHtUAWkKsJS0qAqwlLSoCnBHNxEKCCRaggrw5IsWQvnCkdrZn9IaB0u+QAVY8sVgAQBXtxN7OS2ILQAAAABJRU5ErkJggg==",
        toolTip: "print",
        baseClass: 'OpenMap_print',       
        typeSelect: 'None',
 
        /** 
        @@ widget base methods
        **/

        postCreate: function () {
            this.inherited(arguments);
            this.addWidgetTodiv();
            this.dims = {
                a0: [1189, 841],
                a1: [841, 594],
                a2: [594, 420],
                a3: [420, 297],
                a4: [297, 210],
                a5: [210, 148]
            };

            this.loading = 0;
            this.loaded = 0;

        },
        addWidgetTodiv: function () {
            //add to opener Base
            $('#' + this.divToBind).append('<img src="' + this.imgToBind + '" data-toggle="tooltip" title="' + this.toolTip + '" id="' + this._id + '" class="img-thumbnail ctoolicon" width="25" height="25" style=" background-color: rgba(255, 255, 255, 0); border: rgba(255, 255, 255, 0);" >');

            //add the onClick event
            on(query('#' + this._id), "click", lang.hitch(this, this.openWidget));
        },
        openWidget: function () {
            $('#_w6').modal();
        },
        startHelp: function (e) {
           
        },
        closeModal: function (e) {

        },

        /** 
        @@ widget event methods
        **/
        printToPdf: function( evt ){  


            var dataurl = $($(this.map.getTargetElement()).find('.ol-unselectable')).toDataURL('image/png');
            console.log(dataurl);
            
            //this.dim = this.dims[this.printformat.value];
            //this.width = Math.round(this.dim[0] * this.printresolution.value / 25.4);
            //this.height = Math.round(this.dim[1] * this.printresolution.value / 25.4);
            //this.size = /** @type {ol.Size} */ (this.map.getSize());
            //this.extent = this.map.getView().calculateExtent(this.size);

            //var source = raster.getSource();
 
             

            //this.map.once('postcompose', function (event) {
            //    source.on('tileloadstart', tileLoadStart);
            //    source.on('tileloadend', tileLoadEnd, event.context.canvas);
            //    source.on('tileloaderror', tileLoadEnd, event.context.canvas);
            //});

            //map.setSize([width, height]);
            //map.getView().fit(extent);
            //map.renderSync();
        
        },


        /** 
        @@ internal methods
        **/
        tileLoadStart : function () {
            ++this.loading;
        },

        tileLoadEnd : function () {
            ++this.loaded;
            if (this.loading === this.loaded) {
                var canvas = this;
                window.setTimeout(function () {
                    this.loading = 0;
                    this.loaded = 0;
                    var data = canvas.toDataURL('image/png');
                    var pdf = new jsPDF('landscape', undefined, format);
                    pdf.addImage(data, 'JPEG', 0, 0, dim[0], dim[1]);
                    pdf.save('map.pdf');
                    source.un('tileloadstart', tileLoadStart);
                    source.un('tileloadend', tileLoadEnd, canvas);
                    source.un('tileloaderror', tileLoadEnd, canvas);
                    map.setSize(size);
                    map.getView().fit(extent);
                    map.renderSync();
                    exportButton.disabled = false;
                    document.body.style.cursor = 'auto';
                }, 100);
            }
        }

    });
});
