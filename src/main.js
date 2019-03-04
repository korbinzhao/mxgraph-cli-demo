import 'vuetify/dist/vuetify.min.css';
import '@/style/mxgraph.css';
import '@/style/style.css';

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// 引入组件库及其组件库样式
import Vuetify from 'vuetify';

Vue.use(Vuetify);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
