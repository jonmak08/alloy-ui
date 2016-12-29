AUI.add("aui-chart",function(y){var h=y.Lang,s=y.getClassName,b=y.config.doc,l="chart",x=s(l),g=y.config.base+"aui-chart/assets/chart.swf?t="+h.now();YUI.AUI.namespace("_CHART");YUI.AUI.namespace("defaults.chart");var E=y.Component.create({NAME:l,ATTRS:{type:{value:"pie"},dataSource:{value:null},altText:{getter:"_getAltText",setter:"_setAltText"},swfURL:{valueFn:function(){return YUI.AUI.defaults.chart.swfURL||g;}},swfCfg:{value:{}},request:{value:"*"},series:{value:null},categoryNames:{getter:"_getCategoryNames",setter:"_setCategoryNames"},dataTipFunction:{setter:"_setDataTipFunction"},legendLabelFunction:{setter:"_setLegendLabelFunction"},style:{value:null},pollingInterval:{value:0}},proxyFunctionCount:0,createProxyFunction:function(J,I){var A=E.proxyFunctionCount;var K="proxyFunction"+A;YUI.AUI._CHART[K]=y.bind(J,I);E.proxyFunctionCount++;return"YUI.AUI._CHART."+K;},getFunctionReference:function(J){var A=this;if(h.isFunction(J)){J=E.createProxyFunction(J);}else{if(J.fn&&h.isFunction(J.fn)){var I=[J.fn];if(J.context&&h.isObject(context)){I.push(J.context);}J=E.createProxyFunction(A,I);}}return J;},removeProxyFunction:function(A){if(A&&A.indexOf("YUI.AUI._CHART.proxyFunction")>-1){A=A.substr(12);YUI.AUI._CHART[A]=null;}},prototype:{renderUI:function(){var O=this;var A={align:"",allowNetworking:"",allowScriptAccess:"",base:"",bgcolor:"",menu:"",name:"",quality:"",salign:"",scale:"",tabindex:"",wmode:""};var N=O.get("contentBox");var J={boundingBox:N,fixedAttributes:{allowScriptAccess:"sameDomain"},flashVars:{allowedDomain:b.location.hostname},backgroundColor:N.getStyle("backgroundColor"),url:O.get("swfURL"),height:O.get("height"),width:O.get("width"),version:9.045};var P=O.get("swfCfg");for(var L in P){if(A.hasOwnProperty(L)){J.fixedAttributes[L]=P[L];}else{J[L]=P[L];}}var M=J.version;if(M&&h.isValue(M)&&M!="undefined"){var K=(/\w*.\w*/.exec(((M).toString()).replace(/.0./g,"."))).toString();var I=K.split(".");M=I[0]+".";switch((I[1].toString()).length){case 1:M+="00";break;case 2:M+="0";break;}M+=I[1];J.version=parseFloat(M);}O._swfWidget=new y.SWF(J);O._swfNode=O._swfWidget._swf;if(O._swfNode){O._swf=O._swfNode.getDOM();O._swfWidget.on("swfReady",O._eventHandler,O);O.set("swfCfg",J);}},bindUI:function(){var A=this;A.publish("itemMouseOver");A.publish("itemMouseOut");A.publish("itemClick");A.publish("itemDblClick");A.publish("itemDragStart");A.publish("itemDragEnd");A.publish("itemDrag");A.after("seriesChange",A.refreshData);A.after("dataSourceChange",A.refreshData);A.after("pollingIntervalChange",A.refreshData);var I=A.get("dataSource");I.after("response",A._loadDataHandler,A);},setStyle:function(I,J){var A=this;J=y.JSON.stringify(J);A._swf.setStyle(I,J);},setStyles:function(I){var A=this;I=y.JSON.stringify(I);A._swf.setStyles(I);},setSeriesStyles:function(J){var A=this;for(var I=0;I<J.length;I++){J[I]=y.JSON.stringify(J[I]);}A._swf.setSeriesStyles(J);},_eventHandler:function(I){var A=this;if(I.type=="swfReady"){A._swfNode=A._swfWidget._swf;A._swf=A._swfNode.getDOM();A._loadHandler();A.fire("contentReady");}},_loadHandler:function(){var A=this;if(A._swf&&A._swf.setType){A._swf.setType(A.get("type"));var I=A.get("style");if(I){A.setStyles(I);}A._syncChartAttrs();A._initialized=true;A.refreshData();}},_syncChartAttrs:function(){var A=this;var I=A._originalConfig;if(I.categoryNames){A.set("categoryNames",I.categoryNames);}if(I.dataTipFunction){A.set("dataTipFunction",I.dataTipFunction);}if(I.legendLabelFunction){A.set("legendLabelFunction",I.legendLabelFunction);}if(I.series){A.set("series",I.series);}},refreshData:function(){var A=this;if(A._initialized){var L=A.get("dataSource");if(L){var I=A._pollingID;if(I!==null){L.clearInterval(I);A._pollingID=null;}var K=A.get("pollingInterval");var J=A.get("request");if(K>0){A._pollingID=L.setInterval(K,J);}L.sendRequest(J);}}},_loadDataHandler:function(I){var T=this;if(T._swf&&!I.error){var R=T._seriesFunctions;if(R){for(var O=0;O<R.length;O++){E.removeProxyFunction(R[O]);}T._seriesFunctions=null;}T._seriesFunctions=[];var L=[];var K=0;var U=null;var A=T.get("series");if(A!==null){K=A.length;for(var O=0;O<K;O++){U=A[O];var J={};for(var S in U){if(S=="style"){if(U.style!==null){J.style=y.JSON.stringify(U.style);}}else{if(S=="labelFunction"){if(U.labelFunction!==null){J.labelFunction=E.getFunctionReference(U.labelFunction);T._seriesFunctions.push(J.labelFunction);}}else{if(S=="dataTipFunction"){if(U.dataTipFunction!==null){J.dataTipFunction=E.getFunctionReference(U.dataTipFunction);T._seriesFunctions.push(J.dataTipFunction);}}else{if(S=="legendLabelFunction"){if(U.legendLabelFunction!==null){J.legendLabelFunction=E.getFunctionReference(U.legendLabelFunction);T._seriesFunctions.push(J.legendLabelFunction);}}else{J[S]=U[S];}}}}}L.push(J);}}var Q=T.get("type");var N=I.response.results;if(K>0){for(var O=0;O<K;O++){U=L[O];if(!U.type){U.type=Q;}U.dataProvider=N;}}else{var M={type:Q,dataProvider:N};L.push(M);}try{if(T._swf.setDataProvider){T._swf.setDataProvider(L);}}catch(P){T._swf.setDataProvider(L);}}},_getCategoryNames:function(){var A=this;return A._swf.getCategoryNames();},_setCategoryNames:function(I){var A=this;A._swf.setCategoryNames(I);return I;},_setDataTipFunction:function(I){var A=this;if(A._dataTipFunction){E.removeProxyFunction(A._dataTipFunction);}if(I){A._dataTipFunction=I=E.getFunctionReference(I);}A._swf.setDataTipFunction(I);return I;},_setLegendLabelFunction:function(I){var A=this;if(A._legendLabelFunction){E.removeProxyFunction(A._legendLabelFunction);}if(I){A._legendLabelFunction=I=E.getFunctionReference(I);}A._swf.setLegendLabelFunction(I);return I;},_getAltText:function(){var A=this;return A._swf.getAltText();},_setAltText:function(){var A=this;A._swf.setAltText(value);return value;},_pollingID:null}});y.Chart=E;var h=y.Lang,s=y.getClassName,l="piechart";var q=y.Component.create({NAME:l,ATTRS:{dataField:{getter:"_getDataField",setter:"_setDataField",validator:h.isString},categoryField:{getter:"_getCategoryField",setter:"_setCategoryField",validator:h.isString}},EXTENDS:y.Chart,prototype:{_syncChartAttrs:function(){var A=this;
q.superclass._syncChartAttrs.apply(A,arguments);var I=A._originalConfig;if(I.dataField){A.set("dataField",I.dataField);}if(I.categoryField){A.set("categoryField",I.categoryField);}},_getDataField:function(){var A=this;return A._swf.getDataField();},_setDataField:function(I){var A=this;A._swf.setDataField(I);return I;},_getCategoryField:function(){var A=this;return A._swf.getCategoryField();},_setCategoryField:function(I){var A=this;A._swf.setCategoryField(I);return I;}}});y.PieChart=q;var h=y.Lang,s=y.getClassName,l="cartesianchart",k=s(l);var e=y.Component.create({NAME:l,ATTRS:{xField:{getter:"_getXField",setter:"_setXField",validator:h.isString},yField:{getter:"_getYField",setter:"_setYField",validator:h.isString},xAxis:{setter:"_setXAxis"},xAxes:{setter:"_setXAxes"},yAxis:{setter:"_setYAxis"},yAxes:{setter:"_setYAxes"},constrain2view:{setter:"_setConstrain2view"}},EXTENDS:y.Chart,prototype:{initializer:function(){var A=this;A._xAxisLabelFunctions=[];A._yAxisLabelFunctions=[];},destructor:function(){var A=this;A._removeAxisFunctions(A._xAxisLabelFunctions);A._removeAxisFunctions(A._yAxisLabelFunctions);},_syncChartAttrs:function(){var A=this;e.superclass._syncChartAttrs.apply(A,arguments);var I=A._originalConfig;if(I.xField){A.set("xField",I.xField);}if(I.yField){A.set("yField",I.yField);}if(I.xAxis){A.set("xAxis",I.xAxis);}if(I.yAxis){A.set("yAxis",I.yAxis);}if(I.xAxes){A.set("xAxes",I.xAxes);}if(I.yAxes){A.set("yAxes",I.yAxes);}if(I.constrain2view){A.set("constrain2view",I.constrain2view);}},_getXField:function(){var A=this;return A._swf.getHorizontalField();},_setXField:function(I){var A=this;A._swf.setHorizontalField(I);return I;},_getYField:function(){var A=this;return A._swf.getVerticalField();},_setYField:function(I){var A=this;A._swf.setVerticalField(I);return I;},_getClonedAxis:function(J){var A=this;var K={};for(var I in J){if(I=="labelFunction"){if(J.labelFunction&&J.labelFunction!==null){K.labelFunction=E.getFunctionReference(J.labelFunction);}}else{K[I]=J[I];}}return K;},_setXAxis:function(I){var A=this;if(I.position!="bottom"&&I.position!="top"){I.position="bottom";}A._removeAxisFunctions(A._xAxisLabelFunctions);I=A._getClonedAxis(I);A._xAxisLabelFunctions.push(I.labelFunction);A._swf.setHorizontalAxis(I);return I;},_setXAxes:function(J){var A=this;A._removeAxisFunctions(A._xAxisLabelFunctions);for(var I=0;I<J.length;I++){var K=J[I];if(K.position=="left"){K.position="bottom";}J[I]=A._getClonedAxis(K);K=J[I];if(K.labelFunction){A._xAxisLabelFunctions.push(K.labelFunction);}A._swf.setHorizontalAxis(K);}},_setYAxis:function(I){var A=this;A._removeAxisFunctions(A._yAxisLabelFunctions);I=A._getClonedAxis(I);A._yAxisLabelFunctions.push(I.labelFunction);A._swf.setVerticalAxis(I);},_setYAxes:function(J){var A=this;A._removeAxisFunctions(A._yAxisLabelFunctions);for(var I=0;I<J.length;I++){J[I]=A._getClonedAxis(J[I]);var K=J[I];if(K.labelFunction){A._yAxisLabelFunctions.push(K.labelFunction);}A._swf.setVerticalAxis(K);}},_setConstrain2view:function(I){var A=this;A._swf.setConstrainViewport(I);},setSeriesStylesByIndex:function(I,J){var A=this;if(A._swf&&A._swf.setSeriesStylesByIndex){J=y.JSON.stringify(J);A._swf.setSeriesStylesByIndex(I,J);}},_removeAxisFunctions:function(K){var I=this;if(K&&K.length){for(var J=0;J<K.length;J++){var A=K[J];if(A){y.Chart.removeProxyFunction(A);}}K=[];}}}});y.CartesianChart=e;var h=y.Lang,s=y.getClassName,l="linechart",z=s(l);var a=y.Component.create({NAME:l,ATTRS:{type:{value:"line"}},EXTENDS:y.CartesianChart});y.LineChart=a;var h=y.Lang,s=y.getClassName,l="columnchart",n=s(l);var D=y.Component.create({NAME:l,ATTRS:{type:{value:"column"}},EXTENDS:y.CartesianChart});y.ColumnChart=D;var h=y.Lang,s=y.getClassName,l="barchart",r=s(l);var v=y.Component.create({NAME:l,ATTRS:{type:{value:"bar"}},EXTENDS:y.CartesianChart});y.BarChart=v;var h=y.Lang,s=y.getClassName,l="stackedcolumnchart",H=s(l);var G=y.Component.create({NAME:l,ATTRS:{type:{value:"stackcolumn"}},EXTENDS:y.CartesianChart});y.StackedColumnChart=G;var h=y.Lang,s=y.getClassName,l="stackedbarchart",j=s(l);var m=y.Component.create({NAME:l,ATTRS:{type:{value:"stackbar"}},EXTENDS:y.CartesianChart});y.StackedBarChart=m;var p=function(){};p.prototype={type:null,reverse:false,labelFunction:null,labelSpacing:2,title:null};y.Chart.Axis=p;var u=function(){u.superclass.constructor.apply(this,arguments);};y.extend(u,p,{type:"numeric",minimum:NaN,maximum:NaN,majorUnit:NaN,minorUnit:NaN,snapToUnits:true,stackingEnabled:false,alwaysShowZero:true,scale:"linear",roundMajorUnit:true,calculateByLabelSize:true,position:"left",adjustMaximumByMajorUnit:true,adjustMinimumByMajorUnit:true});y.Chart.NumericAxis=u;var d=function(){d.superclass.constructor.apply(this,arguments);};y.extend(d,p,{type:"time",minimum:null,maximum:null,majorUnit:NaN,majorTimeUnit:null,minorUnit:NaN,minorTimeUnit:null,snapToUnits:true,stackingEnabled:false,calculateByLabelSize:true});y.Chart.TimeAxis=d;var f=function(){f.superclass.constructor.apply(this,arguments);};y.extend(f,p,{type:"category",categoryNames:null,calculateCategoryCount:false});y.Chart.CategoryAxis=f;var o=function(){};o.prototype={type:null,displayName:null};y.Chart.Series=o;var F=function(){F.superclass.constructor.apply(this,arguments);};y.extend(F,o,{xField:null,yField:null,axis:"primary",showInLegend:true});y.Chart.CartesianSeries=F;var c=function(){c.superclass.constructor.apply(this,arguments);};y.extend(c,F,{type:"column"});y.Chart.ColumnSeries=c;var t=function(){t.superclass.constructor.apply(this,arguments);};y.extend(t,F,{type:"line"});y.Chart.LineSeries=t;var B=function(){B.superclass.constructor.apply(this,arguments);};y.extend(B,F,{type:"bar"});y.Chart.BarSeries=B;var C=function(){C.superclass.constructor.apply(this,arguments);};y.extend(C,o,{type:"pie",dataField:null,categoryField:null,labelFunction:null});y.Chart.PieSeries=C;var i=function(){i.superclass.constructor.apply(this,arguments);};y.extend(i,F,{type:"stackbar"});y.Chart.StackedBarSeries=i;var w=function(){w.superclass.constructor.apply(this,arguments);
};y.extend(w,F,{type:"stackcolumn"});y.Chart.StackedColumnSeries=w;},"@VERSION@",{skinnable:false,requires:["datasource","aui-swf","json"]});