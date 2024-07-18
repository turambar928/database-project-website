<template>
  <div class="app-bar">
    <div class="title">公告管理</div>
    <div class="spacer"></div>
    <div class="user-icon">
      <img src="/avatar.jpg" alt="头像" />
    </div>
  </div>
</template>

<script>
export default {
  name: "AppBar",
};
</script>

<style scoped>
.app-bar {
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 56px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}
.title {
  font-size: 18px;
  font-weight: bold;
}
.spacer {
  flex: 1;
}
.user-icon img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
}
</style>
