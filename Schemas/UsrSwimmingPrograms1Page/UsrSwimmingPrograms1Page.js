define("UsrSwimmingPrograms1Page", ["ProcessModuleUtilities"], function(ProcessModuleUtilities) {
	return {
		entitySchemaName: "UsrSwimmingPrograms",
		attributes: {},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{
			"Files": {
				"schemaName": "FileDetailV2",
				"entitySchemaName": "UsrSwimmingProgramsFile",
				"filter": {
					"masterColumn": "Id",
					"detailColumn": "UsrSwimmingPrograms"
				}
			},
			"UsrSwimmingLessonsSchemaDetail": {
				"schemaName": "UsrSchema1dc00947Detail",
				"entitySchemaName": "UsrSwimmingLessons",
				"filter": {
					"detailColumn": "UsrSwimmingProgram",
					"masterColumn": "Id"
				}
			}
		}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{}/**SCHEMA_BUSINESS_RULES*/,
		methods: {
			getActions: function() {
				var actionMenuItems = this.callParent(arguments);
				actionMenuItems.addItem(this.getButtonMenuItem({
					Type: "Terrasoft.MenuSeparator",
					Caption: ""
				}));
				
				actionMenuItems.addItem(this.getButtonMenuItem({
					"Caption": "Добавить занятия",
					"Click": {bindTo: "addSwimmingLessons"},
					"Enabled": true
				}));
				return actionMenuItems;
			},
			addSwimmingLessons:function(){
				var data = {
					UsrSwimmingProgramId: this.get("Id")
				};
				ProcessModuleUtilities.runProcess("UsrAddSwimmingLessons", data, this.hideBodyMask);
			},
			asyncValidate: function(callback, scope) {
				this.callParent([function(response) {
					if (!this.validateResponse(response)) {
						return;
					}
					Terrasoft.chain(
						function(next){
							this.getMaxCountActiveSwimmingLessons(function(maxCount) {//Получение сис настройки
									next(maxCount);
							},this)
						},
						function(next,maxCount) {
							this.validateDailySwimmingPrograms(function(response) {//Валидация ежедневных активных программ
								if (this.validateResponse(response)) {
									next();
								}
							},maxCount, this);
						},
						function() {
							callback.call(scope, response);
						}, this);
				}, this]);
			},
			getMaxCountActiveSwimmingLessons:function(callback,scope){
				Terrasoft.SysSettings.querySysSettings("UsrMaxCountActiveSwimmingLessons", function(response) {
					var maxCount = 0;
					if(response && response.UsrMaxCountActiveSwimmingLessons){
						maxCount = response.UsrMaxCountActiveSwimmingLessons
					}
					callback.call(scope || this, maxCount);
				}, this);
			},
			validateDailySwimmingPrograms: function(callback,maxCount,scope) {
				var result = {
					success :true
				};
				if(!scope.isSwimmingProgrammDailyAndActive(scope)){
					callback.call(scope || this, result);
					return;
				}
				
				var esq = Ext.create("Terrasoft.EntitySchemaQuery", { rootSchemaName: "UsrSwimmingPrograms" });

				esq.filters.addItem(esq.createColumnFilterWithParameter(
					Terrasoft.ComparisonType.EQUAL, "UsrSwimmingProgramsPeriodicity", "05716D35-1CE4-4736-8EBC-5372CCAF6E63"));

				esq.filters.addItem(esq.createColumnFilterWithParameter(
					Terrasoft.ComparisonType.EQUAL, "UsrIsActive", true));

				esq.getEntityCollection(function(response) {
					if (response.success && response.collection.getCount() >= maxCount) {
						var filteredCollectionById = response.collection.filter(item=>item.get("Id") == scope.get("Id"));
						if(filteredCollectionById.collection.length == 0){
							scope.showInformationDialog("Допускается не более " + maxCount + " активных ежедневных программ плавания");
							result.success = false;
						}
					}
					callback.call(scope || this, result);
				}, this);
			},
			isSwimmingProgrammDailyAndActive:function(scope){//Проверка на ежедневность и активность текущего занятия
				var isActive 	= scope.get("UsrIsActive");
				var isDaily 	= false;
				var peridicioty = scope.get("UsrSwimmingProgramsPeriodicity");

				if(peridicioty?.value?.toUpperCase() === "05716D35-1CE4-4736-8EBC-5372CCAF6E63"){
					isDaily = true;
				}
				return isDaily && isActive;
			},
		},
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "UsrName6f09cc49-5d8c-4e58-86f2-e816a3beb46c",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrName"
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "STRINGcf9001b3-3622-4693-b41a-b355a523e47b",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrCode",
					"enabled": true
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "LOOKUPb3266662-97b6-4af5-bebe-aa7628473c76",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 2,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrSwimmingProgramsPeriodicity",
					"enabled": true,
					"contentType": 5
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "LOOKUPefb75cc6-7c7e-41e3-8015-066f8afa9655",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 3,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrOwner",
					"enabled": true,
					"contentType": 5
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "BOOLEAN2d68e110-59b3-4ec3-8c8f-5f55fa15e375",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 4,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrIsActive",
					"enabled": true
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "STRINGf90a688e-72eb-435f-89f1-919c2faaabcf",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 3,
						"column": 0,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "UsrComment",
					"enabled": true,
					"contentType": 0
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "TabGeneralInformationTabLabel",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.TabGeneralInformationTabLabelTabCaption"
					},
					"items": [],
					"order": 0
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "UsrSwimmingLessonsSchemaDetail",
				"values": {
					"itemType": 2,
					"markerValue": "added-detail"
				},
				"parentName": "TabGeneralInformationTabLabel",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "NotesAndFilesTab",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.NotesAndFilesTabCaption"
					},
					"items": [],
					"order": 1
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "Files",
				"values": {
					"itemType": 2
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "NotesControlGroup",
				"values": {
					"itemType": 15,
					"caption": {
						"bindTo": "Resources.Strings.NotesGroupCaption"
					},
					"items": []
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "Notes",
				"values": {
					"bindTo": "UsrNotes",
					"dataValueType": 1,
					"contentType": 4,
					"layout": {
						"column": 0,
						"row": 0,
						"colSpan": 24
					},
					"labelConfig": {
						"visible": false
					},
					"controlConfig": {
						"imageLoaded": {
							"bindTo": "insertImagesToNotes"
						},
						"images": {
							"bindTo": "NotesImagesCollection"
						}
					}
				},
				"parentName": "NotesControlGroup",
				"propertyName": "items",
				"index": 0
			}
		]/**SCHEMA_DIFF*/
	};
});
