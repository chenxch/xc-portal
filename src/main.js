import Vue from 'vue'
import App from './App.vue'
// import { initGlobalState } from 'qiankun';
import store from './store'
import { initGlobalState } from 'qiankun';
// 初始化 state
const state = {xc:123};
const actions = initGlobalState(state);
actions.onGlobalStateChange((state, prev) => {
  // state: 变更后的状态; prev 变更前的状态
  console.log(state, prev);
});
actions.setGlobalState(state);
actions.offGlobalStateChange();
Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
