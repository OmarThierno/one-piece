import { createRouter, createWebHistory } from "vue-router"

import HomePage from "./pages/HomePage.vue"
import PostNewCharacter from "./pages/PostNewCharacter.vue"

export const router = createRouter ({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage
    },
    {
      path: "/newCharacter",
      name: "newCharacter",
      component: PostNewCharacter
    },
  ]
})