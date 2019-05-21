var vueBus = {}

vueBus.install = function (Vue) {
  var version = Number(Vue.version.split('.')[0])
  if (version < 2) return // check Vue version

  var bus = new Vue()

  Object.defineProperty(Vue.prototype, '$bus', { // for "this.$bus"
    get: function () { return bus },
    set: function (evt) { // alt way to send an event (this.$bus=['event_name',arg1,arg2])
      if (typeof evt === 'string') evt = [evt]
      bus.$emit.apply(bus, evt)
    }
  })
}

// if module
// if (typeof exports === 'object') { module.exports = vueBus; return }
// if (typeof define === 'function' && define.amd) { define([], function () { return vueBus }); return }

// if direct include
if (typeof window !== 'undefined' && window.Vue) {
  window.VueBus = vueBus
  window.Vue.use(vueBus) // auto-activation
}

export default vueBus
