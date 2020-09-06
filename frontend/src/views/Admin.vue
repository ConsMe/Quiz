<template>
  <div class=" overflow-hidden">
    <nav class="navbar navbar-light navbar-expand-md">
      <div class="container">
        <a class="navbar-brand" href="#">Quiz</a>
        <button data-toggle="collapse" data-target="#navcol-1" class="navbar-toggler">
          <span class="sr-only">Toggle navigation</span>
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navcol-1">
          <ul class="nav navbar-nav ml-auto">
            <li
              role="presentation"
              class="nav-item"
              v-for="(nav, i) in navs"
              :key="i">
              <router-link
                class="nav-link"
                :class="{ active: $route.name === nav.name }"
                :to="{ name: nav.name }">
                {{ nav.label }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <main><router-view /></main>
    <footer></footer>
  </div>
</template>

<script>
import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

library.add(faTimes);
Vue.component('font-awesome-icon', FontAwesomeIcon);

export default {
  data() {
    return {
      navs: [
        { name: 'quiz-constructor', label: 'Квиз' },
        { name: 'answers-constructor', label: 'Ответы' },
      ],
    };
  },
};
</script>

<style lang="scss">
html {
  font-size: 16px;
}
body {
  font-family: "PT Serif", serif;
  line-height: 1.6rem;
  min-height: 100vh;
}
#app {
  min-height: 100vh;
}
</style>
