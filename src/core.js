
class Core {
  constructor(){
    this.contextMap = new Map()
    this.includeList = new Set()
    this.unWatch = null
    this.router = null
    this.direction = null
  }
 
  bindVm (context) {
    if (!this.router) {
      if (!context.parent.$router) throw new Error('请在使用该组件前安装vueRouter')
      this.router = context.parent.$router
      window.addEventListener('popstate', this.directionChange.bind(this, 'back'))
      this.init()
    }
    if (!this.contextMap.has(context.parent)) {
      this.contextMap.set(context.parent, context)
      context.parent.$on('hook:beforeDestroy', this.unBindVm.bind(this, context))
    }
  }
  init () {
    ;['push', 'replace', 'back'].forEach(key => {
      let _method = this.router[key].bind(this.router)
      this.router[key] = (...args) => {
        this.directionChange(key)
        _method(...args)
      }
    })
    this.unWatch = this.router.afterEach((to, from) => {
      if (this.direction === 'back' || this.direction === 'replace') {
        from.matched.forEach(route => {
          const name = route.components.default.name
          if (this.includeList.has(name)) this.includeList.delete(name)
        })
      } else {
        to.matched.forEach(route => {
          const component = route.components.default
          if (component.name && !component.noKeep && !this.includeList.has(component.name)) {
            this.includeList.add(component.name)
          }
        })
      }
      this.includeChange()
    })
  }
  unBindVm (context) {
    this.contextMap.delete(context)
    if (this.contextMap.size === 0) {
      this.unWatch()
      this.router = null
      this.direction = ''
      window.removeEventListener('popstate', this.updateDirection.bind(this))
    }
  }
  directionChange (key) {
    this.direction = key
    this.contextMap.forEach(context => {
      context.listeners.change && context.listeners.change(key)
    })
  }
  includeChange () {
    this.contextMap.forEach(context => {
      context.listeners.includeChange && context.listeners.includeChange([...(context.props.include || []), ...this.includeList])
    })
  }
}
export default new Core()
