AUI.add("aui-swf",function(j){var g=j.Lang,i=j.UA,c=j.ClassNameManager.getClassName,h="swf",s="10.22",v="http://fpdownload.macromedia.com/pub/flashplayer/update/current/swf/autoUpdater.swf?"+(+new Date),d="application/x-shockwave-flash",p="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000",q="YUI.AUI.SWF.eventHandler",r="ShockwaveFlash",t=0,m=YUI.AUI.namespace("SWF.instances"),k=c(h);YUI.AUI.SWF.eventHandler=function(w,e){m[w]._eventHandler(e);};if(i.gecko||i.webkit||i.opera){var f=navigator.mimeTypes[d];if(f){var l=f.enabledPlugin;var b=[];b=l.description.replace(/\s[rd]/g,".");b=b.replace(/[A-Za-z\s]+/g,"");b=b.split(".");t=b[0]+".";switch((b[2].toString()).length){case 1:t+="00";break;case 2:t+="0";break;}t+=b[2];t=parseFloat(t);}}else{if(i.ie){try{var o=new ActiveXObject(r+"."+"6");o.AllowScriptAccess="always";}catch(u){if(o!=null){t=6;}}if(t==0){try{var n=new ActiveXObject(r+"."+r);var b=[];b=n.GetVariable("$version");b=b.replace(/[A-Za-z\s]+/g,"");b=b.split(",");t=b[0]+".";switch((b[2].toString()).length){case 1:t+="00";break;case 2:t+="0";break;}}catch(u){}}}}i.flash=t;var a=j.Component.create({NAME:h,ATTRS:{url:{value:""},version:{value:t},useExpressInstall:{value:false},fixedAttributes:{value:{}},flashVars:{value:{}},render:{value:true}},constructor:function(y){var e=this;if(arguments.length>1){var x=arguments[0];var w=arguments[1];var z=arguments[2]||{};y={boundingBox:x,url:w,fixedAttributes:z.fixedAttributes,flashVars:z.flashVars};}a.superclass.constructor.call(this,y);},getFlashVersion:function(){return t;},isFlashVersionAtLeast:function(e){return t>=e;},prototype:{CONTENT_TEMPLATE:null,renderUI:function(){var G=this;var w=a.isFlashVersionAtLeast(G.get("version"));var E=(i.flash>=8);var z=E&&!w&&G.get("useExpressInstall");var A=G.get("url");if(z){A=v;}var x=j.guid();m[x]=this;G._swfId=x;var D=G.get("contentBox");var e=G.get("flashVars");j.mix(e,{YUISwfId:x,YUIBridgeCallback:q});var C=j.QueryString.stringify(e);var B="<object ";if((w||z)&&A){B+='id="'+x+'" ';if(i.ie){B+='classid="'+p+'" ';}else{B+='type="'+d+'" data="'+A+'" ';}B+='height="100%" width="100%">';if(i.ie){B+='<param name="movie" value="'+A+'"/>';}var F=G.get("fixedAttributes");for(var y in F){B+='<param name="'+y+'" value="'+F[y]+'" />';}if(C){B+='<param name="flashVars" value="'+C+'" />';}B+="</object>";D.set("innerHTML",B);}G._swf=j.one("#"+x);},bindUI:function(){var e=this;e.publish("swfReady",{fireOnce:true});},callSWF:function(y,w){var e=this;w=w||[];var x=e._swf.getDOM();if(x[y]){return x[y].apply(x,w);}return null;},toString:function(){var e=this;return"SWF"+e._swfId;},_eventHandler:function(x){var e=this;var w=x.type.replace(/Event$/,"");if(w!="log"){e.fire(w,x);}}}});j.SWF=a;},"@VERSION@",{requires:["aui-base","querystring-stringify-simple"],skinnable:false});