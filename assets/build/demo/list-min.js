KISSY.add("demo/list",function(e,t,i,s,o,d){var n=e.all,r=new i,a=function(){this.el=n("#J_List"),this.elHd=n("#J_ListHd h1"),this.elBd=n("#J_ListBd"),this.events={"click #J_ListHd #J_Add":"addDemo","click #J_ListBd a":"getDemo"},this.init()};return e.extend(a,t),a.prototype.init=function(){a.superclass.constructor.call(this)},a.prototype.render=function(){var e,t=this;e=["<ul>","{{#demo}}",'<li class="demo">','<div class="demo-bd"></div>','<div class="demo-ft">','<a href="javascript:;" data-id="{{id}}">',"{{intro}}","</a>","</div>","</li>","{{/demo}}","</ul>"].join(""),o.post("./act/list.php",{module:t._makeQueryId()},function(i){var s=new d(e).render({demo:i.data});t.elHd.html(t._makeQueryId()+" Demo"),t.elBd.html(s)})},a.prototype.addDemo=function(){var e=this;e._render("code"),r.render()},a.prototype.getDemo=function(e){var t=this,i=n(e.currentTarget),s=i.attr("data-id");o.post("./act/detail.php",{id:s},function(e){t._set("id",s),t._render("code"),r.render(e.data)})},a},{requires:["demo/base","demo/code","node","ajax","xtemplate"]});