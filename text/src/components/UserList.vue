<template>
  <div class="user-list">
    <h2>用户列表</h2>
    <div class="search-bar">
      <input type="text" placeholder="昵称" v-model="searchName" />
      <select v-model="searchIdentity">
        <option value="">身份</option>
        <option value="admin">管理员</option>
        <option value="user">用户</option>
      </select>
      <button @click="search">搜索</button>
    </div>
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>昵称</th>
        <th>手机号</th>
        <th>身份</th>
        <th>性别</th>
        <th>详细信息</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.id }}</td>
        <td>{{ user.nickname }}</td>
        <td>{{ user.phone }}</td>
        <td>{{ user.identity }}</td>
        <td>{{ user.gender }}</td>
        <td><button class="btn blue">查看</button></td>
        <td>
          <button class="btn yellow">重置密码</button>
          <button class="btn blue">修改</button>
          <button class="btn red">删除</button>
        </td>
      </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button @click="prevPage">«</button>
      <span v-for="page in totalPages" :key="page" @click="goToPage(page)">{{ page }}</span>
      <button @click="nextPage">»</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserList',
  data() {
    return {
      searchName: '',
      searchIdentity: '',
      users: [
        // 示例数据
        { id: 1, nickname: 'a', phone: '500', identity: 'b', gender: '男' },
        { id: 2, nickname: 'a', phone: '500', identity: 'b', gender: '男' },
        // 添加更多用户
      ],
      currentPage: 1,
      totalPages: 5,
    };
  },
  methods: {
    search() {
      // 搜索逻辑
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    goToPage(page) {
      this.currentPage = page;
    }
  }
};
</script>

<style scoped>
.user-list {
  width: 100%;
  padding: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar input,
.search-bar select {
  margin-right: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.btn {
  padding: 5px 10px;
  margin: 2px;
}

.btn.blue {
  background-color: #007bff;
  color: white;
}

.btn.yellow {
  background-color: #ffc107;
  color: white;
}

.btn.red {
  background-color: #dc3545;
  color: white;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button,
.pagination span {
  margin: 0 5px;
  cursor: pointer;
}
</style>
