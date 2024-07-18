<template>
  <div class="app">
    <AppBar />
    <MySidebar />
    <div class="content-wrapper">
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
  height: 100vh;
  flex-direction: column;
}
.main {
  display: flex;
  flex: 1;
}
.content-wrapper {
  flex: 1;
  margin-top: 56px; /* 确保内容区域在AppBar下方 */
  margin-left: 200px; /* 确保内容区域在侧边栏右侧 */
  padding: 20px;
  overflow-y: auto; /* 当内容过多时滚动 */
}
</style>
