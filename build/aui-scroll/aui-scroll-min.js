AUI.add("aui-scroll",function(e){var g=e.Lang,n=g.isNumber,c=g.isString,m="host",p="scroll",o="up",k="down",h="right",d="left",i="-approaching",b="-edge",f="-snap",l="-start",j=p;var a=e.Component.create({NAME:p,NS:p,ATTRS:{delay:{value:null,validator:n},lastState:{value:{scrollLeft:0,scrollTop:0}},maxCoordinate:{value:null},tolerance:{value:null,setter:function(s){var q=this;var r=0;if(n(s)){r=s;}else{if(c(s)){if(/px$/.test(s)){r=parseInt(s.substring(0,s.length-2),10);}else{if(/^\d+$/.test(s)){r=parseInt(s,10);}}}}return r;}}},EXTENDS:e.Plugin.Base,prototype:{initializer:function(r){var q=this;q.set("tolerance",r.tolerance);var s=e.one(r.host);q._host=s;s.on(j,e.bind(q._onScroll,q));q._reset();},_onScroll:function(s){var C=this;var q=C.get("lastState");var w=C.get("maxCoordinate");var u=C._host._node;var v=(u.scrollX||u.scrollLeft);var t=(u.scrollY||u.scrollTop);var x=(t>q.scrollTop);var B=(v<q.scrollLeft);var A=(v>q.scrollLeft);var y=(t<q.scrollTop);var E=(v-w.x);var D=(t-w.y);var r={scrolledDown:x,scrolledLeft:B,scrolledRight:A,scrolledUp:y,scrollSnapX:E,scrollSnapY:D,scrollLeft:v,scrollTop:t};var z=C.get("tolerance");if(y){C.fire(o,r);if((t-z)<=0){C.fire(o+b,r);}if(t<0){C.fire(o+f,r);if(q.scrollSnapY>=0){C.fire(o+f+l,r);}}if(!q.scrolledTop){C.fire(o+l,r);}}if(x){C.fire(k,r);if((D+z)>=0){C.fire(k+b,r);}if(D>0){C.fire(k+f,r);if(q.scrollSnapY<1){C.fire(k+f+l,r);}}if(!q.scrolledDown){C.fire(k+l,r);}}if(B){C.fire(d,r);if((v-z)<=0){C.fire(d+b,r);}if(E>0){C.fire(d+f,r);if(q.scrollSnapX<1){C.fire(d+f+l,r);}}if(!q.scroledlLeft){C.fire(d+l,r);}}if(A){C.fire(h,r);if((E+z)>=0){C.fire(h+b,r);}if(E>0){C.fire(h+f,r);if(q.scrollSnapX<1){C.fire(h+f+l,r);}}if(!q.scrolledRight){C.fire(h+l,r);}}if((t<0)||(E>0)||(D>0)||(v<0)){C._reset();}C.set("lastState",r);clearTimeout(C._delay);C._delay=setTimeout(C._reset.bind(C),C.get("delay"));},_reset:function(){var q=this;var r=q.get("lastState");r.scrollSnapX=0;r.scrollSnapY=0;q.set("lastState",r);var t=q._host;var s=t._node;q.set("maxCoordinate",{x:(s.scrollMaxX||s.scrollWidth)-t.innerWidth(),y:(s.scrollMaxY||s.scrollHeight)-t.innerHeight()});}}});e.Scroll=a;},"@VERSION@",{requires:["aui-base"],skinnable:false});