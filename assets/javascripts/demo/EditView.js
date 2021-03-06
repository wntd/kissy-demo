/**
 * @fileOverview EditView
 * @author 莫争 <gaoli.gl@taobao.com>
 * @version 1.0
 */

KISSY.add('demo/EditView', function(S, MVC, XTemplate, TipsModel, TipsView) {

  var $ = S.all;

  var TPL_INFO = new XTemplate([
    '{{#demo}}',
      '<div class="info-hd">',
        '<h2>{{module}}</h2>',
      '</div>',
      '<div class="info-bd">',
        '<ul>',
          '<li>',
          '<input id="J_Author" class="txt" value="{{author}}" placeholder="作者">',
            '<label class="icon-user" for="J_Author"></label>',
          '</li>',
          '<li>',
          '<input id="J_Intro" class="txt" value="{{intro}}" placeholder="描述">',
            '<label class="icon-edit" for="J_Intro"></label>',
          '</li>',
        '</ul>',
      '</div>',
    '{{/demo}}'
  ].join(''));

  var TPL_CODE = new XTemplate([
    '<!DOCTYPE html>\r\n',
    '<html>\r\n',
      '<head>\r\n',
        '<meta charset="utf-8" />\r\n',
        '<title>{{module}}</title>\r\n',
        '<style>\r\n',
          '{{{css}}}\r\n',
        '</style>\r\n',
      '</head>\r\n',
      '<body>\r\n',
        '{{{html}}}\r\n',
        '<script src="http://a.tbcdn.cn/s/kissy/1.3.0/seed-min.js" data-config="{combine:true}"></script>\r\n',
        '<script>\r\n',
          'try {\r\n',
            '{{{js}}}\r\n',
          '} catch(e) {\r\n',
          '}\r\n',
        '</script>\r\n',
      '</body>\r\n',
    '</html>'
  ].join(''));

  /**
   * EditView
   */
  var EditView = function() {
    var self = this;

    EditView.superclass.constructor.apply(this, arguments);

    self.$el       = self.get('el');
    self.model     = self.get('model');
    self.tipsModel = new TipsModel();
    self.tipsView  = new TipsView({model: self.tipsModel});
    self.$info     = $('#J_Info');
    self.$code     = $('#J_Code');
    self.$codeHd   = $('#J_CodeHd');
    self.$codeBd   = $('#J_CodeBd');
    self.iframe    = $('#J_PreviewIframe')[0].contentWindow.document;

    self.createEditor();

    // 默认开启代码调试
    self.set('debug', true);

    self.model.on('*Change', function() {
      var demo = self.model.toJSON();

      self.$info.html(TPL_INFO.render({demo: demo}));
      self.setEditorVal(demo);
    });
  };

  S.extend(EditView, MVC.View, {
    render: function() {
      var self = this;

      self.reset();

      $(window).on('resize', function() {
        self.reset();
      });
    },

    /**
     * 重置高度
     */
    reset : function() {
      var self = this;

      self.$codeBd.css('height', $(window).height() - 121);
    },

    /**
     * 创建编辑器
     */
    createEditor: function() {
      var self = this;

      /**
       * 创建 ace 编辑器
       * @param {Object} editor
       * @param {String} mode
       */
      var aceEditor = function(editor, mode) {
        var editor = ace.edit(editor[0]);

        editor.setTheme("ace/theme/dreamweaver");
        editor.getSession().setMode("ace/mode/" + mode);
        editor.on('change', function() {
          self.get('debug') && self.setDebugCode();
        });

        return editor;
      };

      self.Html = aceEditor($('#J_Html'), 'html');
      self.Css  = aceEditor($('#J_Css'), 'css');
      self.Js   = aceEditor($('#J_Js'), 'javascript');
    },

    /**
     * 编辑器取值
     * @return {Object}
     */
    getEditorVal: function() {
      var self = this;

      return {
        html: self.Html.getValue(),
        css : self.Css.getValue(),
        js  : self.Js.getValue()
      };
    },

    /**
     * 编辑器设值
     * @param {Object} demo
     */
    setEditorVal: function(demo) {
      var self = this;

      /**
       * 设置默认值
       */
      if (!demo) {
        var demo = {};
        demo.html = '<!-- HTML -->\r\n<!-- 所填内容直接添入 BODY 标签 -->\r\n';
        demo.css  = '/* CSS */\r\n';
        demo.js   = '/* JavaScript */\r\n/* Kissy 1.3 已默认加载 */\r\n';
      }

      self.Html.setValue(demo.html);
      self.Html.focus();
      self.Html.clearSelection();

      self.Css.setValue(demo.css);
      self.Css.focus();
      self.Css.clearSelection();

      self.Js.setValue(demo.js);
      self.Js.focus();
      self.Js.clearSelection();
    },

    /**
     * 获取调试代码
     * @param  {Object} data
     * @return {String}
     */
    getDebugCode: function(data) {
      return TPL_CODE.render(data);
    },

    /**
     * 设置调试代码
     */
    setDebugCode: function() {
      var self = this,
          code = self.getDebugCode(self.getEditorVal());

      self.iframe.open();
      self.iframe.write(code);
      self.iframe.close();
    },

    /**
     * 获取模型数据
     * @return {Object}
     */
    getDemoModel: function() {
      var self = this;

      return S.merge(self.getEditorVal(), {
        author: $('#J_Author').val(),
        intro : $('#J_Intro').val()
      });
    },

    /**
     * 提交 / 更新代码
     */
    save: function() {
      var self = this;

      self.model.set(self.getDemoModel(), {
        silent: true
      });

      self.model.save({
        success: function(data) {
          self.tipsModel.set({
            status : data.status,
            message: data.message
          });
          self.tipsView.render();
        }
      });
    },

    /**
     * 调试开关控制
     */
    debugHandler: function(e) {
      var self = this,
          target = $(e.currentTarget),
          $icon  = target.one('i');

      var checkIconClass = 'icon-check',
          emptyIconClass = 'icon-check-empty';

      if (self.get('debug')) {

        $icon.removeClass(checkIconClass)
             .addClass(emptyIconClass);

        self.set('debug', false);

      } else {

        $icon.removeClass(emptyIconClass)
             .addClass(checkIconClass);

        self.set('debug', true);

        // 开启时默认执行一次代码调试
        self.setDebugCode();

      }
    },

    /**
     * 标签显示控制
     */
    labelHandler: function(e) {
      var type   = e.type,
          target = $(e.currentTarget),
          $label = $('.J_EditorLabel', target);

      type === 'mouseenter' && $label.show() || $label.hide();
    },

    /**
     * 窗口缩放控制
     */
    editorResize: function(e) {
      var self   = this,
          target = $(e.currentTarget),
          $icon  = target.one('i'),
          editor = $icon.attr('data-editor'),
          screen = $icon.attr('data-screen');

      var $editor       = $('#J_' + editor),
          $editorWrap   = $editor.parent(),
          $editorColumn = $editorWrap.parent();

      var fullIconClass  = 'icon-fullscreen',
          smallIconClass = 'icon-resize-small';

      if (screen === 'small') {

        self.$code.addClass('full-screen');

        $icon.attr('data-screen', 'full')
             .removeClass(fullIconClass)
             .addClass(smallIconClass);

        $editorWrap.css('height', '100%')
                   .siblings().hide();

        $editorColumn.css('width', '100%')
                     .siblings().hide();

      } else {

        self.$code.removeClass('full-screen');

        $icon.attr('data-screen', 'small')
             .removeClass(smallIconClass)
             .addClass(fullIconClass);

        $editorWrap.css('height', '50%')
                   .siblings().show();

        $editorColumn.css('width', '50%')
                     .siblings().show();

      }

      self[editor] && self[editor].resize();
    }
  }, {
    ATTRS: {
      el    : {
        value: '#J_Edit'
      },
      events: {
        value: {
          '#J_Commit': {
            click: 'save'
          },
          '#J_Update': {
            click: 'save'
          },
          '#J_Debug': {
            click: 'debugHandler'
          },
          '.J_EditorWrap': {
            'mouseenter': 'labelHandler',
            'mouseleave': 'labelHandler'
          },
          '.J_EditorLabel': {
            'click': 'editorResize'
          }
        }
      }
    }
  });

  return EditView;

}, {

  requires: ['mvc', 'xtemplate', 'demo/TipsModel', 'demo/TipsView']

});