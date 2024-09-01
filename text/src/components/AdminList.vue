<template>
  <div class="admin-list">
    <h2>管理员列表</h2>
    <div class="search-bar">
      <input type="text" placeholder="昵称" v-model="searchName" />
      <select v-model="searchPosition">
        <option value="">职位</option>
        <option value="财务">财务</option>
        <option value="职工">职工</option>
        <option value="仓库">仓库</option>
        <option value="用户">用户</option>
        <option value="总管理">总管理</option>
      </select>
      <button @click="search">搜索</button>
      <button @click="openAddAdmin">添加管理员</button>
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
      <tr v-for="i in itemsPerPage" :key="i" class="table-row">
        <td>{{ paginatedAdmins[i - 1] ? paginatedAdmins[i - 1].id : '' }}</td>
        <td>{{ paginatedAdmins[i - 1] ? paginatedAdmins[i - 1].name : '' }}</td>
        <td>{{ paginatedAdmins[i - 1] ? paginatedAdmins[i - 1].phone : '' }}</td>
        <td>{{ paginatedAdmins[i - 1] ? paginatedAdmins[i - 1].position : '' }}</td>
        <td>{{ paginatedAdmins[i - 1] ? paginatedAdmins[i - 1].gender : '' }}</td>
        <td>
          <button v-if="paginatedAdmins[i - 1]" class="btn blue" @click="viewDetails(paginatedAdmins[i - 1])">查看</button>
        </td>
        <td>
          <button v-if="paginatedAdmins[i - 1]" class="btn yellow" @click="confirmResetPassword(paginatedAdmins[i - 1])">重置密码</button>
          <button v-if="paginatedAdmins[i - 1]" class="btn blue" @click="editAdmin(paginatedAdmins[i - 1])">修改</button>
          <button v-if="paginatedAdmins[i - 1]" class="btn red" @click="deleteAdmin(paginatedAdmins[i - 1].id)">删除</button>
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
        <h3>详细信息</h3>
        <p><strong>ID：</strong> {{ selectedAdmin.id }}</p>
        <p><strong>姓名：</strong> {{ selectedAdmin.name }}</p>
        <p><strong>手机号：</strong> {{ selectedAdmin.phone }}</p>
        <p><strong>职位：</strong> {{ selectedAdmin.position }}</p>
        <p><strong>性别：</strong> {{ selectedAdmin.gender }}</p>
        <p><strong>邮箱：</strong> {{ selectedAdmin.email }}</p>
        <p><strong>身份证：</strong> {{ selectedAdmin.idCard }}</p>
      </div>
    </div>

    <!-- 添加管理员弹出框 -->
    <div v-if="showAddAdmin" class="modal">
      <div class="modal-content form-container">
        <span class="close" @click="closeAddAdmin">&times;</span>
        <h3>添加管理员</h3>
        <form @submit.prevent="confirmAddAdmin">
          <div class="form-group">
            <label for="newName">姓名</label>
            <input type="text" id="newName" v-model="newAdmin.name" class="input-field" />
          </div>
          <div class="form-group">
            <label for="newPhone">手机号</label>
            <input type="text" id="newPhone" v-model="newAdmin.phone" class="input-field" />
          </div>
          <div class="form-group">
            <label for="newGender">性别</label>
            <select id="newGender" v-model="newAdmin.gender" class="input-field">
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
          </div>
          <div class="form-group">
            <label for="newPosition">职位</label>
            <select id="newPosition" v-model="newAdmin.position" class="input-field">
              <option value="财务">财务</option>
              <option value="职工">职工</option>
              <option value="仓库">仓库</option>
              <option value="用户">用户</option>
              <option value="总管理">总管理</option>
            </select>
          </div>
          <div class="form-group">
            <label for="newEmail">邮箱</label>
            <input type="email" id="newEmail" v-model="newAdmin.email" class="input-field" />
          </div>
          <div class="form-group">
            <label for="newIdCard">身份证</label>
            <input type="text" id="newIdCard" v-model="newAdmin.idCard" class="input-field" />
          </div>
          <div class="button-group">
            <button type="submit" class="btn green">确认</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 修改管理员信息弹出框 -->
    <div v-if="showEditAdmin" class="modal">
      <div class="modal-content form-container">
        <span class="close" @click="closeEditAdmin">&times;</span>
        <h3>修改管理员信息</h3>
        <form @submit.prevent="confirmEditAdmin">
          <div class="form-group">
            <label for="editName">姓名</label>
            <input type="text" id="editName" v-model="selectedAdmin.name" class="input-field" />
          </div>
          <div class="form-group">
            <label for="editPhone">手机号</label>
            <input type="text" id="editPhone" v-model="selectedAdmin.phone" class="input-field" />
          </div>
          <div class="form-group">
            <label for="editGender">性别</label>
            <select id="editGender" v-model="selectedAdmin.gender" class="input-field">
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
          </div>
          <div class="form-group">
            <label for="editPosition">职位</label>
            <select id="editPosition" v-model="selectedAdmin.position" class="input-field">
              <option value="财务">财务</option>
              <option value="职工">职工</option>
              <option value="仓库">仓库</option>
              <option value="用户">用户</option>
              <option value="总管理">总管理</option>
            </select>
          </div>
          <div class="form-group">
            <label for="editEmail">邮箱</label>
            <input type="email" id="editEmail" v-model="selectedAdmin.email" class="input-field" />
          </div>
          <div class="form-group">
            <label for="editIdCard">身份证</label>
            <input type="text" id="editIdCard" v-model="selectedAdmin.idCard" class="input-field" />
          </div>
          <div class="button-group">
            <button type="submit" class="btn green">确认</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 确认重置密码弹出框 -->
    <div v-if="showResetPassword" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeResetPassword">&times;</span>
        <h3>确认重置密码</h3>
        <p>确定要重置此管理员的密码吗？</p>
        <button @click="resetPassword(selectedAdmin)" class="btn green">确认重置</button>
      </div>
    </div>

    <!-- 重置密码显示弹出框 -->
    <div v-if="showResetPasswordConfirmed" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeResetPasswordConfirmed">&times;</span>
        <h3>重置密码</h3>
        <p>密码已重置！</p>
        <div class="reset-password-container">
          <input type="text" v-model="newPassword" readonly />
          <button @click="copyPassword">点击复制</button>
        </div>
      </div>
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
        { id: 1, name: 'a', phone: '500', position: '职工', gender: '男', email: 'a@example.com', idCard: '123456' },
        { id: 2, name: 'b', phone: '600', position: '仓库', gender: '女', email: 'b@example.com', idCard: '654321' },
      ],
      filteredAdmins: [],
      currentPage: 1,
      itemsPerPage: 8,
      showDetail: false,
      showAddAdmin: false,
      showEditAdmin: false,
      showResetPassword: false,
      showResetPasswordConfirmed: false,
      selectedAdmin: {},
      newAdmin: { name: '', phone: '', gender: '男', position: '财务', email: '', idCard: '' },
      newPassword: ''
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredAdmins.length / this.itemsPerPage);
    },
    paginatedAdmins() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredAdmins.slice(start, end);
    }
  },
  mounted() {
    this.filteredAdmins = this.admins;
  },
  methods: {
    search() {
      this.filteredAdmins = this.admins.filter(admin => {
        return (
            (!this.searchName || admin.name.includes(this.searchName)) &&
            (!this.searchPosition || admin.position === this.searchPosition)
        );
      });
      this.currentPage = 1;
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
    viewDetails(admin) {
      this.selectedAdmin = { ...admin };
      this.showDetail = true;
    },
    closeDetail() {
      this.showDetail = false;
    },
    openAddAdmin() {
      this.showAddAdmin = true;
    },
    closeAddAdmin() {
      this.showAddAdmin = false;
    },
    confirmAddAdmin() {
      const newId = this.admins.length ? this.admins[this.admins.length - 1].id + 1 : 1;
      const newAdmin = { ...this.newAdmin, id: newId, nickname: '管理员', password: '默认密码' };
      this.admins.push(newAdmin);
      this.filteredAdmins = [...this.admins];
      this.closeAddAdmin();
      this.resetNewAdmin();
    },
    resetNewAdmin() {
      this.newAdmin = { name: '', phone: '', gender: '男', position: '财务', email: '', idCard: '' };
    },
    confirmResetPassword(admin) {
      this.selectedAdmin = admin;
      this.showResetPassword = true;
    },
    resetPassword(admin) {
      this.newPassword = Math.random().toString(36).slice(-8);
      this.selectedAdmin = { ...admin, password: this.newPassword };
      this.showResetPassword = false;
      this.showResetPasswordConfirmed = true;
    },
    closeResetPassword() {
      this.showResetPassword = false;
    },
    closeResetPasswordConfirmed() {
      this.showResetPasswordConfirmed = false;
    },
    copyPassword() {
      const copyText = this.newPassword;
      navigator.clipboard.writeText(copyText).then(() => {
        alert('密码已复制到剪贴板');
      });
    },
    editAdmin(admin) {
      this.selectedAdmin = { ...admin };
      this.showEditAdmin = true;
    },
    closeEditAdmin() {
      this.showEditAdmin = false;
    },
    confirmEditAdmin() {
      const index = this.admins.findIndex(a => a.id === this.selectedAdmin.id);
      if (index !== -1) {
        this.admins.splice(index, 1, this.selectedAdmin);
        this.filteredAdmins = [...this.admins];
      }
      this.showEditAdmin = false;
    },
    deleteAdmin(adminId) {
      this.admins = this.admins.filter(a => a.id !== adminId);
      this.filteredAdmins = this.admins;
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

.table-row {
  height: 50px;
}

.btn {
  margin: 2px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  background-color: #f8f9fa;
  color: black;
  padding: 5px 10px;
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

.center-button {
  display: block;
  margin: 20px auto;
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
  display: flex;
  flex-direction: column;
}

.form-container {
  width: 300px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-group label {
  width: 80px;
}

.form-group .input-field {
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
}

.button-group {
  display: flex;
  justify-content: flex-end; /* 将按钮对齐到右边 */
  margin-top: 20px;
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
