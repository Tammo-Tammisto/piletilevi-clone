import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router';

import Home from './pages/Home.vue';
import Tickets from './pages/Tickets.vue';

const routes = [
    { path: '/', component: Home, name: 'Home' },
    { path: '/tickets/:genre', component: Tickets, name: 'Tickets', props: true },

];

const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHistory(),
    routes, // short for `routes: routes`
});

const app = createApp(App);

app.use(router);

app.mount('#app');

export default router;