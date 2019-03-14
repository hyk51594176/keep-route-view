
import core from './core'
import './transition.css'
export default {
  functional: true,
  name: 'KeepRouteView',
  props: {
    include: [String, Array, RegExp],
    exclude: [String, Array, RegExp],
    max: {
      type: Number,
      default: 20
    },
    transition: Boolean,
    transitionOptions: {
      type: Object,
      default: () => ({})
    }
  },
  render (h, context) {
    const { include, transition, transitionOptions } = context.props
    core.bindVm(context)
    const includeMerge = [...core.includeList, ...(include || [])]
    const vnode = h('keep-alive', {
      props: {
        ...context.props,
        include: includeMerge
      }
    }, [h('router-view', context.data, context.children)])
    if (!transition) return vnode
    const name = core.direction === 'back' ? 'pop-out' : 'pop-in'
    return h('transition', {
      props: {
        name: name,
        ...(transitionOptions || {})
      },
      on: context.listeners
    }, [vnode])
  }
}
