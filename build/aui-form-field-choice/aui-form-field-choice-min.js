YUI.add("aui-form-field-choice",function(e,t){var n=e.getClassName("form","field","choice"),r=e.getClassName("form","field","choice","content"),i=e.getClassName("form","field","choice","checkbox"),s=e.getClassName("form","field","choice","form"),o=e.getClassName("form","field","choice","list"),u=e.getClassName("form","field","choice","option"),a=e.getClassName("form","field","choice","options","container"),f=e.getClassName("form","field","choice","option","other"),l=e.getClassName("form","field","choice","radio"),c='<form class="'+s+" "+a+'"></form>',h='<div class="'+u+'">'+'<input type="{type}" name="option"></input><label>{label}</label></div>',p='<select class="'+o+" "+a+'"></select>',d='<option action="" class="'+u+'"><label>{label}</label></option>',v={CHECKBOX:"checkbox",LIST:"list",RADIO:"radio"};e.FormFieldChoice=e.Base.create("form-field-choice",e.FormField,[e.FormFieldRequired],{TPL_FIELD_CONTENT:'<div class ="'+r+'"></div>',initializer:function(){this._oldTypeValue=this.get("type"),this.after({optionsChange:this._afterOptionsChange,otherOptionChange:this._afterOtherOptionChange,typeChange:this._afterTypeChange})},renderUI:function(){var t=this.get("content");e.FormFieldChoice.superclass.renderUI.call(this),t.addClass(n),this._updateOptionsContainer(),this._uiSetOptions(this.get("options"))},_afterOptionsChange:function(){this._uiSetOptions(this.get("options"))},_afterOtherOptionChange:function(){this._uiSetOtherOption(this.get("otherOption"))},_afterTypeChange:function(){this._uiSetType(this.get("type"))},_cleanOptionsContainer:function(){this.get("content").one("."+a).empty()},_createOptionNode:function(t){var n=this.get("type");return n===v.LIST?e.Node.create(e.Lang.sub(d,{label:t})):e.Node.create(e.Lang.sub(h,{label:t,type:n}))},_getFormClass:function(e){switch(e){case v.CHECKBOX:return i;case v.RADIO:return l}},_setFormType:function(e){var t=this.get("content"),n=t.one("."+a),r=t.all("."+u);n.replaceClass(this._getFormClass(this._oldTypeValue),this._getFormClass(e)),r.each(function(t){t.set("type",e)})},_uiSetOptions:function(t){var n=this,r,i;this._cleanOptionsContainer(),r=this.get("content").one("."+a),e.Array.each(t,function(e){i=n._createOptionNode(e),r.append(i)}),this._uiSetOtherOption(this.get("otherOption"))},_uiSetOtherOption:function(e){var t=this.get("content").one("."+a),n=this.get("content").one("."+f),r;n&&n.remove(),e&&(r=this._createOptionNode("Other"),r.addClass(f),t.append(r))},_uiSetType:function(e){e===v.LIST||this._oldTypeValue===v.LIST?(this._updateOptionsContainer(),this._uiSetOptions(this.get("options")),this._uiSetOtherOption(this.get("otherOption"))):this._setFormType(this.get("type")),this._oldTypeValue=e},_updateOptionsContainer:function(){var t=this.get("content").one("."+r),n;t.empty(),this.get("type")===v.LIST?n=e.Node.create(p):(n=e.Node.create(c),n.addClass(this._getFormClass(this.get("type")))),t.append(n)}},{ATTRS:{name:{validator:e.Lang.isString,value:""},options:{validator:e.Lang.isArray,value:[]},otherOption:{validator:e.Lang.isBoolean,value:!1},type:{validator:e.Lang.isString,value:v.RADIO}},TYPES:v})},"3.0.3-deprecated.57",{requires:["aui-form-field-required"],skinnable:!0});
