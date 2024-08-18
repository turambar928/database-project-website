<template>
  <div id="app">
    <div class="container">
      <h2>职工管理</h2>
      <div class="search-add-container">
        <input v-model="searchName" placeholder="姓名" class="input-field" />
        <select v-model="searchPosition" class="input-field">
          <option value="">职位</option>
          <option v-for="position in positions" :key="position" :value="position">{{ position }}</option>
        </select>
        <button @click="search" class="button primary">搜索</button>
        <button @click="showAddModal" class="button success">添加职工</button>
        <button @click="showBatchModal" class="button primary">发工资</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>姓名</th>
            <th>身份证号</th>
            <th>电话</th>
            <th>地址</th>
            <th>职位</th>
            <th>工资</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in paginatedEmployees" :key="employee.id">
            <td>{{ employee.id }}</td>
            <td>{{ employee.name }}</td>
            <td>{{ employee.IdCard }}</td>
            <td>{{ employee.phone }}</td>
            <td>{{ employee.address }}</td>
            <td>{{ employee.position }}</td>
            <td>{{ employee.salary }}</td>
            <td>
              <button @click="showEditModal(employee)" class="button warning">修改</button>
              <button @click="deleteEmployee(employee.id)" class="button danger">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="button">上一页</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="button">下一页</button>
        <input v-model="pageInput" type="number" min="1" :max="totalPages" placeholder="跳转页码" class="input-field" />
        <button @click="changePage(pageInput)" :disabled="!pageInput || pageInput < 1 || pageInput > totalPages" class="button">跳转</button>
      </div>

      <div v-if="isModalVisible" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <button class="close-button" @click="closeModal">X</button>
          <h3>{{ isEditing ? '修改职工' : '添加职工' }}</h3>
          <form @submit.prevent="isEditing ? updateEmployee() : addEmployee()">
            <div class="form-group">
              <label>姓名</label>
              <input v-model="employeeForm.name" required class="input-field" />
            </div>
            <div class="form-group">
              <label>身份证号</label>
              <input v-model="employeeForm.IdCard" required class="input-field" />
            </div>
            <div class="form-group">
              <label>电话</label>
              <input v-model="employeeForm.phone" required class="input-field" />
            </div>
            <div class="form-group">
              <label>地址</label>
              <input v-model="employeeForm.address" required class="input-field" />
            </div>
            <div class="form-group">
              <label>职位</label>
              <select v-model="employeeForm.position" required class="input-field">
                <option v-for="position in positions" :key="position" :value="position">{{ position }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>工资</label>
              <input v-model="employeeForm.salary" type="number" required class="input-field" />
            </div>
            <button type="submit" class="button primary">确认</button>
          </form>
        </div>
      </div>

      <div v-if="isBatchModalVisible" class="modal-overlay" @click.self="closeBatchModal">
        <div class="modal-content">
          <button class="close-button" @click="closeBatchModal">X</button>
          <h3>请选职工</h3>
          <form @submit.prevent="batchPaySalary">
            <table class="table">
              <thead>
                <tr>
                  <th></th>
                  <th>ID</th>
                  <th>姓名</th>
                  <th>工资</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="employee in employees" :key="employee.id">
                  <td><input type="checkbox" v-model="selectedEmployees" :value="employee.id" /></td>
                  <td>{{ employee.id }}</td>
                  <td>{{ employee.name }}</td>
                  <td>{{ employee.salary }}</td>
                </tr>
              </tbody>
            </table>
            <div class="form-group">
              <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" /> 全选
            </div>
            <button type="submit" class="button primary">确认</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, reactive, computed } from 'vue';

axios.defaults.baseURL = 'http://127.0.0.1:4523/m1/4808550-4462943-default'; // 替换为实际的 Mock URL

