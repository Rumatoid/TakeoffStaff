<template>
  <div id="app">
    <Start />
  </div>
</template>

<script>
import Start from "./components/Start.vue";

import store from "./resources/js/store";

export default {
  name: "App",
  components: {
    Start
  },
  store //Connect store
};
</script>

<style lang="scss">
html {
  overflow-y: auto;
}
body {
  margin: 0;
}
</style>
