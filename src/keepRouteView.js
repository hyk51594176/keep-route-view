
import core from './core'
export default {
  functional: true,
  name: 'KeepRouteView',
  props: {
    include: [String, Array, RegExp],
    exclude: [String, Array, RegExp],
    max: {
      type: Number,
      default: 10
    }
  },
  render (h, context) {
    core.bindVm(context)
    const include = [...core.includeList, ...(context.props.include || [])]
    return h('keep-alive', {
      props: {
        ...context.props,
        include
      }
    }, [h('router-view', context.data, context.children)])
  }
}
