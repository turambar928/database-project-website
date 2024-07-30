<template>
  <div class="sidebar">
    <ul>
      <li v-for="menu in menus" :key="menu.name">
        <div class="menu-item" @click="handleClick(menu, $event)" @mouseover="hoverMenu(menu)" @mouseleave="leaveMenu(menu)">
          <span :class="{'hover': menu.hover, 'active': menu.active}" class="menu-text">{{ menu.name }}</span>
          <span v-if="menu.submenus" :class="{'open': isOpen(menu)}" class="arrow">&#x276F;</span>
        </div>
        <ul v-if="menu.submenus && isOpen(menu)" class="submenu">
          <li v-for="submenu in menu.submenus" :key="submenu.name" @click="handleClick(submenu, $event)" @mouseover="hoverMenu(submenu)" @mouseleave="leaveMenu(submenu)">
            <span :class="{'hover': submenu.hover, 'active': submenu.active}" class="submenu-text">{{ submenu.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menus: [
        { name: '用户管理', submenus: [{ name: '普通用户列表', hover: false, active: false }, { name: '管理员列表', hover: false, active: false }], hover: false, active: false },
        { name: '公告管理', hover: false, active: false },
        { name: '菜品管理', submenus: [{ name: '菜品列表', hover: false, active: false }, { name: '每周菜单', hover: false, active: false }, { name: '每周促销', hover: false, active: false }], hover: false, active: false },
        { name: '职工管理', hover: false, active: false },
        { name: '志愿者管理', submenus: [{ name: '审核志愿者申请', hover: false, active: false }, { name: '上任志愿者管理', hover: false, active: false }], hover: false, active: false },
        { name: '仓库管理', hover: false, active: false },
        { name: '财务', submenus: [{ name: '财务审核', hover: false, active: false }, { name: '财务总表', hover: false, active: false }], hover: false, active: false },
        { name: '数据统计', submenus: [{ name: '用户统计', hover: false, active: false }, { name: '志愿者统计', hover: false, active: false }, { name: '订单统计', hover: false, active: false }, { name: '财务统计', hover: false, active: false }, { name: '系统日志', hover: false, active: false }], hover: false, active: false },
        { name: '系统设置', submenus: [{ name: '食堂信息', hover: false, active: false }], hover: false, active: false },
      ],
      openMenus: [],
      activeMenu: null,
    };
  },
  methods: {
    toggleMenu(menu) {
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
    },
    hoverMenu(menu) {
      menu.hover = true;
    },
    leaveMenu(menu) {
      menu.hover = false;
    },
    handleClick(menu, event) {
      if (!menu.submenus) {
        this.$emit('menu-selected', menu.name);
      } else {
        this.toggleMenu(menu);
        event.stopPropagation();
      }
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 200px;
  background-color: #ffcc80;
  padding: 0;
  height: 100vh;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto; /* 保持滚动功能 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  z-index: 1002; /* 增加z-index以确保在其他元素上方 */
}
.sidebar::-webkit-scrollbar {
  width: 0;
  height: 0;
}
.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar li {
  display: block;
}
.menu-item, .submenu li {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  background-color: inherit; /* 继承背景色 */
}
.menu-text, .submenu-text {
  color: white; /* 默认字体颜色 */
  flex-grow: 1;
}
.menu-text.hover, .submenu-text.hover {
  color: #663300; /* 悬停字体颜色 */
}
.menu-text.active, .submenu-text.active {
  color: #663300; /* 选中字体颜色 */
}
.arrow {
  transition: transform 0.3s ease;
  margin-left: auto;
}
.arrow.open {
  transform: rotate(90deg);
}
.submenu li {
  background-color: #cc8400; /* 二级目录背景色 */
}
</style>
