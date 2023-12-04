import { createApp } from 'vue'
import App from './App.vue'
import Home from './router/Home.vue'

// DO NOT USED UNTIL FURTHER NOTICE
// // 1. Define route components.

// // 2. Define some routes
// // Each route should map to a component.
// // We'll talk about nested routes later.
// const routes = [
//   { path: '/', name: "Home", component: Home },
//   { path: '/search', name: "Search", component: App },
// ]

// // 3. Create the router instance and pass the `routes` option
// // You can pass in additional options here, but let's
// // keep it simple for now.
// const router = VueRouter.createRouter({
//   // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
//   history: VueRouter.createWebHashHistory(),
//   routes, // short for `routes: routes`
// })

// // 5. Create and mount the root instance.
// const app = Vue.createApp({})
// // Make sure to _use_ the router instance to make the
// // whole app router-aware.
// app.use(router)

// app.mount('#app')

createApp(App).mount('#app');
