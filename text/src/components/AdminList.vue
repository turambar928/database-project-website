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
          <button v-if="paginatedAdmins[i - 1]" class="btn yellow" @click="resetPassword(paginatedAdmins[i - 1])">重置密码</button>
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
      </div>
    </div>

    <!-- 添加管理员弹出框 -->
    <div v-if="showAddAdmin" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeAddAdmin">&times;</span>
        <h3>添加管理员</h3>
        <form @submit.prevent="confirmAddAdmin">
          <div class="form-group">
            <label for="newName">姓名</label>
            <input type="text" id="newName" v-model="newAdmin.name" />
          </div>
          <div class="form-group">
            <label for="newPhone">手机号</label>
            <input type="text" id="newPhone" v-model="newAdmin.phone" />
          </div>
          <div class="form-group">
            <label for="newGender">性别</label>
            <select id="newGender" v-model="newAdmin.gender">
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
          </div>
          <div class="form-group">
            <label for="newPosition">职位</label>
            <select id="newPosition" v-model="newAdmin.position">
              <option value="admin">管理员</option>
              <option value="user">用户</option>
            </select>
          </div>
          <button type="submit" class="btn green">确认</button>
        </form>
      </div>
    </div>

    <!-- 修改管理员信息弹出框 -->
    <div v-if="showEditAdmin" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeEditAdmin">&times;</span>
        <h3>修改管理员信息</h3>
        <form @submit.prevent="confirmEditAdmin">
          <div class="form-group">
            <label for="editName">姓名</label>
            <input type="text" id="editName" v-model="selectedAdmin.name" />
          </div>
          <div class="form-group">
            <label for="editPhone">手机号</label>
            <input type="text" id="editPhone" v-model="selectedAdmin.phone" />
          </div>
          <div class="form-group">
            <label for="editGender">性别</label>
            <select id="editGender" v-model="selectedAdmin.gender">
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
          </div>
          <div class="form-group">
            <label for="editPosition">职位</label>
            <select id="editPosition" v-model="selectedAdmin.position">
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
      filteredAdmins: [], // 用于存储过滤后的管理员列表
      currentPage: 1,
      itemsPerPage: 8,
      showDetail: false,
      showAddAdmin: false, // 控制添加管理员弹出框的显示
      showEditAdmin: false, // 控制编辑管理员信息弹出框的显示
      showResetPassword: false, // 控制重置密码弹出框的显示
      selectedAdmin: {},
      newAdmin: { name: '', phone: '', gender: '男', position: 'admin' },
      newPassword: '' // 示例新密码
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
    this.filteredAdmins = this.admins; // 初始化时显示所有管理员
  },
  methods: {
    search() {
      // 过滤管理员列表
      this.filteredAdmins = this.admins.filter(admin => {
        return (
            (!this.searchName || admin.name.includes(this.searchName)) &&
            (!this.searchPosition || admin.position === this.searchPosition)
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
      // 添加管理员逻辑
      const newId = this.admins.length ? this.admins[this.admins.length - 1].id + 1 : 1;
      const newAdmin = { ...this.newAdmin, id: newId };
      this.admins.push(newAdmin);
      this.filteredAdmins = [...this.admins]; // 同步更新过滤后的管理员列表
      this.closeAddAdmin();
      this.resetNewAdmin();
    },
    resetNewAdmin() {
      this.newAdmin = { name: '', phone: '', gender: '男', position: 'admin' };
    },
    resetPassword(admin) {
      // 生成随机密码
      this.newPassword = Math.random().toString(36).slice(-8);
      this.selectedAdmin = { ...admin, password: this.newPassword };
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
      // 更新管理员密码逻辑
      const index = this.admins.findIndex(a => a.id === this.selectedAdmin.id);
      if (index !== -1) {
        this.admins[index].password = this.newPassword;
        this.filteredAdmins = [...this.admins]; // 同步更新过滤后的管理员列表
      }
      this.showResetPassword = false;
    },
    editAdmin(admin) {
      this.selectedAdmin = { ...admin };
      this.showEditAdmin = true;
    },
    closeEditAdmin() {
      this.showEditAdmin = false;
    },
    confirmEditAdmin() {
      // 更新管理员信息逻辑
      const index = this.admins.findIndex(a => a.id === this.selectedAdmin.id);
      if (index !== -1) {
        this.admins.splice(index, 1, this.selectedAdmin); // 使用 splice 更新管理员信息
        this.filteredAdmins = [...this.admins]; // 同步更新过滤后的管理员列表
      }
      this.showEditAdmin = false;
    },
    deleteAdmin(adminId) {
      // 删除管理员逻辑
      this.admins = this.admins.filter(a => a.id !== adminId);
      this.filteredAdmins = this.admins; // 同步更新过滤后的管理员列表
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
