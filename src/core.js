
class Core {
  constructor () {
    this.vmList = []
    this.direction = ''
    this.routes = []
    this.unWatch = null
  }
  bindVm (vm) {
    if (this.vmList.length) {
      this.vmList.push(vm)
    } else {
      this.vmList.push(vm)
      window.addEventListener('popstate', this.updateDirection.bind(this))
      this.init(vm)
    }
    return this.unBindVm.bind(this, this.vmList.length - 1)
  }
  init (vm) {
    ;['push', 'replace', 'back'].forEach(key => {
      let _method = vm.$router[key].bind(vm.$router)
      vm.$router[key] = (...args) => {
        this.direction = key
        this.setVmData('direction')
        _method(...args)
      }
    })
    this.unWatch = vm.$router.afterEach((to, from) => {
      if (this.direction === 'back' || this.direction === 'replace') {
        from.matched.forEach(route => {
          const index = this.routes.lastIndexOf(route.components.default.name)
          index > -1 && this.routes.splice(index, 1)
        })
      } else {
        to.matched.forEach(route => {
          const component = route.components.default
          if (component.name && !component.noKeep && this.routes.indexOf(component.name) < 0) {
            this.routes.push(component.name)
          }
        })
      }
      this.setVmData('routes')
    })
  }
  unBindVm (index) {
    this.vmList.splice(index, 1)
    if (!this.vmList.length) {
      this.unWatch()
      window.removeEventListener('popstate', this.updateDirection.bind(this))
    }
  }
  updateDirection () {
    this.direction = 'back'
    this.setVmData('direction')
  }
  setVmData (type) {
    this.vmList.forEach(vm => {
      vm[type] = this[type]
    })
  }
}
export default new Core()
