<template>
  <div class="app">
    <AppBar />
    <div class="main">
      <MySidebar />
      <MyContent />
    </div>
  </div>
</template>

<script>
import AppBar from "./components/AppBar.vue";
import MySidebar from "./components/MySidebar.vue";
import MyContent from "./components/MyContent.vue";

export default {
  name: "App",
  components: {
    AppBar,
    MySidebar,
    MyContent,
  },
};
</script>

<style>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main {
  display: flex;
  flex: 1;
}
</style>
