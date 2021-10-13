sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/m/MessageToast',
	'sap/m/Column',
	'sap/m/Label',
	'sap/m/ColumnListItem',
	'sap/m/Text',
	'sap/ui/model/json/JSONModel',
], function (Controller, MessageToast, Column, Label, ColumnListItem, Text, JSONModel) {
	'use strict';

	return Controller.extend('DCET.App', {
		onInit : function () {
		},

		handleUploadComplete: function(oEvent) {
			// reset table
			let errTable = this.byId('errTable');
			errTable.removeAllItems();
			errTable.removeAllColumns();

			// parse response
			let res = oEvent.getParameter('response');
			let htmlDoc = new DOMParser().parseFromString(res, 'text/html');
			let body = htmlDoc.getElementsByTagName('pre')[0].innerText;
			body = JSON.parse(body);

			// add columns to table
			body.cols.forEach(function (col) {
				errTable.addColumn(new Column({
					header: new Label({
						text: col.columnName
					})
				}))
			});

			// add rows to table
			body.rows.forEach(function (row) {
				let items = []
				body.cols.forEach(function (col) {
					items.push(new Text({
						text: row[col.columnName]
					}));
				});
				errTable.addItem(new ColumnListItem({
					cells:items
				}));
			})

			errTable.setBusy(false);
		},

		handleUploadPress: function(event) {
			let errTable = this.byId('errTable');
			errTable.setBusyIndicatorDelay(0);
			errTable.setBusy(true);
			
			let oFileUploader = this.byId('fileUploader');
			oFileUploader.checkFileReadable().then(function () {
				oFileUploader.upload();
			}, function (error) {
				MessageToast.show('The file cannot be read. It may have changed.');
			}).then(function () {
				oFileUploader.clear();
			});
		},

		onCheckBoxSelect: function (event) {
			this.byId('errTable').setFixedLayout(event.getParameter("selected"));
		}
	});

});