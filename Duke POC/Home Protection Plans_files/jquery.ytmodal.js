(function(a){var c=0,b=0;a.ytmodal=function(d,f){var d=d||{};if((typeof d.iphoneBoot=="undefined"||d.iphoneBoot)&&(navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPod/i)))return false;if(!b)if(typeof swfobject=="undefined")b="noScript";else b="2";if(typeof f=="undefined"||!f){d.scope=d.scope||a("body");a("a[href^=http://www.youtube.com/watch?v=]",d.scope).ytmodal(d);return false}d.swfWidth=d.swfWidth||"480";d.swfHeight=d.swfHeight||"295";d.flashVersion=d.flashVersion||"8";d.expressInstall=d.expressInstall||"";d.flashvars=d.flashvars||{};d.params=d.params||{menu:"false",loop:"false",wmode:"opaque"};d.replaceTime=d.replaceTime||"auto";d.keepLink=d.keepLink||d.replaceTime=="click";d.wrapper=d.wrapper||'<div class="ytmodal-video"></div>';d.autoplay=typeof d.autoplay!="undefined"?d.autoplay:d.replaceTime=="click";d.srcOptions=d.srcOptions||"?hl=en&fs=1"+(d.autoplay?"&autoplay=1":"");d.method=d.method||"href";d.target=d.target||false;var e=a(f);if(d.replaceTime=="auto")g();else d.replaceTime=="click"&&e.click(function(a){a.preventDefault();g()});function g(){function j(b){var a=b.attr("id");if(!a.length){a=i();b.attr("id",a)}return a}function i(){var a="ytmodal-"+c;c++;return a}var f=e.attr(d.method);if(f.substr(0,31)=="http://www.youtube.com/watch?v=")f="http://www.youtube.com/v/"+f.substr(31)+d.srcOptions;if(d.target)var g=d.target,h=j(g);else if(d.keepLink){var h=i();e.after(a('<div id="'+h+'"></div>'));var g=a("#"+h);g.css("clear","both")}else var g=e,h=j(g);switch(b){case"2":swfobject.embedSWF(f,h,d.swfWidth,d.swfHeight,d.flashVersion,d.expressInstall,d.flashvars,d.params);break;default:g.html('<object width="'+d.swfWidth+'" height="'+d.swfHeight+'"><param name="wmode" value="opaque"></param><param name="movie" value="'+f+'"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="'+f+'" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="'+d.swfWidth+'" height="'+d.swfHeight+'"></embed></object>')}}};a.fn.ytmodal=function(b){this.each(function(){new a.ytmodal(b,this)});return this}})(jQuery);$(function(){$("a.ytvideo").ytmodal({swfWidth:480,swfHeight:295})})