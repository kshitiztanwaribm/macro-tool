sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/m/MessageToast',
	'sap/ui/model/json/JSONModel'
], function (Controller, MessageToast, JSONModel) {
	'use strict';

	return Controller.extend('DCET.App', {
		onInit : function () {
		},

		handleUploadComplete: function(oEvent) {
			//parse response
			let res = oEvent.getParameter('response');
			let htmlDoc = new DOMParser().parseFromString(res, 'text/html');
			let body = htmlDoc.getElementsByTagName('pre')[0].innerText;
			body = JSON.parse(body);

			// set table data
			let cols = body.cols;
			let rows = body.rows;
			let errTable = this.byId('errTable');
			let jModel = new JSONModel();
			jModel.setData({
				rows: rows, columns: cols
			});
			errTable.setModel(jModel);
			errTable.bindColumns('/columns', function(id, context) {
				let columnName = context.getObject().columnName;
				return new sap.ui.table.Column({
					label: columnName,
					template: columnName
				});
			});
			errTable.bindRows('/rows');
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
		}
	});

});