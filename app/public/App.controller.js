sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
	"use strict";

	return Controller.extend("DCET.App", {
		onInit : function () {
			let jModel = new JSONModel();
			let data = {
				"Logs": [
					{"col1": "TEXT", "col2": "TEXT", "col3": 1, "col4": 1, "col5": "TEXT", "col6": 1},
					{"col1": "TEXT", "col2": "TEXT", "col3": 1, "col4": 1, "col5": "TEXT", "col6": 1},
					{"col1": "TEXT", "col2": "TEXT", "col3": 1, "col4": 1, "col5": "TEXT", "col6": 1},
					{"col1": "TEXT", "col2": "TEXT", "col3": 1, "col4": 1, "col5": "TEXT", "col6": 1},
					{"col1": "TEXT", "col2": "TEXT", "col3": 1, "col4": 1, "col5": "TEXT", "col6": 1},
					{"col1": "TEXT", "col2": "TEXT", "col3": 1, "col4": 1, "col5": "TEXT", "col6": 1}
				]
			}
			jModel.setData(data);
			this.getView().setModel(jModel);
		}
	});

});