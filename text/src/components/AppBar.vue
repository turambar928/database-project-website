<template>
  <div class="app-bar">
    <div class="menu-button">
      &#9776; {{ selectedMenu }}
    </div>
    <div class="spacer"></div>
    <div class="user-icon" @click="$emit('menu-selected', '我')">
      <img src="/avatar.jpg" alt="头像" />
    </div>
  </div>
</template>

<script>
export default {
  name: "AppBar",
  props: {
    selectedMenu: {
      type: String,
      default: '公告管理'
    }
  }
};
</script>

<style scoped>
.app-bar {
  display: flex;
  align-items: center;
  padding: 0 16px;
  padding-left: 230px;
  height: 56px;
  background-color: #f5f5f5; /* 顶部栏背景颜色 */
  border-bottom: 1px solid #ddd;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1001; /* 确保顶部栏在所有内容之上 */
}
.menu-button {
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
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
