import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router/router';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.use(autoAnimatePlugin);
app.mount('#app');
