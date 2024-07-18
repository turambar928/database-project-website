<template>
  <div class="sidebar">
    <ul>
      <li @click="toggleMenu('user')" :class="{ active: activeMenu === 'user' }">
        <span class="menu-text" :class="{ hover: hoverMenu === 'user' }" @mouseover="hoverMenu = 'user'" @mouseleave="hoverMenu = ''">用户管理</span>
        <span class="arrow" :class="{ open: isOpen('user') }">▼</span>
        <ul v-show="isOpen('user')" class="submenu">
          <li :class="{ active: activeMenu === 'userList' }" @click="selectMenu('userList')">
            <span class="submenu-text" :class="{ hover: hoverMenu === 'userList' }" @mouseover="hoverMenu = 'userList'" @mouseleave="hoverMenu = ''">普通用户列表</span>
          </li>
          <li :class="{ active: activeMenu === 'adminList' }" @click="selectMenu('adminList')">
            <span class="submenu-text" :class="{ hover: hoverMenu === 'adminList' }" @mouseover="hoverMenu = 'adminList'" @mouseleave="hoverMenu = ''">管理员列表</span>
          </li>
        </ul>
      </li>
      <li :class="{ active: activeMenu === 'announcement' }" @click="selectMenu('announcement')">
        <span class="menu-text" :class="{ hover: hoverMenu === 'announcement' }" @mouseover="hoverMenu = 'announcement'" @mouseleave="hoverMenu = ''">公告管理</span>
      </li>
      <li @click="toggleMenu('food')" :class="{ active: activeMenu === 'food' }">
        <span class="menu-text" :class="{ hover: hoverMenu === 'food' }" @mouseover="hoverMenu = 'food'" @mouseleave="hoverMenu = ''">菜品管理</span>
        <span class="arrow" :class="{ open: isOpen('food') }">▼</span>
        <ul v-show="isOpen('food')" class="submenu">
          <li :class="{ active: activeMenu === 'foodList' }" @click="selectMenu('foodList')">
            <span class="submenu-text" :class="{ hover: hoverMenu === 'foodList' }" @mouseover="hoverMenu = 'foodList'" @mouseleave="hoverMenu = ''">菜品列表</span>
          </li>
          <li :class="{ active: activeMenu === 'weeklyMenu' }" @click="selectMenu('weeklyMenu')">
            <span class="submenu-text" :class="{ hover: hoverMenu === 'weeklyMenu' }" @mouseover="hoverMenu = 'weeklyMenu'" @mouseleave="hoverMenu = ''">每周菜单</span>
          </li>
          <li :class="{ active: activeMenu === 'weeklyPromotion' }" @click="selectMenu('weeklyPromotion')">
            <span class="submenu-text" :class="{ hover: hoverMenu === 'weeklyPromotion' }" @mouseover="hoverMenu = 'weeklyPromotion'" @mouseleave="hoverMenu = ''">每周促销</span>
          </li>
        </ul>
      </li>
      <li :class="{ active: activeMenu === 'staff' }" @click="selectMenu('staff')">
        <span class="menu-text" :class="{ hover: hoverMenu === 'staff' }" @mouseover="hoverMenu = 'staff'" @mouseleave="hoverMenu = ''">职工管理</span>
      </li>
      <li :class="{ active: activeMenu === 'volunteer' }" @click="selectMenu('volunteer')">
        <span class="menu-text" :class="{ hover: hoverMenu === 'volunteer' }" @mouseover="hoverMenu = 'volunteer'" @mouseleave="hoverMenu = ''">志愿者管理</span>
      </li>
      <li :class="{ active: activeMenu === 'warehouse' }" @click="selectMenu('warehouse')">
        <span class="menu-text" :class="{ hover: hoverMenu === 'warehouse' }" @mouseover="hoverMenu = 'warehouse'" @mouseleave="hoverMenu = ''">仓库管理</span>
      </li>
      <li @click="toggleMenu('finance')" :class="{ active: activeMenu === 'finance' }">
        <span class="menu-text" :class="{ hover: hoverMenu === 'finance' }" @mouseover="hoverMenu = 'finance'" @mouseleave="hoverMenu = ''">财务</span>
        <span class="arrow" :class="{ open: isOpen('finance') }">▼</span>
        <ul v-show="isOpen('finance')" class="submenu">
          <li :class="{ active: activeMenu === 'financeAudit' }" @click="selectMenu('financeAudit')">
            <span class="submenu-text" :class="{ hover: hoverMenu === 'financeAudit' }" @mouseover="hoverMenu = 'financeAudit'" @mouseleave="hoverMenu = ''">财务审核</span>
          </li>
          <li :class="{ active: activeMenu === 'financeSummary' }" @click="selectMenu('financeSummary')">
            <span class="submenu-text" :class="{ hover: hoverMenu === 'financeSummary' }" @mouseover="hoverMenu = 'financeSummary'" @mouseleave="hoverMenu = ''">财务总表</span>
          </li>
        </ul>
      </li>
      <li @click="toggleMenu('statistics')" :class="{ active: activeMenu === 'statistics' }">
        <span class="menu-text" :class="{ hover: hoverMenu === 'statistics' }" @mouseover="hoverMenu = 'statistics'" @mouseleave="hoverMenu = ''">数据统计</span>
        <span class="arrow" :class="{ open: isOpen('statistics') }">▼</span>
        <ul v-show="isOpen('statistics')" class="submenu">
          <li :class="{ active: activeMenu === 'userStats' }" @click="selectMenu('userStats')">
            <span class="submenu-text" :class="{ hover: hoverMenu === 'userStats' }" @mouseover="hoverMenu = 'userStats'" @mouseleave="hoverMenu = ''">用户统计</span>
          </li>
          <li :class="{ active: activeMenu === 'volunteerStats' }" @click="selectMenu('volunteerStats')">
            <span class="submenu-text" :class="{ hover: hoverMenu === 'volunteerStats' }" @mouseover="hoverMenu = 'volunteerStats'" @mouseleave="hoverMenu = ''">志愿者统计</span>
          </li>
          <li :class="{ active: activeMenu === 'orderStats' }" @click="selectMenu('orderStats')">
            <span class="submenu-text" :class="{ hover: hoverMenu === 'orderStats' }" @mouseover="hoverMenu = 'orderStats'" @mouseleave="hoverMenu = ''">订单统计</span>
          </li>
          <li :class="{ active: activeMenu === 'financeStats' }" @click="selectMenu('financeStats')">
            <span class="submenu-text" :class="{ hover: hoverMenu === 'financeStats' }" @mouseover="hoverMenu = 'financeStats'" @mouseleave="hoverMenu = ''">财务统计</span>
          </li>
          <li :class="{ active: activeMenu === 'systemLogs' }" @click="selectMenu('systemLogs')">
            <span class="submenu-text" :class="{ hover: hoverMenu === 'systemLogs' }" @mouseover="hoverMenu = 'systemLogs'" @mouseleave="hoverMenu = ''">系统日志</span>
          </li>
        </ul>
      </li>
      <li @click="toggleMenu('settings')" :class="{ active: activeMenu === 'settings' }">
        <span class="menu-text" :class="{ hover: hoverMenu === 'settings' }" @mouseover="hoverMenu = 'settings'" @mouseleave="hoverMenu = ''">系统设置</span>
        <span class="arrow" :class="{ open: isOpen('settings') }">▼</span>
        <ul v-show="isOpen('settings')" class="submenu">
          <li :class="{ active: activeMenu === 'canteenInfo' }" @click="selectMenu('canteenInfo')">
            <span class="submenu-text" :class="{ hover: hoverMenu === 'canteenInfo' }" @mouseover="hoverMenu = 'canteenInfo'" @mouseleave="hoverMenu = ''">食堂信息</span>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "MySidebar",
  data() {
    return {
      openMenus: [],
      activeMenu: '',
      hoverMenu: ''
    };
  },
  methods: {
    toggleMenu(menu) {
      if (this.activeMenu === menu) {
        this.activeMenu = '';
      } else {
        this.activeMenu = menu;
      }
      const index = this.openMenus.indexOf(menu);
      if (index === -1) {
        this.openMenus.push(menu);
      } else {
        this.openMenus.splice(index, 1);
      }
    },
    isOpen(menu) {
      return this.openMenus.includes(menu);
    },
    selectMenu(menu) {
      this.activeMenu = menu;
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 200px;
  background-color: #ffcc80;
  padding: 10px;
  height: calc(100vh - 56px);
  box-sizing: border-box;
  position: fixed;
  top: 56px;
  left: 0;
  overflow-y: auto;
  z-index: 999;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar li {
  padding: 10px;
  cursor: pointer;
  background-color: #ffcc80; /* 一级目录背景色 */
}
.sidebar .submenu li {
  padding-left: 20px; /* 二级目录缩进 */
  background-color: #cc8400; /* 二级目录背景色 */
}
.menu-text, .submenu-text {
  color: white; /* 默认字体颜色 */
}
.menu-text.hover, .submenu-text.hover {
  color: #663300; /* 悬停字体颜色 */
}
.menu-text.active, .submenu-text.active {
  color: #663300; /* 选中字体颜色 */
}
.arrow {
  float: right;
  transition: transform 0.3s ease;
}
.arrow.open {
  transform: rotate(90deg);
}
</style>
