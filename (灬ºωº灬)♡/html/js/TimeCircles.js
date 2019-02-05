// build time:Tue Feb 05 2019 19:33:17 GMT+0800 (中国标准时间)
(function(t){function e(t){var e=/^#?([a-f\d])([a-f\d])([a-f\d])$/i;t=t.replace(e,function(t,e,i,a){return e+e+i+i+a+a});var i=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return i?{r:parseInt(i[1],16),g:parseInt(i[2],16),b:parseInt(i[3],16)}:null}function i(){return Math.floor((1+Math.random())*65536).toString(16).substring(1)}function a(){return i()+i()+"-"+i()+"-"+i()+"-"+i()+"-"+i()+i()+i()}var s={};var r=function(e,i){this.element=e;this.container;this.timer=null;this.data={text_elements:{Days:null,Hours:null,Minutes:null,Seconds:null},attributes:{canvas:null,context:null,item_size:null,line_width:null,radius:null,outer_radius:null},state:{fading:{Days:false,Hours:false,Minutes:false,Seconds:false}}};this.listeners=[];this.config=null;this.setOptions(i);this.container=t("<div>");this.container.addClass("time_circles");this.container.appendTo(this.element);this.data.attributes.canvas=t("<canvas>");this.data.attributes.context=this.data.attributes.canvas[0].getContext("2d");var a=this.element.offsetHeight;var s=this.element.offsetWidth;if(a===0&&s>0)a=s/4;else if(s===0&&a>0)s=a*4;this.data.attributes.canvas[0].height=a;this.data.attributes.canvas[0].width=s;this.data.attributes.canvas.appendTo(this.container);this.data.attributes.item_size=Math.min(this.data.attributes.canvas[0].width/4,this.data.attributes.canvas[0].height);this.data.attributes.line_width=this.data.attributes.item_size*this.config.fg_width;this.data.attributes.radius=(this.data.attributes.item_size*.8-this.data.attributes.line_width)/2;this.data.attributes.outer_radius=this.data.attributes.radius+.5*Math.max(this.data.attributes.line_width,this.data.attributes.line_width*this.config.bg_width);var r=0;for(var n in this.data.text_elements){var o=t("<div>");o.addClass("textDiv_"+n);o.css("top",Math.round(.35*this.data.attributes.item_size));o.css("left",Math.round(r++*this.data.attributes.item_size));o.css("width",this.data.attributes.item_size);o.appendTo(this.container);var h=t("<h4>");h.text(this.config.time[n].text);h.css("font-size",Math.round(.07*this.data.attributes.item_size));h.css("line-height",Math.round(.07*this.data.attributes.item_size)+"px");h.appendTo(o);var u=t("<span>");u.css("font-size",Math.round(.21*this.data.attributes.item_size));u.css("line-height",Math.round(.07*this.data.attributes.item_size)+"px");u.appendTo(o);this.data.text_elements[n]=u}if(this.config.start)this.start()};r.prototype.updateArc=function(){var t,e;var i=1e3*this.config.refresh_interval;var a=new Date;if(this.config.count_past_zero){var s=a-i;t=Math.abs(a-this.data.attributes.ref_date)/1e3;e=Math.abs(this.data.attributes.ref_date-s)/1e3}else{t=Math.max(this.data.attributes.ref_date-a,0)/1e3;e=t+(a>this.data.attributes.ref_date)?0:i}var r={Days:t/60/60/24,Hours:t/60/60%24,Minutes:t/60%60,Seconds:t%60};var n={Days:r.Days/365,Hours:r.Hours/24,Minutes:r.Minutes/60,Seconds:r.Seconds/60};var o={Days:e/60/60/24,Hours:e/60/60%24,Minutes:e/60%60,Seconds:e%60};var h=0;var u=null;for(var d in r){this.data.text_elements[d].text(Math.floor(r[d]));var f=h*this.data.attributes.item_size+this.data.attributes.item_size/2;var c=this.data.attributes.item_size/2;var l=this.config.time[d].color;if(Math.floor(r[d])!==Math.floor(o[d])){this.notifyListeners(d,Math.floor(r[d]),Math.floor(t))}if(u!==null){if(Math.floor(r[u])>Math.floor(o[u])){this.radialFade(f,c,l,1,d);this.data.state.fading[d]=true}else if(Math.floor(r[u])<Math.floor(o[u])){this.radialFade(f,c,l,0,d);this.data.state.fading[d]=true}}if(!this.data.state.fading[d]){this.drawArc(f,c,l,n[d])}u=d;h++}};r.prototype.drawArc=function(t,e,i,a){var s=Math.max(this.data.attributes.outer_radius,this.data.attributes.item_size/2);this.data.attributes.context.clearRect(t-s,e-s,s*2,s*2);if(this.config.use_background){this.data.attributes.context.beginPath();this.data.attributes.context.arc(t,e,this.data.attributes.radius,0,2*Math.PI,false);this.data.attributes.context.lineWidth=this.data.attributes.line_width*this.config.bg_width;this.data.attributes.context.strokeStyle=this.config.circle_bg_color;this.data.attributes.context.stroke()}var r=-.5*Math.PI;var n=-.5*Math.PI+2*a*Math.PI;var o=false;this.data.attributes.context.beginPath();this.data.attributes.context.arc(t,e,this.data.attributes.radius,r,n,o);this.data.attributes.context.lineWidth=this.data.attributes.line_width;this.data.attributes.context.strokeStyle=i;this.data.attributes.context.stroke()};r.prototype.radialFade=function(t,i,a,s,r){var n=e(a);var o=this;var h=.2*(s===1?-1:1);var u;for(u=0;s<=1&&s>=0;u++){(function(){var e="rgba("+n.r+", "+n.g+", "+n.b+", "+Math.round(s*10)/10+")";setTimeout(function(){o.drawArc(t,i,e,1)},50*u)})();s+=h}setTimeout(function(){o.data.state.fading[r]=false},50*u)};r.prototype.timeLeft=function(){var t=new Date;return(this.data.attributes.ref_date-t)/1e3};r.prototype.start=function(){var e=t(this.element).data("date");if(typeof e==="string"){if(e.match(/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}\s[0-9]{1,2}:[0-9]{2}:[0-9]{2}$/).length>0){e=e.replace("T"," ")}this.data.attributes.ref_date=Date.parse(e)}else{var i=t(this.element).attr("data-timer");if(typeof i==="string"){this.data.attributes.timer=parseFloat(i);t(this.element).removeAttr("data-timer")}else if(typeof this.config.timer==="string"){this.data.attributes.timer=parseFloat(this.config.timer);this.config.timer=null}else if(typeof this.config.timer==="number"){this.data.attributes.timer=a.config.timer;this.config.timer=null}if(typeof this.data.attributes.timer==="number"){this.data.attributes.ref_date=(new Date).getTime()+this.data.attributes.timer*1e3}else{this.data.attributes.ref_date=this.config.ref_date}}var a=this;this.timer=setInterval(function(){a.updateArc()},this.config.refresh_interval*1e3)};r.prototype.stop=function(){if(typeof this.data.attributes.timer==="number"){this.data.attributes.timer=this.timeLeft(this)}clearInterval(this.timer)};r.prototype.destroy=function(){this.stop();this.container.remove();t(this.element).removeData("tc-id")};r.prototype.setOptions=function(e){if(this.config===null){this.default_options.ref_date=new Date;this.config=t.extend(true,{},this.default_options)}t.extend(true,this.config,e)};r.prototype.addListener=function(t){if(typeof t!=="function")return;this.listeners.push(t)};r.prototype.notifyListeners=function(t,e,i){for(var a=0;a<this.listeners.length;a++){this.listeners[a](t,e,i)}};r.prototype.default_options={ref_date:new Date,start:true,refresh_interval:.1,count_past_zero:true,circle_bg_color:"",use_background:true,fg_width:.1,bg_width:1.2,time:{Days:{show:true,text:"Days",color:"#FC6"},Hours:{show:true,text:"Hours",color:"#9CF"},Minutes:{show:true,text:"Minutes",color:"#BFB"},Seconds:{show:true,text:"Seconds",color:"#F99"}}};var n=function(t,e){this.elements=t;this.options=e;this.foreach()};n.prototype.foreach=function(e){var i=this;this.elements.each(function(){var n;var o=t(this).data("tc-id");if(typeof o==="undefined"){o=a();t(this).data("tc-id",o)}if(typeof s[o]==="undefined"){var h=t(this).data("options");var u=i.options;if(typeof h==="object"){u=t.extend(true,{},i.options,h)}n=new r(this,u);s[o]=n}else{n=s[o];if(typeof i.options!=="undefined"){n.setOptions(i.options)}}if(typeof e==="function"){e(n)}});return this};n.prototype.start=function(){this.foreach(function(t){t.start()});return this};n.prototype.stop=function(){this.foreach(function(t){t.stop()});return this};n.prototype.addListener=function(t){this.foreach(function(e){e.addListener(t)});return this};n.prototype.destroy=function(){this.foreach(function(t){t.destroy()});return this};n.prototype.end=function(){return this.elements};t.fn.TimeCircles=function(t){return new n(this,t)}})(jQuery);
//rebuild by neat 