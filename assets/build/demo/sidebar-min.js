KISSY.add("demo/sidebar",function(e,t,s,i,a){var r=e.all,n=new s,o=function(){this.el=r("#J_Sidebar"),this.elHd=r("#J_SidebarHd"),this.elBd=r("#J_SidebarBd"),this.modulesHd=r("#J_ModulesHd"),this.modulesBd=r("#J_ModulesBd"),this.events={"click #J_ModulesHd a":"getApi","click .J_Module":"toggle","click .J_Subcat":"toggle","click .J_Entrie":"toggle"},this.init()};return e.extend(o,t),o.prototype.init=function(){o.superclass.constructor.call(this),this.modulesHd.one("a").fire("click")},o.prototype.render=function(t){var s,i,r=this;s=["{{#api}}",'<ul class="modules">',"{{#subcls}}",'<li class="module">','<p class="J_Module module-name" data-name="{{name}}" data-type="module"><i class="icon-caret-right"></i>{{name}}</span>',"{{#hasEntries}}",'<ul class="entries">',"{{#entries}}",'<li class="J_Entrie entrie" data-name="{{name}}" data-type="entrie">','<p class="entrie-name">{{name}}</p>','<p class="entrie-desc">{{desc}}</p>',"</li>","{{/entries}}","</ul>","{{/hasEntries}}","{{#hasSubcat}}",'<ul class="subcats">',"{{#subcat}}",'<li class="subcat">','<p class="J_Subcat subcat-name" data-name="{{name}}" data-type="subcat">{{name}}</p>','<ul class="entries">',"{{#entries}}",'<li class="J_Entrie entrie" data-name="{{name}}" data-type="entrie">','<p class="entrie-name">{{name}}</p>','<p class="entrie-desc">{{desc}}</p>',"</li>","{{/entries}}","</ul>","</li>","{{/subcat}}","</ul>","{{/hasSubcat}}","{{#hasSubcls}}",'<ul class="entries">',"{{#subcls}}",'<li class="J_Entrie entrie" data-name="{{name}}" data-type="entrie">','<p class="entrie-name">{{name}}</p>','<p class="entrie-desc">{{desc}}</p>',"</li>","{{/subcls}}","</ul>","{{/hasSubcls}}","</li>","{{/subcls}}","</ul>","{{/api}}"],e.each(t.subcls,function(e){e.subcat?e.hasSubcat=!0:"",e.subcls?e.hasSubcls=!0:"",e.entries?e.hasEntries=!0:""}),i=new a(s.join("")).render({api:t}),r.modulesBd.html(i)},o.prototype.getApi=function(t){var s=this,i=r(t.currentTarget),a=i.attr("data-api-mod");i.addClass("current").siblings().removeClass("current"),e.use(a,function(e,t){s.render(t)})},o.prototype.toggle=function(e){var t=this,s=r(e.currentTarget),i=s.attr("data-name"),a=s.attr("data-type");switch(a){case"module":var o=t._get("module"),l=t._get("moduleEl"),d=t._get("subcatEl"),c=t._get("entrieEl");o!==i&&(l&&l.siblings().slideUp(.2)&&t.toggleIcon(l,!1),d&&d.siblings().slideUp(.2),c&&c.removeClass("current"),t._set("module",i),t._set("subcat",null),t._set("entrie",null),t._set("moduleEl",s),t._set("subcatEl",null),t._set("entrieEl",null),s.siblings().slideUp(.2)),t.toggleIcon(s),s.siblings().slideToggle(.2);break;case"subcat":var u=t._get("subcat"),d=t._get("subcatEl"),c=t._get("entrieEl");u!==i&&(d&&d.siblings().slideUp(.2),c&&c.removeClass("current"),t._set("subcat",i),t._set("entrie",null),t._set("subcatEl",s),t._set("entrieEl",null)),s.siblings().slideToggle(.2);break;case"entrie":r(".J_Entrie",t.modulesBd).removeClass("current"),s.addClass("current"),t._set("entrie",i),t._set("entrieEl",s)}n.render()},o.prototype.toggleIcon=function(e,t){var s=e.one("i"),i="icon-caret-right",a="icon-caret-down";void 0===t?t=!0:"",s.hasClass(i)&&t?s.addClass(a).removeClass(i):s.addClass(i).removeClass(a)},o},{requires:["demo/base","demo/list","node","xtemplate"]});