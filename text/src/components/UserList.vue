<template>
  <div class="user-list">
    <h2>用户列表</h2>
    <div class="search-bar">
      <input type="text" placeholder="昵称" v-model="searchName" />
      <select v-model="searchIdentity">
        <option value="">身份</option>
        <option value="user">普通用户</option>
        <option value="volunteer">志愿者</option>
        <option value="senior">老人</option>
      </select>
      <button @click="search" class="btn blue">搜索</button>
    </div>
    <div class="table-container">
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
        <tr v-if="filteredUsers.length === 0">
          <td colspan="7" class="no-data">没有找到匹配的用户</td>
        </tr>
        <tr v-for="(user, index) in translatedUsers" :key="index" class="table-row">
          <td>{{ user.accountId }}</td>
          <td>{{ user.accountName }}</td>
          <td>{{ user.phoneNum }}</td>
          <td>{{ user.identityDisplay }}</td>
          <td>{{ user.genderDisplay }}</td>
          <td>
            <button class="btn small blue" @click="viewDetail(user)">查看</button>
          </td>
          <td class="action-buttons">
            <button class="btn small yellow" @click="confirmResetPassword(user)">重置密码</button>
            <button class="btn small blue" @click="editUser(user)">修改</button>
            <button class="btn small red" @click="deleteUser(user.accountId)">删除</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
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
        <p><strong>姓名：</strong> {{ selectedUser.name || '空' }}</p>
        <p><strong>身份证号：</strong> {{ selectedUser.idNumber || '空' }}</p>
        <p><strong>生日：</strong> {{ selectedUser.birthday || '空' }}</p>
        <p><strong>地址：</strong> {{ selectedUser.address || '空' }}</p>
      </div>
    </div>

    <!-- 重置密码确认弹出框 -->
    <div v-if="showResetPasswordConfirm" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeResetPasswordConfirm">&times;</span>
        <h3>确认重置密码</h3>
        <p>确定要重置密码吗？</p>
        <button @click="resetPassword(selectedUser)" class="btn green">确认</button>
        <button @click="closeResetPasswordConfirm" class="btn red">取消</button>
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
          <button @click="copyPassword" class="btn blue">点击复制</button>
        </div>
        <button @click="closeResetPassword" class="btn green">确认</button>
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
            <input type="text" id="editNickname" v-model="selectedUser.accountName" />
          </div>
          <div class="form-group">
            <label for="editPhone">手机号</label>
            <input type="text" id="editPhone" v-model="selectedUser.phoneNum" />
          </div>
          <div class="form-group">
            <label for="editGender">性别</label>
            <select id="editGender" v-model="selectedUser.gender">
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </div>
          <div class="form-group">
            <label for="editIdentity">身份</label>
            <select id="editIdentity" v-model="selectedUser.identity">
              <option value="user">普通用户</option>
              <option value="volunteer">志愿者</option>
              <option value="senior">老人</option>
            </select>
          </div>
          <button type="submit" class="btn green">确认</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserList',
  data() {
    return {
      searchName: '',
      searchIdentity: '',
      users: [],
      filteredUsers: [],
      currentPage: 1,
      itemsPerPage: 10,
      showDetail: false,
      showResetPasswordConfirm: false,
      showResetPassword: false,
      showEditUser: false,
      selectedUser: {},
      newPassword: ''
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
    },
    translatedUsers() {
      return this.paginatedUsers.map(user => ({
        ...user,
        genderDisplay: user.gender === 'male' ? '男' : user.gender === 'female' ? '女' : '未知',
        identityDisplay: user.identity === 'user' ? '普通用户' : user.identity === 'volunteer' ? '志愿者' : '老人'
      }));
    }
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      axios
          .get('http://8.136.125.61/api/users/search')
          .then((response) => {
            this.users = response.data.response || [];
            this.filteredUsers = this.users;
          })
          .catch((error) => {
            console.error('获取用户列表失败', error);
          });
    },
    search() {
      axios
          .get('http://8.136.125.61/api/users/search', {
            params: {
              accountName: this.searchName || undefined,
              identity: this.searchIdentity || undefined,
            },
          })
          .then((response) => {
            if (response.data.success) {
              this.filteredUsers = response.data.response.map(user => ({
                ...user,
                gender: user.gender || '未知'
              }));
              this.currentPage = 1;
            } else {
              console.error('搜索用户失败：', response.data.msg);
              this.filteredUsers = [];
            }
          })
          .catch((error) => {
            console.error('搜索用户失败', error);
          });
    },
    viewDetail(user) {
      if (!user) return;
      axios.get(`http://8.136.125.61/api/users/${user.accountId}`)
          .then(response => {
            if (response.data.success) {
              const userData = response.data.response[0];
              this.selectedUser = {
                name: userData.name || '空',
                idNumber: userData.idNumber || '空',
                birthday: userData.birthday || '空',
                address: userData.address || '空'
              };
              this.showDetail = true;
            } else {
              console.error('获取用户详细信息失败', response.data.msg);
            }
          })
          .catch(error => {
            console.error('获取用户详细信息失败', error);
          });
    },
    closeDetail() {
      this.showDetail = false;
    },
    confirmResetPassword(user) {
      this.selectedUser = user;
      this.showResetPasswordConfirm = true;
    },
    resetPassword(user) {
      axios.post(`http://8.136.125.61/api/users/resetpsd/${user.accountId}`)
          .then(response => {
            this.newPassword = response.data.password || '';
            this.selectedUser = { ...user, password: this.newPassword };
            this.showResetPasswordConfirm = false;
            this.showResetPassword = true;
          })
          .catch(error => {
            console.error('重置密码失败', error);
          });
    },
    closeResetPasswordConfirm() {
      this.showResetPasswordConfirm = false;
    },
    closeResetPassword() {
      this.showResetPassword = false;
    },
    copyPassword() {
      const copyText = this.newPassword;
      navigator.clipboard.writeText(copyText).then(() => {
        alert('密码已复制到剪贴板');
      });
    },
    editUser(user) {
      this.selectedUser = { ...user };
      this.showEditUser = true;
    },
    closeEditUser() {
      this.showEditUser = false;
    },
    confirmEditUser() {
      // 验证手机号长度
      if (this.selectedUser.phoneNum.length !== 11) {
        alert('手机号必须为11位，请重新输入');
        return;
      }

      const updatedUser = {
        ...this.selectedUser,
        gender: this.selectedUser.gender === '男' ? 'male' : 'female',
        identity: this.selectedUser.identity === '普通用户' ? 'user' : this.selectedUser.identity === '志愿者' ? 'volunteer' : 'senior'
      };

      axios.put(`http://8.136.125.61/api/users/${this.selectedUser.accountId}`, updatedUser)
          .then(() => {
            const index = this.users.findIndex(u => u.accountId === this.selectedUser.accountId);
            if (index !== -1) {
              this.users.splice(index, 1, this.selectedUser);
              this.filteredUsers = [...this.users];
            }
            this.showEditUser = false;
          })
          .catch(error => {
            console.error('修改用户信息失败', error);
          });
    },
    deleteUser(userId) {
      axios.delete(`http://8.136.125.61/api/users/${userId}`)
          .then(() => {
            this.users = this.users.filter(u => u.accountId !== userId);
            this.filteredUsers = this.users;
          })
          .catch(error => {
            console.error('删除用户失败', error);
          });
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

.table-container {
  width: 100%;
  overflow-x: auto;
  margin: 0;
  padding: 0;
  min-height: 500px;  /* 根据需要调整，确保即使数据少时也有足够的空间 */
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  min-width: 600px; /* 设置表格最小宽度 */
  table-layout: fixed; /* 固定表格布局 */
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  box-sizing: border-box; /* 确保内边距不影响总宽度 */
}

.table-row {
  height: 50px;
  box-sizing: border-box; /* 确保行的内边距不影响布局 */
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #999;
}

.btn {
  padding: 5px 10px;
  margin: 2px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  background-color: #f8f9fa;
  color: black;
}

.btn.small {
  padding: 5px;
  width: auto;
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

.action-buttons {
  display: flex;
  gap: 1px; /* 调整按钮之间的间距 */
  justify-content: flex-start; /* 按钮靠左对齐 */
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  min-height: 50px;  /* 设置一个最小高度 */
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

.full-width {
  width: 100%;
}
</style>
