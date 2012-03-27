var Lang = A.Lang,
	isString = Lang.isString,
	getCN = A.getClassName,
	
	NAME = 'AutocompleteSearchList',

	ADD = 'add',
	BLANK = "''",
	CHECKED = 'checked',
	CLICK = 'click',
	DOC = A.config.doc,
	PHRASE_MATCH = 'phraseMatch',
	REMOVE = 'remove',
	RENDER = 'render',
	SEARCH_INITIALLY = 'searchInitially',
	
	TPL_AC_SEARCH_LIST = '<div class="aui-autocomplete-search-list" />',
	TPL_AC_CONTAINER = '<span class="aui-field-content aui-autocomplete-search-list-ac-container">',
	TPL_AC_INPUT = '<input class="aui-field-input aui-field-input-text" id="ac-input" type="text" name="test-input" value="Filter" onfocus="if(!this._haschanged){this.value=' + BLANK + '};this._haschanged=true;" class="aui-field-input aui-field-input-text"/></span>',
	TPL_CHECKED = ' checked="checked" ',

	CSS_NO_MATCHES = 'no-matches',
	CSS_NO_MATCHES_ESCAPE = '\"' + CSS_NO_MATCHES + '\"',

	NODE_BLANK_TEXT = DOC.createTextNode('');
	
var AutocompleteSearchList = function(){};

A.mix(AutocompleteSearchList, {
		NAME: NAME,

		NS: NAME,

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

			initialResult: {
				value: null
			},

			inputNode: {
				value: '#ac-input'
			},

			inputSelector: {
				value: null
			},
			
			message: {
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

					var templateType = instance.get('templateType');

					switch (templateType){
						case 'asset-tags-selector': 
						default: 
							
							return A.AutocompleteSearchList.TPL || new A.Template(
								'<fieldset class="{[(!values.results || !values.results.length) ? ' + CSS_NO_MATCHES_ESCAPE + ' : \"\"]}">',
									'<tpl for="results">',
										'<label title="{text}"><input type="checkbox" value="{text}" {[values.checked ? "checked" : ""]} />{text}</label>',
									'</tpl>',
									'<div class="lfr-tag-message">{message}</div>',
								'</fieldset>'
							 );
						
						break;
					}
				}
			},

			templateType : {
				value: 'asset-tags-selector'
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

				instance.set(SEARCH_INITIALLY, PHRASE_MATCH);

				this.afterHostEvent(RENDER, function(){

					var entriesNode = A.Node.create(TPL_AC_SEARCH_LIST);

					var inputNode = A.Node.create(TPL_AC_CONTAINER + TPL_AC_INPUT);

					var host = config.host;

					instance.inputNode = inputNode;

					host.bodyNode.append(inputNode);

					host.bodyNode.append(entriesNode);

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

				if (instance.get(SEARCH_INITIALLY)){
					
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

				var raw_items = A.Array.map (
					event.results, 
					function(item, index, collection)
						{	
							return item.raw;	
						}
					);	

				var data = instance._augmentDataWithChecked(raw_items);

				return {
					results: data
				};
			},

			_augmentDataWithChecked: function(data){
				var instance = this;

				var entries = instance.entries;

				if (entries){

					for (var i = 0; i < data.length; i++) {

						var tag = data[i];

						tag.checked =  entries.indexOfKey(tag.text) > -1 ? TPL_CHECKED : '';
					}
				} 

				return data;
			},

			_renderEntries: function(data){
				var instance = this;

				template = instance.get('template');

				data.message = instance.get('message');

				template.render(data, instance.entriesNode);
			},

			_onCheckboxClickListener: function(event) {
				var instance = this;

				var checkbox = event.currentTarget;

				var checked = checkbox.get(CHECKED);

				var value = checkbox.val();

				var action = checked ? ADD : REMOVE;

				instance.tagSelector[action](value);
			
			},
		}
	}, true
);

A.AutocompleteSearchList = A.Component.build(NAME, A.Plugin.Base, [A.AutoCompleteBase, AutocompleteSearchList]);

A.AutocompleteSearchList.NS = NAME;