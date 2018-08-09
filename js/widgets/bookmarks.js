define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/json',
    'dojo/_base/array',
    'dojo/cookie',
    'dojo/_base/lang',
    'dojo/dom-construct',
    'dojox/grid/DataGrid',
    'dojo/data/ItemFileWriteStore',
    'dijit/form/Button',
    'dojo/text!./bookmarks/templates/bookmarks.html',
    'tools/xstyle/css!./bookmarks/css/bookmarks.css'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, json, array, cookie, lang, domConstruct, DataGrid, ItemFileWriteStore, Button, template) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: template,
        baseClass: 'BookmarksWidget',
        imgToBind:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAZdJREFUWIXt1r1qFUEcBfDfVYz56JI0pol4I/oI+hQSxEZTGMV05uYF4vOo+FEYIomFFtrERiG2CooaSYhdQPOxKWYuTPbuXnYDosgeGHaYOec/h5ndOUuDBn8ZrQqc0/H5q2bd4djfQVbH1CBmsYTNKM5i/xluJqZSjOAOnuNnotvGMm4npkoxjW+JOMNubOnYV1xJdNewkeP8LtB9x9WyxWdwEImf0EE7mW9jIc5lkXsdt5IFPmIe54RjaEVdJ9Flwi724EucfCwcQxmG8DRyP+NH7D+soHsUuRtFhK678T5Fuhh3dGszjFbQjSV8HP0KsoKxfsi/2XV1LThRUfTH0BhoDDQG/kkDo1jEayEB97EnBMkK7ipOtTHcwxtsCVmxL1y7q0JGjPQz070i1/Ves/m2VjD2oYLurdxVXGRgF09wQ0i1UxjABSHvX5YU3xNCakZIwAHhv+Ei5vAqxy80sIqpftsUcQnvkmIvcL6C7jLelxm4r95LOSgYfoCTNXRDguEenKlRpItJTBxDd/YYmgYN/lMcAhGAjMAvkBoxAAAAAElFTkSuQmCC",
        toolTip: "bookmark",
        projection: null,
        projectionCODE: null,
        places: [],
        postCreate: function () {
            var t = this;
            this.inherited(arguments);
            this.addWidgetTodiv();

            var bookmarks = this.bookmarks; // from the options passed in


            //this.bookmarkItems = cookie('bookmarkItems');
            //if (this.bookmarkItems === undefined) {
            //    this.bookmarkItems = [];
            //} else {
            //    this.bookmarkItems = json.parse(this.bookmarkItems);
            //}

            array.forEach(bookmarks, function (bookmark) {
                var entry = domConstruct.create('div');
                var button = new Button({
                    label:  bookmark.name,
                    style: 'width:70%'
                });
                button.startup();
                button.on('click', function(evt) {
                    t.map.getView().fit(ol.proj.transformExtent(bookmark.extent, bookmark.spatialReference, 'EPSG:3857'), t.map.getSize());
                });
                button.placeAt(entry);

                var dellbutton = new Button({
                    iconClass: 'clearIcon',
                    showLabel:false
                });
                dellbutton.startup();
                dellbutton.on('click', function(evt) {
                    domConstruct.destroy(entry);
                });
                dellbutton.placeAt(entry);

                t.bookmarkList.appendChild(entry);

                t.places.push({
                    name: bookmark.name,
                    extent: ol.proj.transformExtent(bookmark.extent, bookmark.spatialReference, 'EPSG:3857')
                });

            });

        },

        addWidgetTodiv: function () {
            //add to opener Base
            $('#' + this.divToBind).append('<img src="' + this.imgToBind + '" data-toggle="tooltip" title="' + this.toolTip + '" id="' + this._id + '" class="img-thumbnail ctoolicon" width="25" height="25" style=" background-color: rgba(255, 255, 255, 0); border: rgba(255, 255, 255, 0);" >');

            //add the onClick event
            on(query('#' + this._id), "click", lang.hitch(this, this.openWidget));
        },
        openWidget: function () {
            $('#_w8').modal();
        }, 

        addBookmark: function () {

            var t = this;

            var entry = domConstruct.create('div');
            var button = new Button({
                label:  t.bookmark.get('value'),
                style: 'width:70%'
            });
            button.startup();
            button.on('click', function(evt) {
                array.forEach(t.places, function(place){
                    if(place.name == button.label){
                        t.map.getView().fit(place.extent, t.map.getSize());
                    }
                });
            });
            button.placeAt(entry);

            var dellbutton = new Button({
                iconClass: 'clearIcon',
                showLabel:false
            });
            dellbutton.startup();
            dellbutton.on('click', function(evt) {
                domConstruct.destroy(entry);
            });
            dellbutton.placeAt(entry);

            t.bookmarkList.appendChild(entry);

            t.places.push({
                name: t.bookmark.get('value'),
                extent: t.map.getView().calculateExtent(t.map.getSize())
            });

            //cookie('bookmarkItems', json.stringify({name:this.bookmark.get('value'), extent:this.map.getView().calculateExtent(this.map.getSize())}), {
            //    expires: 365
            //});
            //
            //console.log(this.bookmarkItems);
        }

        //_export: function () {
        //    return json.stringify(this.bookmarks.toJson());
        //}
    });
});