import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue'; // Import your App component
import About from '../views/About.vue'; // Import the about.vue component

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/About',
    name: 'About',
    component: About, // Add the route for the about.vue component
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
