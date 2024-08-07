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
      <tr v-for="i in itemsPerPage" :key="i" class="table-row">
        <td>{{ paginatedUsers[i - 1] ? paginatedUsers[i - 1].id : '' }}</td>
        <td>{{ paginatedUsers[i - 1] ? paginatedUsers[i - 1].nickname : '' }}</td>
        <td>{{ paginatedUsers[i - 1] ? paginatedUsers[i - 1].phone : '' }}</td>
        <td>{{ paginatedUsers[i - 1] ? paginatedUsers[i - 1].identity : '' }}</td>
        <td>{{ paginatedUsers[i - 1] ? paginatedUsers[i - 1].gender : '' }}</td>
        <td>
          <button v-if="paginatedUsers[i - 1]" class="btn blue" @click="viewDetail(paginatedUsers[i - 1])">查看</button>
        </td>
        <td>
          <button v-if="paginatedUsers[i - 1]" class="btn yellow" @click="resetPassword(paginatedUsers[i - 1])">重置密码</button>
          <button v-if="paginatedUsers[i - 1]" class="btn blue" @click="editUser(paginatedUsers[i - 1])">修改</button>
          <button v-if="paginatedUsers[i - 1]" class="btn red" @click="deleteUser(paginatedUsers[i - 1].id)">删除</button>
        </td>
      </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">«</button>
      <span v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="{'active': currentPage === page}">{{ page }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">»</button>
    </div>

    <!-- 详细信息弹出框 -->
    <div v-if="showDetail" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeDetail">&times;</span>
        <h3>用户信息</h3>
        <form @submit.prevent="confirmDetails">
          <div class="form-group">
            <label for="nickname">昵称</label>
            <input type="text" id="nickname" v-model="selectedUser.nickname" disabled />
          </div>
          <div class="form-group">
            <label for="phone">手机号</label>
            <input type="text" id="phone" v-model="selectedUser.phone" disabled />
          </div>
          <div class="form-group">
            <label for="gender">性别</label>
            <select id="gender" v-model="selectedUser.gender">
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
          </div>
          <div class="form-group">
            <label for="identity">身份</label>
            <select id="identity" v-model="selectedUser.identity">
              <option value="admin">管理员</option>
              <option value="user">用户</option>
            </select>
          </div>
          <button type="submit" class="btn green">确认</button>
        </form>
      </div>
    </div>

    <!-- 重置密码弹出框 -->
    <div v-if="showResetPassword" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeResetPassword">&times;</span>
        <h3>重置密码</h3>
        <p>已重置密码！</p>
        <div class="reset-password-container">
          <input type="text" v-model="newPassword" readonly />
          <button @click="copyPassword">点击复制</button>
        </div>
        <button @click="confirmResetPassword" class="btn green">确认</button>
      </div>
    </div>

    <!-- 修改用户信息弹出框 -->
    <div v-if="showEditUser" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeEditUser">&times;</span>
        <h3>修改用户信息</h3>
        <form @submit.prevent="confirmEditUser">
          <div class="form-group">
            <label for="editNickname">昵称</label>
            <input type="text" id="editNickname" v-model="selectedUser.nickname" />
          </div>
          <div class="form-group">
            <label for="editPhone">手机号</label>
            <input type="text" id="editPhone" v-model="selectedUser.phone" />
          </div>
          <div class="form-group">
            <label for="editGender">性别</label>
            <select id="editGender" v-model="selectedUser.gender">
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
          </div>
          <div class="form-group">
            <label for="editIdentity">身份</label>
            <select id="editIdentity" v-model="selectedUser.identity">
              <option value="admin">管理员</option>
              <option value="user">用户</option>
            </select>
          </div>
          <button type="submit" class="btn green">确认</button>
        </form>
      </div>
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
        // 添加更多用户以便分页展示
      ],
      filteredUsers: [], // 用于存储过滤后的用户列表
      currentPage: 1,
      itemsPerPage: 8,
      showDetail: false,
      showResetPassword: false, // 控制重置密码弹出框的显示
      showEditUser: false, // 控制编辑用户信息弹出框的显示
      selectedUser: {},
      newPassword: '' // 示例新密码
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredUsers.slice(start, end);
    }
  },
  mounted() {
    this.filteredUsers = this.users; // 初始化时显示所有用户
  },
  methods: {
    search() {
      // 过滤用户列表
      this.filteredUsers = this.users.filter(user => {
        return (
            (!this.searchName || user.nickname.includes(this.searchName)) &&
            (!this.searchIdentity || user.identity === this.searchIdentity)
        );
      });
      this.currentPage = 1; // 搜索后重置到第一页
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
    },
    viewDetail(user) {
      this.selectedUser = { ...user };
      this.showDetail = true;
    },
    closeDetail() {
      this.showDetail = false;
    },
    confirmDetails() {
      // 更新用户信息逻辑
      this.showDetail = false;
    },
    resetPassword(user) {
      // 生成随机密码
      this.newPassword = Math.random().toString(36).slice(-8);
      this.selectedUser = { ...user, password: this.newPassword };
      this.showResetPassword = true;
    },
    closeResetPassword() {
      this.showResetPassword = false;
    },
    copyPassword() {
      // 复制密码逻辑
      const copyText = this.newPassword;
      navigator.clipboard.writeText(copyText).then(() => {
        alert('密码已复制到剪贴板');
      });
    },
    confirmResetPassword() {
      // 更新用户密码逻辑
      const index = this.users.findIndex(u => u.id === this.selectedUser.id);
      if (index !== -1) {
        this.users[index].password = this.newPassword;
        this.filteredUsers = [...this.users]; // 同步更新过滤后的用户列表
      }
      this.showResetPassword = false;
    },
    editUser(user) {
      this.selectedUser = { ...user };
      this.showEditUser = true;
    },
    closeEditUser() {
      this.showEditUser = false;
    },
    confirmEditUser() {
      // 更新用户信息逻辑
      const index = this.users.findIndex(u => u.id === this.selectedUser.id);
      if (index !== -1) {
        this.users.splice(index, 1, this.selectedUser); // 使用 splice 更新用户信息
        this.filteredUsers = [...this.users]; // 同步更新过滤后的用户列表
      }
      this.showEditUser = false;
    },
    deleteUser(userId) {
      // 删除用户逻辑
      this.users = this.users.filter(u => u.id !== userId);
      this.filteredUsers = this.users; // 同步更新过滤后的用户列表
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

.table-row {
  height: 50px; /* 固定行高 */
}

.btn {
  padding: 5px 10px;
  margin: 2px;
  border: none; /* 移除黑框 */
  cursor: pointer;
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

.btn.green {
  background-color: #28a745;
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

.pagination .active {
  font-weight: bold;
  text-decoration: underline;
}

.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  position: relative;
  width: 400px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #aaa;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
}

.reset-password-container {
  display: flex;
  align-items: center;
}

.reset-password-container input {
  flex: 1;
  margin-right: 10px;
}
</style>
