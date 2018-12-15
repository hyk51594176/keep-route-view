/*!
 * KeepRouteView.js v1.0.0
 * https://github.com/hyk51594176/keep-route-view
 *
 * Copyright 2018-present 51594176@qq.com
 * Released under the MIT license
 *
 * Date: 2018-12-15T21:13:31.883Z
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.KeepRouteView = factory());
}(this, (function () { 'use strict';

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  var Core = function () {
    function Core() {
      classCallCheck(this, Core);

      this.vmList = [];
      this.direction = '';
      this.routes = [];
      this.unWatch = null;
    }

    createClass(Core, [{
      key: 'bindVm',
      value: function bindVm(vm) {
        if (this.vmList.length) {
          this.vmList.push(vm);
        } else {
          this.vmList.push(vm);
          window.addEventListener('popstate', this.updateDirection.bind(this));
          this.init(vm);
        }
        return this.unBindVm.bind(this, this.vmList.length - 1);
      }
    }, {
      key: 'init',
      value: function init(vm) {
        var _this = this;
  ['push', 'replace', 'back'].forEach(function (key) {
          var _method = vm.$router[key].bind(vm.$router);
          vm.$router[key] = function () {
            _this.direction = key;
            _this.setVmData('direction');
            _method.apply(undefined, arguments);
          };
        });
        this.unWatch = vm.$router.afterEach(function (to, from) {
          if (_this.direction === 'back' || _this.direction === 'replace') {
            from.matched.forEach(function (route) {
              var index = _this.routes.lastIndexOf(route.components.default.name);
              index > -1 && _this.routes.splice(index, 1);
            });
          } else {
            to.matched.forEach(function (route) {
              var component = route.components.default;
              if (component.name && !component.noKeep && !_this.routes.includes(component.name)) {
                _this.routes.push(component.name);
              }
            });
          }
          _this.setVmData('routes');
        });
      }
    }, {
      key: 'unBindVm',
      value: function unBindVm(index) {
        this.vmList.splice(index, 1);
        if (!this.vmList.length) {
          this.unWatch();
          window.removeEventListener('popstate', this.updateDirection.bind(this));
        }
      }
    }, {
      key: 'updateDirection',
      value: function updateDirection() {
        this.direction = 'back';
        this.setVmData('direction');
      }
    }, {
      key: 'setVmData',
      value: function setVmData(type) {
        var _this2 = this;

        this.vmList.forEach(function (vm) {
          vm[type] = _this2[type];
        });
      }
    }]);
    return Core;
  }();

  var core = new Core();

  var KeepRouteView = {
    name: 'KeepRouteView',
    props: {
      include: [String, Array, RegExp],
      exclude: [String, Array, RegExp],
      max: {
        type: Number,
        default: 10
      },
      name: [String]
    },
    data: function data() {
      return {
        direction: '',
        routes: []
      };
    },

    watch: {
      direction: function direction(val) {
        this.$emit('change', val);
      }
    },
    created: function created() {
      if (!this.$router) throw new Error('请在使用该组件前安装vueRouter');
      var unBindVm = core.bindVm(this);
      this.$once('hook:beforeDestroy', unBindVm);
    },

    computed: {
      defaultInclude: function defaultInclude() {
        if (this.include) return this.routes.concat(this.include);
        return this.routes;
      }
    },
    render: function render(h) {
      return h('keep-alive', {
        props: {
          include: this.defaultInclude,
          exclude: this.exclude,
          max: this.max
        }
      }, [h('router-view', {
        props: {
          name: this.name
        }
      })].concat(toConsumableArray(this.$slots.default || [])));
    }
  };

  function install(Vue) {
    if (install.Installed) return;
    Vue.component(KeepRouteView.name, KeepRouteView);
    install.Installed = true;
  }

  return install;

})));
