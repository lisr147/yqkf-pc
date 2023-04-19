import Vue from 'vue'
import Store from '@/store'

//可匹配手机号码、固定电话
const reg = new RegExp(/(1[0-9][0-9]\d{6,10})|(\d{3}-\d{7,8}|\d{4}-\d{7,8})/g)

Vue.directive('cellphone', {

  bind: function (el, binding, vnode) {

    const text = el.innerHTML

    if (!reg.test(text)) {
      return
    }
    el.innerHTML = text.replace(reg, function (val) {
      return `<span tel="${val}" class="outcall-phone">${val}</span>`
    })

    el.onclick = function(e){
      const tel = e.target.getAttribute('tel')
      if (tel) {
        Store.commit('common/SET_CUR_CALL_NUMBER', tel)
      }
    }

  }
})
