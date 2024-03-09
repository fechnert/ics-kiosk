import './assets/main.css'

import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import App from './App.vue'
import EventKiosk from './components/EventKiosk.vue'
import CalendarEditor from './components/CalendarEditor.vue'
import CalendarLoader from './components/CalendarLoader.vue'

const routes = [
  {path: "/", component: EventKiosk, name: "calendar"},
  {path: "/conf", component: CalendarEditor, name: "conf"},
  {path: "/load/:data", component: CalendarLoader, name: "load"},
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
})

const app = createApp(App)

app.use(router);
app.mount('#app');
