<template>
  <div class="admin-list">
    <h2>管理员列表</h2>
    <div class="search-bar">
      <input type="text" placeholder="昵称" v-model="searchName" />
      <select v-model="searchPosition">
        <option value="">职位</option>
        <option value="admin">管理员</option>
        <option value="user">用户</option>
      </select>
      <button @click="search">搜索</button>
      <button @click="addAdmin">添加管理员</button>
    </div>
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>姓名</th>
        <th>手机号</th>
        <th>职位</th>
        <th>性别</th>
        <th>详细信息</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="admin in admins" :key="admin.id">
        <td>{{ admin.id }}</td>
        <td>{{ admin.name }}</td>
        <td>{{ admin.phone }}</td>
        <td>{{ admin.position }}</td>
        <td>{{ admin.gender }}</td>
        <td><button class="btn blue" @click="viewDetails">查看</button></td>
        <td>
          <button class="btn yellow" @click="resetPassword">重置密码</button>
          <button class="btn blue" @click="editAdmin">修改</button>
          <button class="btn red" @click="deleteAdmin">删除</button>
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
  name: 'AdminList',
  data() {
    return {
      searchName: '',
      searchPosition: '',
      admins: [
        // 示例数据
        { id: 1, name: 'a', phone: '500', position: 'b', gender: '男' },
        { id: 2, name: 'a', phone: '500', position: 'b', gender: '男' },
        // 添加更多管理员
      ],
      currentPage: 1,
      totalPages: 5,
    };
  },
  methods: {
    search() {
      // 搜索逻辑
    },
    addAdmin() {
      // 添加管理员逻辑
    },
    viewDetails() {
      // 查看详细信息逻辑
    },
    resetPassword() {
      // 重置密码逻辑
    },
    editAdmin() {
      // 修改管理员信息逻辑
    },
    deleteAdmin() {
      // 删除管理员逻辑
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
.admin-list {
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
