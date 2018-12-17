
class Core {
  static contextMap = new Map()
  static includeList = new Set()
  static unWatch = null
  static router = null
 
  static bindVm (context) {
    if (!Core.router) {
      if (!context.parent.$router) throw new Error('请在使用该组件前安装vueRouter')
      Core.router = context.parent.$router
      window.addEventListener('popstate', Core.directionChange.bind(Core, 'back'))
      Core.init()
    }
    if (!Core.contextMap.has(context.parent)) {
      Core.contextMap.set(context.parent, context)
      context.parent.$on('hook:beforeDestroy', Core.unBindVm.bind(Core, context))
    }
  }
  static init () {
    ;['push', 'replace', 'back'].forEach(key => {
      let _method = Core.router[key].bind(Core.router)
      Core.router[key] = (...args) => {
        Core.directionChange(key)
        _method(...args)
      }
    })
    Core.unWatch = Core.router.afterEach((to, from) => {
      if (Core.direction === 'back' || Core.direction === 'replace') {
        from.matched.forEach(route => {
          const name = route.components.default.name
          if (Core.includeList.has(name)) Core.includeList.delete(name)
        })
      } else {
        to.matched.forEach(route => {
          const component = route.components.default
          if (component.name && !component.noKeep && !Core.includeList.has(component.name)) {
            Core.includeList.add(component.name)
          }
        })
      }
      Core.includeChange()
    })
  }
  static unBindVm (context) {
    Core.contextMap.delete(context)
    if (Core.contextMap.size === 0) {
      Core.unWatch()
      Core.router = null
      Core.direction = ''
      window.removeEventListener('popstate', Core.updateDirection.bind(Core))
    }
  }
  static directionChange (key) {
    Core.direction = key
    Core.contextMap.forEach(context => {
      context.listeners.change && context.listeners.change(key)
    })
  }
  static includeChange () {
    Core.contextMap.forEach(context => {
      context.listeners.includeChange && context.listeners.includeChange([...(context.props.include || []), ...Core.includeList])
    })
  }
}
export default Core
