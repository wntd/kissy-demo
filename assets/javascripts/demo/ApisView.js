/**
 * @fileOverview ApisView
 * @author 莫争 <gaoli.gl@taobao.com>
 * @version 1.0
 */

KISSY.add('demo/ApisView', function(S, MVC, ApiView) {

  var $ = S.all;

  var TPL_APIS = [
    '<div class="tab">',
      '<a href="#!/api/core" class="J_Tab" title="核心模块集">core</a>',
      '<a href="#!/api/components" class="J_Tab" title="扩展模块集">components</a>',
    '</div>',
    '<div id="J_Api" class="api"></div>'
  ];

  /**
   * ApisView
   */
  var ApisView = function() {
    var self = this;

    ApisView.superclass.constructor.apply(this, arguments);
    self.$el    = self.get('el');
    self.models = self.get('models');
    self.models.on('afterModelsChange', function(e) {
      S.each(e.target.get('models'), function(model) {
        model.validate();
        $('#J_Api').append(new ApiView({model: model}).render());
      });
    });
  };

  S.extend(ApisView, MVC.View, {
    render: function() {
      var self = this;

      self.$el.html(TPL_APIS.join(''));
      self.reset();

      $(window).on('resize', function() {
        self.reset();
      });

      return self;
    },

    /**
     * 重置高度
     */
    reset : function() {
      $('#J_Api').css('height', $(window).height() - 144);
    },

    /**
     * TAB切换
     * @param {Number} index
     */
    switch: function(index) {
      var self = this,
        $el  = self.get('el');

      $el.all('a.J_Tab')
        .item(index).addClass('current')
        .siblings().removeClass('current');

      $el.all('ul.J_Modules')
        .item(index).show()
        .siblings().hide();
    }
  }, {
    ATTRS: {
      el: {
        value: '#J_SidebarBd'
      }
    }
  });

  return ApisView;

}, {

  requires: ['mvc', 'demo/ApiView']

});