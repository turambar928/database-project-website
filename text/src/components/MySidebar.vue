<template>
  <div class="sidebar">
    <ul>
      <li>用户管理</li>
      <li>公告管理</li>
      <li>菜品管理</li>
      <li>员工管理</li>
      <li>志愿者管理</li>
      <li>仓库管理</li>
      <li>财务</li>
      <li>数据统计</li>
      <li>系统设置</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "MySidebar",
};
</script>

<style scoped>
.sidebar {
  width: 200px;
  background-color: #ffcc80;
  padding: 10px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 10px;
  cursor: pointer;
}

.sidebar li:hover {
  background-color: #ffa726;
}
</style>
