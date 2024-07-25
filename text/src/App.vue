<template>
  <div class="app">
    <AppBar :selectedMenu="selectedMenu" @menu-selected="handleMenuSelected"/>
    <div class="main">
      <MySidebar @menu-selected="handleMenuSelected" />
      <div class="content-wrapper">
        <MyContent v-if="selectedMenu === '公告管理'" />
        <UserList v-if="selectedMenu === '普通用户列表'" />
        <div class="overlay" v-if="isUserProfileVisible">
          <UserProfile />
          <SecondComponent />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppBar from "./components/AppBar.vue";
import MySidebar from "./components/MySidebar.vue";
import MyContent from "./components/MyContent.vue";
import UserProfile from "./components/UserProfile.vue";
import SecondComponent from "./components/SecondComponent.vue";
import UserList from "./components/UserList.vue";

export default {
  name: "App",
  components: {
    AppBar,
    MySidebar,
    MyContent,
    UserProfile,
    SecondComponent,
    UserList
  },
  data() {
    return {
      selectedMenu: '公告管理',
      isUserProfileVisible: false
    };
  },
  methods: {
    handleMenuSelected(menuName) {
      this.selectedMenu = menuName;
      this.isUserProfileVisible = (menuName === '我');
    }
  }
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
  position: relative; /* 允许绝对定位 */
}

.overlay {
  display: flex;
  gap: 20px; /* 在两个组件之间增加间距 */
  position: relative;
  width: 100%;
  height: 100%;
}

.user-profile {
  flex-shrink: 0; /* 保持组件大小不变 */
  position: relative;
  top: 20px;
  left: 20px;
  z-index: 10; /* 确保它位于第二个组件之上 */
}

.second-component {
  flex-grow: 1; /* 使组件占满右侧白色空间 */
  margin-left: 50px; /* 增加左边距，确保两个组件之间有距离 */
  position: relative;
  top: 20px;
  right: 20px;
  bottom: 20px;
  overflow-y: auto;
  scrollbar-width: none; /* 隐藏滚动条 Firefox */
}

.second-component::-webkit-scrollbar {
  display: none; /* 隐藏滚动条 Chrome */
}
</style>
