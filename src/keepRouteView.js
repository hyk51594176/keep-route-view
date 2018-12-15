
import core from './core'
export default {
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
  data () {
    return {
      direction: '',
      routes: []
    }
  },
  watch: {
    direction (val) {
      this.$emit('change', val)
    }
  },
  created () {
    if (!this.$router) throw new Error('请在使用该组件前安装vueRouter')
    const unBindVm = core.bindVm(this)
    this.$once('hook:beforeDestroy', unBindVm)
  },
  computed: {
    defaultInclude () {
      if (this.include) return this.routes.concat(this.include)
      return this.routes
    }
  },
  render (h) {
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
    }), ...(this.$slots.default || [])])
  }
}