export default {
  setup() {
    const employees = ref([]);
    const isModalVisible = ref(false);
    const isBatchModalVisible = ref(false);
    const isEditing = ref(false);
    const employeeForm = reactive({
      name: '',
      IdCard: '', // 更新字段名
      phone: '',
      address: '',
      position: '',
      salary: ''
    });
    const positions = ref(['经理', '主管', '员工']);
    const searchName = ref('');
    const searchPosition = ref('');
    const currentPage = ref(1);
    const totalPages = ref(1);
    const itemsPerPage = 10; // 每页显示的员工数量
    const selectedEmployees = ref([]);
    const selectAll = ref(false);
    const pageInput = ref('');

    const fetchEmployees = async () => {
      try {
        const response = await axios.get('/api/employee/search');
        if (response.data && Array.isArray(response.data.response)) {
          employees.value = response.data.response.map(emp => ({
            ...emp,
            paid: emp.paid || 0 // 确保 paid 字段存在且为数字
          }));
          totalPages.value = Math.ceil(employees.value.length / itemsPerPage); // 计算总页数
        } else {
          console.error('API 返回的数据不是数组:', response.data);
          employees.value = []; // 设置为空数组以避免后续错误
          totalPages.value = 0; // 更新总页数
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    const filteredEmployees = computed(() => {
      return employees.value.filter(employee => {
        return (
          (!searchName.value || employee.name.includes(searchName.value)) &&
          (!searchPosition.value || employee.position === searchPosition.value)
        );
      });
    });

    const paginatedEmployees = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return filteredEmployees.value.slice(start, start + itemsPerPage);
    });

    const showAddModal = () => {
      isEditing.value = false;
      resetForm();
      isModalVisible.value = true;
    };

    const showEditModal = (employee) => {
      isEditing.value = true;
      Object.assign(employeeForm, employee);
      isModalVisible.value = true;
    };

    const closeModal = () => {
      isModalVisible.value = false;
    };

    const closeBatchModal = () => {
      isBatchModalVisible.value = false;
    };

    const showBatchModal = () => {
      isBatchModalVisible.value = true;
    };

    const addEmployee = async () => {
      try {
        const response = await axios.post('/api/employee/add', { ...employeeForm, paid: 0 });
        
        if (response.status === 200) { // 响应成功
          employees.value.push(response.data);
          closeModal();
          totalPages.value = Math.ceil(employees.value.length / itemsPerPage); // 更新总页数
          currentPage.value = totalPages.value; // 跳转到最后一页
          window.location.href = 'URL1'; // 重定向到 URL1
        }
      } catch (error) {
        if (error.response && error.response.status === 400) { // 员工已存在
          console.error('Employee ID already exists');
          window.location.href = 'URL2'; // 重定向到 URL2
        } else {
          console.error('Error adding employee:', error);
        }
      }
    };

    const updateEmployee = async () => {
      try {
        await axios.put(`/api/employee/${employeeForm.id}`, { ...employeeForm });
        const index = employees.value.findIndex(employee => employee.id === employeeForm.id);
        employees.value.splice(index, 1, { ...employeeForm });
        closeModal();
      } catch (error) {
        console.error('Error updating employee:', error);
      }
    };

    const deleteEmployee = async (id) => {
      try {
        await axios.delete(`/api/employee/${id}`);
        employees.value = employees.value.filter(employee => employee.id !== id);
        totalPages.value = Math.ceil(employees.value.length / itemsPerPage); // 更新总页数
        if (currentPage.value > totalPages.value) {
          currentPage.value = totalPages.value; // 确保当前页不超出总页数
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    };

    const batchPaySalary = async () => {
      try {
        await Promise.all(selectedEmployees.value.map(async (id) => {
          const employee = employees.value.find(emp => emp.id === id);
          if (employee) {
            employee.paid = 1;
            await axios.put(`/api/employee/${id}`, employee);
            console.log(`Paid salary to ${employee.name}`);
          }
        }));
        closeBatchModal();
      } catch (error) {
        console.error('Error in batch pay salary:', error);
      }
    };

    const resetForm = () => {
      employeeForm.name = '';
      employeeForm.IdCard = ''; // 更新字段名
      employeeForm.phone = '';
      employeeForm.address = '';
      employeeForm.position = '';
      employeeForm.salary = '';
    };

    const search = () => {
      fetchEmployees();
      currentPage.value = 1; // 重置当前页为第一页
    };

    const toggleSelectAll = () => {
      if (selectAll.value) {
    // 全选所有员工
        selectedEmployees.value = employees.value.map(employee => employee.id);
     } else {
    // 取消选择所有员工
        selectedEmployees.value = [];
  }
};


    const changePage = (page) => {
      const pageNum = Number(page);
      if (pageNum >= 1 && pageNum <= totalPages.value) {
        currentPage.value = pageNum; // 更新当前页
        pageInput.value = ''; // 清空输入框
      }
    };

    fetchEmployees();

    return {
      employees,
      isModalVisible,
      isBatchModalVisible,
      isEditing,
      employeeForm,
      positions,
      searchName,
      searchPosition,
      currentPage,
      totalPages,
      selectedEmployees,
      selectAll,
      filteredEmployees,
      pageInput,
      paginatedEmployees, // 确保导出 paginatedEmployees
      showAddModal,
      showEditModal,
      closeModal,
      closeBatchModal,
      showBatchModal,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      batchPaySalary,
      search,
      toggleSelectAll,
      changePage
    };
  }
};
</script>

<style>
/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f7fa; /* 添加背景色 */
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 轻微阴影 */
}

/* Search and Add Container */
.search-add-container {
  display: flex;
  gap: 8px; /* 减少元素之间的间距 */
  margin-bottom: 10px; /* 减少底部间距 */
  justify-content: flex-start; /* 将元素紧凑排列在左侧 */
  align-items: center; /* 垂直居中 */
}

.input-field {
  padding: 6px 10px; /* 减少输入框内边距，使其更紧凑 */
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  font-size: 14px;
  transition: border-color 0.3s ease;
  width: 150px; /* 调整输入框宽度，保持紧凑 */
}

.input-field:focus {
  border-color: #007bff;
  outline: none;
}

.button {
  padding: 6px 12px; /* 缩小按钮尺寸 */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.button.primary {
  background-color: #007bff;
  color: white;
}

.button.primary:hover {
  background-color: #0056b3;
  transform: translateY(-1px); /* 缩小悬停时的上移效果 */
}

.button.success {
  background-color: #28a745;
  color: white;
}

.button.success:hover {
  background-color: #218838;
  transform: translateY(-1px);
}

.search-add-container button:last-child {
  margin-left: 10px; /* 让发工资按钮稍微远离其他按钮 */
}


/* Button Styles */
.button {
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.button.primary {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.button.primary:hover {
  background-color: #0056b3;
  transform: translateY(-1px);
}

.button.success {
  background-color: #28a745;
  color: white;
}

.button.success:hover {
  background-color: #218838;
  transform: translateY(-2px);
}

.button.warning {
  background-color: #ffc107;
  color: white;
}

.button.warning:hover {
  background-color: #e0a800;
  transform: translateY(-2px);
}

.button.danger {
  background-color: #dc3545;
  color: white;
}

.button.danger:hover {
  background-color: #c82333;
  transform: translateY(-2px);
}

/* Table Styles */
.table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff; /* 白色背景 */
  border-radius: 8px; /* 圆角 */
  overflow: hidden; /* 隐藏溢出 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 轻微阴影 */
}

.table th,
.table td {
  padding: 15px;
  border: 1px solid #ddd;
  text-align: left;
  font-size: 14px;
}

.table th {
  background-color: #007bff;
  color: white;
  text-transform: uppercase;
  font-weight: bold;
}

.table tbody tr:nth-child(even) {
  background-color: #f9f9f9; /* 斑马条纹效果 */
}

.table tbody tr:hover {
  background-color: #f1f1f1; /* 鼠标悬停时的背景颜色 */
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* 背景遮罩 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 确保模态框位于最前 */
}

/* Modal Content */
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 600px; /* 模态框的最大宽度 */
  width: 100%;
  max-height: 80vh; /* 模态框的最大高度 */
  overflow-y: auto; /* 启用垂直滚动条 */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); /* 深度阴影 */
  position: relative;
  animation: fadeIn 0.3s ease-in-out; /* 弹出动画 */
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Close Button */
.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #dc3545;
  color: white;
  border: none;
  font-size: 18px;
  cursor: pointer;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.close-button:hover {
  background: #c82333;
}

/* Modal Title */
.modal-content h3 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

/* Table within Modal */
.modal-content table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.modal-content th,
.modal-content td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;
}

.modal-content th {
  background-color: #007bff;
  color: white;
  text-transform: uppercase;
  font-weight: bold;
}

.modal-content tbody tr:nth-child(even) {
  background-color: #f9f9f9; /* 斑马条纹效果 */
}

.modal-content tbody tr:hover {
  background-color: #f1f1f1; /* 鼠标悬停时的背景颜色 */
}


/* Form Group within Modal */
.form-group {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.form-group input[type="checkbox"] {
  margin-right: 10px;
}

.form-group label {
  margin: 0;
  font-weight: bold;
  color: #555;
}

.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #007bff;
  background-color: #fff;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 5px;
}

</style>
