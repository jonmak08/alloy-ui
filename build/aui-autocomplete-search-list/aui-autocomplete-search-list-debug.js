AUI.add('aui-autocomplete-search-list', function(A) {
var Lang = A.Lang,
	isString = Lang.isString,
	
	AC_INPUT = '#ac-input'
	ADD = 'add',
	ASSET_TAGS_SELECTOR = 'asset-tags-selector',
	AUTOCOMPLETE_SEARCH_LIST = 'AutocompleteSearchList',
	BLANK = "''",
	CHECKED = 'checked',
	CHECKED_FORMAT = ' checked="checked" ',
	CLICK = 'click',
	COMMA_SPACE = ', ',
	DIV_CLASS_AUI_AUTOCOMPLETE_SEARCH_LIST = '<div class="aui-autocomplete-search-list" />',
	DOC = A.config.doc,
	getClassName = A.getClassName,
	INPUT_SELECTOR = 'inputSelector',
	INPUT_NODE = 'inputNode',
	INPUT_NODE_VALUE = this.inputNode,
	PHRASE_MATCH = 'phraseMatch',
	PORTAL_MODEL_RESOURCE = 'portalModelResource',
	MIN_QUERY_LENGTH = 'minQueryLength',
	NAME = 'AutocompleteSearchList';
	REMOVE = 'remove',
	RENDER = 'render',
	RESULTS = 'results',
	RESULT_FILTERS = 'resultFilters',
	SEARCH_INITIALLY = 'searchInitially',
	TEMPLATE = 'template',
	TEMPLATE_TYPE = 'templateType',

	TPL_AC_CONTAINER = '<span class="aui-field-content aui-autocomplete-search-list-ac-container">',
	TPL_AC_INPUT = '<input class="aui-field-input aui-field-input-text" id="ac-input" type="text" name="test-input" value="Filter" onfocus="if(!this._haschanged){this.value=' + BLANK + '};this._haschanged=true;" class="aui-field-input aui-field-input-text"/></span>',
	TPL_CHECKED = ' checked="checked" ',
	TPL_FIELD = '<span class="aui-field aui-field-choice aui-field-checkbox aui-field-checked">',
	TPL_FIELD_CONTENT = '<span class="aui-field-content">',
	TPL_FIELDSET = '<fieldset class="{[ !values.results || !values.results.length ? "no-matches" : "" ]}" >',
	TPL_FOR_RESULTS = '{[ !values.results || !values.results.length ? "No Tags Found." : "" ]}<tpl for="results">',
	TPL_LABEL_INPUT = '<label title="{text}"><input class="aui-field-input aui-field-input-choice aui-field-input-checkbox" type="checkbox" value="{text}" {[values.checked ? "checked" : ""]} >{text}</label>',
	

	CSS_ = getClassName(AUTOCOMPLETE_SEARCH_LIST),

	NODE_BLANK_TEXT = DOC.createTextNode('');
	
var AutocompleteSearchList = function(){};

A.mix(AutocompleteSearchList, {
		NAME: AUTOCOMPLETE_SEARCH_LIST,

		NS: AUTOCOMPLETE_SEARCH_LIST,

		EXTENDS: A.Plugin.Base,

		AUGMENTS: [A.AutoCompleteBase],

		ATTRS: {

			entries: {
				value: null
			},

			entriesNode: {
				value: null
			},

			entryHolder: {
				value: null
			},

			inputNode: {
				value: AC_INPUT
			},

			inputSelector: {
				value: null
			},
			
			minQueryLength: {
				value: 0
			},

			portalModelResource: {
				value: false
			},

			searchInitially: {
				value: true
			},

			source: {
				value: null
			},

			tagSelector: {
				
			},

			template: {
				valueFn: function(){
					var instance = this;

					var templateType = instance.get(TEMPLATE_TYPE);

					switch (templateType){
						case 'asset-tags-selector': 
						default: 
							
							return A.AutocompleteSearchList.TPL || new A.Template( TPL_FIELD + TPL_FIELD_CONTENT + TPL_FIELDSET + TPL_FOR_RESULTS + TPL_LABEL_INPUT + '</tpl></fieldset></span></span>');
						
						break;
					}
				}
			},

			templateType : {
				value: 'asset-tags-selector'
			},

			initialResult: {
				value: null
			}
		},

		prototype: {

			/*
			* Lifecycle
			*/

			initializer: function(config) {
				var instance = this;		

				if (instance.get('tagSelector')){
					instance.tagSelector = instance.get('tagSelector');

					instance.entries = instance.tagSelector.entries;

					instance.inputSelector = instance.tagSelector.entries;
				}

				instance.set(RESULT_FILTERS, PHRASE_MATCH);

				this.afterHostEvent(RENDER, function(){

					var inputNode = A.Node.create(TPL_AC_CONTAINER + TPL_AC_INPUT);

					instance.inputNode = inputNode;

					config.host.bodyNode.append(inputNode);

					var entriesNode = A.Node.create(DIV_CLASS_AUI_AUTOCOMPLETE_SEARCH_LIST);

					config.host.bodyNode.append(entriesNode);

					instance.entriesNode = entriesNode;	

					instance.bindUI();

					if (instance.tagSelector){

						var onCheckboxClick = A.bind(instance._onCheckboxClickListener, instance);

						entriesNode.delegate(CLICK, onCheckboxClick, 'input[type=checkbox]');
					}
				});
			},
			
			bindUI: function(){
				var instance = this;

				instance.before('results', function(event){		
					var result_data = instance._formatResultData(event);

					instance._renderEntries(result_data);
					
				});

				if(instance.get(SEARCH_INITIALLY)){
					
					var result_data = instance._getInitialSearch();

					instance._renderEntries(result_data);

				}	
			},

			_getInitialSearch: function(){
				var instance = this;

				var initialResult = instance.get('initialResult');

				var result_data = {
					results: initialResult
				}; 

				var i = result_data.results.length;
				while (i--){
					result_data.results[i].text = result_data.results[i].name;
					result_data.results[i].checked = initialResult[i].assetCount;
				}

				return result_data;

			},

			_formatResultData: function(event){
				var instance = this;

				var raw_items = A.Array.map (event.results, function(item, index, collection){
						
						return item.raw;	
					});	

				var result_data = instance._augmentResultsWithChecked(raw_items);

				return result_data;
			},

			_augmentResultsWithChecked: function(c){
				var instance = this;

				var result_data = {
					results: c
				};

				if (instance.entries){
					var i = instance.entries.length;
					
					while(i--){
						var j = result_data.results.length;
						
						while(j--){

							var entriesKey = instance.entries.keys[i];

							var resultValue = result_data.results[j].value;

							if (result_data.results[j].name){
								resultValue = result_data.results[j].name;
							}

							if (resultValue === entriesKey){
								result_data.results[j].checked = true;
							}
						}
					}
				}

				return result_data;
			},

			_renderEntries: function(data){
				var instance = this;

				template = instance.get(TEMPLATE);

				template.render(data, instance.entriesNode);
			},

			_onCheckboxClickListener: function(event) {
				var instance = this;

				var checkbox = event.currentTarget;

				var checked = checkbox.get(CHECKED);

				var value = checkbox.val();

				var action = REMOVE;

				if (checked) {
					action = ADD;
				}
			
				instance.tagSelector[action](value);
			
			},
		}
	}, true
);

A.AutocompleteSearchList = A.Component.build(AUTOCOMPLETE_SEARCH_LIST, A.Plugin.Base, [A.AutoCompleteBase, AutocompleteSearchList]);

A.AutocompleteSearchList.NS = AUTOCOMPLETE_SEARCH_LIST;

}, '@VERSION@' ,{skinnable:true, requires:['aui-base', 'aui-panel', 'dd-constrain', 'aui-button-item', 'aui-overlay-manager', 'aui-template', 'aui-overlay-mask','aui-io-plugin','aui-resize', 'aui-field-input', 'aui-field-input-text', 'aui-dialog', 'autocomplete', 'autocomplete-highlighters', 'autocomplete-filters', 'plugin']});
