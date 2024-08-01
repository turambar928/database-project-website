<template>
  <div class="app">
    <AppBar :selectedMenu="selectedMenu" @menu-selected="handleMenuSelected"/>
    <div class="main">
      <MySidebar @menu-selected="handleMenuSelected" />
      <div class="content-wrapper">
        <MyContent v-if="selectedMenu === '公告管理'" />
        <UserList v-if="selectedMenu === '普通用户列表'" />
        <DishList v-if="selectedMenu ==='菜品列表'"/>
        <WeeklyMenu v-if="selectedMenu ==='每周菜单'"/>
        <WeeklyPromotion v-if="selectedMenu ==='每周促销'"/>
        <EmployeeManagement v-if="selectedMenu ==='职工管理'"/>
        <VerifyVolunteer v-if="selectedMenu ==='审核志愿者申请'"/>
        <VolunteerManagement v-if="selectedMenu ==='上任志愿者管理'"/>
        <UserStatistic v-if="selectedMenu ==='用户统计'"/>
        <VolunteerStatistic v-if="selectedMenu ==='志愿者统计'"/>
        <OrdersStatistic v-if="selectedMenu ==='订单统计'"/>
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
import DishList from "./components/DishList.vue";
import WeeklyMenu from "./components/WeeklyMenu.vue";
import WeeklyPromotion from './components/WeeklyPromotion.vue';
import EmployeeManagement from './components/EmployeeManagement.vue';
import VerifyVolunteer from "./components/VerifyVolunteer.vue";
import VolunteerManagement from "./components/VolunteerManagement.vue";
import UserStatistic from './components/UserStatistic.vue';
import VolunteerStatistic from './components/VolunteerStatistic.vue';
import OrdersStatistic from './components/OrdersStatistic.vue';

export default {
  name: "App",
  components: {
    AppBar,
    MySidebar,
    MyContent,
    UserProfile,
    SecondComponent,
    UserList,
    DishList,
    WeeklyMenu,
    WeeklyPromotion,
    EmployeeManagement,
    VerifyVolunteer,
    VolunteerManagement,
    UserStatistic,
    VolunteerStatistic,
    OrdersStatistic,
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
/**/
</style>





