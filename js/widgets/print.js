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
 
        closeModal: function (e) {

        },

        /** 
        @@ widget event methods
        **/
        printToPdf: function( evt ){  

            /**
             *  attach-points:
             *          this.format [A4]
             *          this.mapTitle [text]
             *          this.comment [text]
             *          this.dpis [75,150,300]
             *          this.subject [text]
             *          this.filename [<filename>.pdf]
             *    
             *   BBOx - map.getView().calculateExtent(map.getSize())
             *     
             *           
             */

            var specs={
                "layout": this.format.value, 
                "srs":"EPSG:4326",
                "units":"degrees",
                "dpi": this.dpis.value, 
                "mapTitle": this.mapTitle.value,
                "comment": this.comment.value,
                "start_text": this.start_text.value,
                "subject": this.subject.value,                
                "author": "LNTECC",
                "filename": this.filename.value,
                "layers":[
                    {  
                        "baseURL":"http://maps.google.com/maps/api/staticmap",
                        "maxExtent":[-20037508.34, -20037508.34, 20037508.34, 20037508.34],
                        "resolutions": [156543.03390625, 78271.516953125, 39135.7584765625, 19567.87923828125, 9783.939619140625, 4891.9698095703125, 2445.9849047851562, 1222.9924523925781, 611.4962261962891, 305.74811309814453, 152.87405654907226, 76.43702827453613, 38.218514137268066, 19.109257068634033, 9.554628534317017, 4.777314267158508, 2.388657133579254, 1.194328566789627, 0.5971642833948135, 0.29858214169740677, 0.14929107084870338, 0.07464553542435169],
                        "extension":"png",
                        "maptype":"hybrid",
                        "tileSize": [256, 256],
                        "opacity":1,
                        "type":"XYZ"
                    },
                    {
                    "baseURL":"http://demo.boundlessgeo.com/geoserver/wms",
                    "opacity":1.0,
                    "singleTile":false,
                    "type":"WMS",
                    "layers":["topp:states"],
                    "format":"image/png"
                    }
                ],
                "pages":[

                    {
                    "center":ol.proj.transform(this.map.getView().getCenter(), 'EPSG:3857','EPSG:4326'),
                    "scale":this.mapScale(this.dpis.value)
                    }
                    
                ]
           };

            /**   --Dependency--
              Need to enable Mapfish for getting the print functionality
                   @@http://sampleserver:8080/geoserver/pdf/print.pdf?spec={}
            */


           var link = document.createElement("a");                
           link.href= 'http://gisapp:8080/geoserver/pdf/print.pdf?spec=' + JSON.stringify(specs);    
           link.click();
          
        
        },

        mapScale: function (dpi) {
            var unit = this.map.getView().getProjection().getUnits();
            var resolution = this.map.getView().getResolution();
            var inchesPerMetre = 39.37;
        
            return resolution * ol.proj.METERS_PER_UNIT[unit] * inchesPerMetre * dpi;
        }

    });
});
