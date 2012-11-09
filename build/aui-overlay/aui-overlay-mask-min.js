AUI.add("aui-overlay-mask",function(n){var e=n.Lang,h=e.isArray,i=e.isString,k=e.isNumber,s=e.isValue,x=n.config,l=n.UA,p=(l.ie&&l.version.major<=6),w="absolute",d="alignPoints",u="background",v="boundingBox",j="contentBox",r="fixed",o="height",a="offsetHeight",f="offsetWidth",q="opacity",t="overlaymask",m="position",g="target",b="width";var c=n.Component.create({NAME:t,ATTRS:{alignPoints:{value:["tl","tl"],validator:h},background:{lazyAdd:false,value:null,validator:i,setter:function(y){if(y){this.get(j).setStyle(u,y);}return y;}},target:{cloneDefaultValue:false,lazyAdd:false,value:x.doc,setter:function(z){var y=this;var C=n.one(z);var B=y._isDoc=C.compareTo(x.doc);var A=y._isWin=C.compareTo(x.win);y._fullPage=B||A;return C;}},opacity:{value:0.5,validator:k,setter:function(y){return this._setOpacity(y);}},shim:{value:n.UA.ie},visible:{value:false},zIndex:{value:1000}},EXTENDS:n.OverlayBase,prototype:{bindUI:function(){var y=this;c.superclass.bindUI.apply(this,arguments);y.after("targetChange",y._afterTargetChange);y.after("visibleChange",y._afterVisibleChange);n.on("windowresize",n.bind(y.refreshMask,y));},syncUI:function(){var y=this;y.refreshMask();},getTargetSize:function(){var z=this;var D=z.get(g);var B=z._isDoc;var A=z._isWin;var y=D.get(a);var C=D.get(f);if(p){if(A){C=n.DOM.winWidth();y=n.DOM.winHeight();}else{if(B){C=n.DOM.docWidth();y=n.DOM.docHeight();}}}else{if(z._fullPage){y="100%";C="100%";}}return{height:y,width:C};},refreshMask:function(){var z=this;var F=z.get(d);var E=z.get(g);var B=z.get(v);var D=z.getTargetSize();var A=z._fullPage;B.setStyles({position:(p||!A)?w:r,left:0,top:0});var y=D.height;var C=D.width;if(s(y)){z.set(o,y);}if(s(C)){z.set(b,C);}if(!A){z.align(E,F);}},_setOpacity:function(z){var y=this;y.get(j).setStyles({opacity:z,height:"100%",width:"100%"});return z;},_uiSetVisible:function(z){var y=this;c.superclass._uiSetVisible.apply(this,arguments);if(z){y._setOpacity(y.get(q));}},_afterTargetChange:function(z){var y=this;y.refreshMask();},_afterVisibleChange:function(z){var y=this;y._uiSetVisible(z.newVal);},_uiSetXY:function(){var y=this;if(!y._fullPage||p){c.superclass._uiSetXY.apply(y,arguments);}}}});n.OverlayMask=c;},"@VERSION@",{requires:["aui-base","aui-overlay-base","event-resize"],skinnable:true});