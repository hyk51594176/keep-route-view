import KeepRouteView from './keepRouteView'
export default function install (Vue) {
  if (install.Installed) return
  Vue.component(KeepRouteView.name, KeepRouteView)
  install.Installed = true
}
