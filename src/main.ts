import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'


import {library} from '@fortawesome/fontawesome-svg-core';
import {fas} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

library.add(fas);

Vue.component('vue-fontawesome', FontAwesomeIcon);

Vue.config.productionTip = false
Vue.use(Buefy, {
    defaultIconComponent: 'vue-fontawesome',
    defaultIconPack: 'fas',
})

new Vue({
    render: h => h(App),
}).$mount('#app')
