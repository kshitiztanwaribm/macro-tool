sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/m/MessageToast',
	'sap/m/Column',
	'sap/m/Label',
	'sap/m/ColumnListItem',
	'sap/m/Text',
	'sap/ui/model/json/JSONModel',
	'sap/ui/core/util/Export',
	'sap/ui/core/util/ExportTypeCSV'
], function (Controller, MessageToast, Column, Label, ColumnListItem, Text, JSONModel, Export, ExportTypeCSV) {
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
			this.getView().setModel(new JSONModel(body));

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
			// assert file attached
			let fileUploader = this.byId('fileUploader');
			if (fileUploader.getValue() === '') {
				MessageToast.show('File not attached. Please browse a file to upload.');
				return;
			}

			let errTable = this.byId('errTable');
			errTable.setBusyIndicatorDelay(0);
			errTable.setBusy(true);

			fileUploader.checkFileReadable().then(function () {
				fileUploader.upload();
			}).catch(function (err) {
				MessageToast.show('The file cannot be read. It may have changed.\n\n' + err);
			}).then(function () {
				fileUploader.clear();
			});
		},

		onCheckBoxSelect: function (event) {
			this.byId('errTable').setFixedLayout(event.getParameter('selected'));
		},

		handleDownloadPress: function (event) {
			// assert file uploaded
			if (this.getView().getModel() === undefined) {
				MessageToast.show('Please upload file to start download.');
				return;
			}

			// column definitions for export config
			let colNames = this.getView().getModel().oData.cols
			console.log(colNames);
			let cols = []
			colNames.forEach(function (elem) {
				cols.push({name: elem.columnName, template: {content: '{' + elem.columnName + '}'}});
			});

			let exp = new Export({
				// Type that will be used to generate the content. Own ExportType's can be created to support other formats
				exportType : new ExportTypeCSV({
					separatorChar : ','
				}),

				// Pass in the model created above
				models : this.getView().getModel(),

				// binding information for the rows aggregation
				rows : {
					path : '/rows'
				},

				// column definitions with column name and binding info for the content
				columns: cols
			});

			// download exported file
			exp.saveFile().catch(function(err) {
				MessageToast.show('Error when downloading data. Browser might not be supported!\n\n' + err);
			}).then(function() {
				exp.destroy();
			});
		}
	});

});