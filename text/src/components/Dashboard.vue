<template>
  <div class="dashboard">
    <el-container style="height: 100vh;">
      <el-aside width="200px" class="aside">
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          :collapse="isCollapse"
        >
          <el-menu-item index="1">
            <i class="el-icon-user"></i>
            <span>用户管理</span>
          </el-menu-item>
          <el-submenu index="2">
            <template #title>
              <i class="el-icon-menu"></i>
              <span>公告管理</span>
            </template>
            <el-menu-item index="2-1">公告列表</el-menu-item>
            <el-menu-item index="2-2">发布公告</el-menu-item>
          </el-submenu>
          <!-- 添加更多菜单项 -->
        </el-menu>
      </el-aside>

      <el-container>
        <el-header class="header">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>公告管理</el-breadcrumb-item>
            <el-breadcrumb-item>公告列表</el-breadcrumb-item>
          </el-breadcrumb>
          <el-avatar class="user-avatar" size="50" src="https://via.placeholder.com/50"></el-avatar>
        </el-header>

        <el-main class="main">
          <p>详细界面看具体介绍</p>
          <el-button type="primary">Element Plus 按钮</el-button>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'DashboardComponent',
  data() {
    return {
      isCollapse: false,
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style scoped>
.dashboard {
  height: 100vh;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #fff;
}
.user-avatar {
  cursor: pointer;
}
.aside {
  background-color: #f2f2f2;
}
.main {
  padding: 20px;
  text-align: center;
  font-size: 24px;
  color: red;
}
</style>
