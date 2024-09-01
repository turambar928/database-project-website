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
          <tr v-for="employee in paginatedEmployees" :key="employee.employeeId">
            <td>{{ employee.employeeId }}</td>
            <td>{{ employee.employeeName }}</td>
            <td>{{ employee.idCard }}</td>
            <td>{{ employee.phoneNum }}</td>
            <td>{{ employee.address }}</td>
            <td>{{ employee.employeePosition }}</td>
            <td>{{ employee.salary }}</td>
            <td>
              <button @click="showEditModal(employee)" class="button warning">修改</button>
              <button @click="deleteEmployee(employee.employeeId)" class="button danger">删除</button>
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
          <!-- 修改关闭按钮为图像 -->
          <button class="close-button" @click="closeModal">
            <img src="close.png" alt="关闭" class="close-icon" />
          </button>
          <h3>{{ isEditing ? '修改职工' : '添加职工' }}</h3>
          <form @submit.prevent="isEditing ? updateEmployee() : addEmployee()" class="modal-form">
            <div class="form-group">
              <label>姓名</label>
              <input v-model="employeeForm.employeeName" required class="input-field" />
            </div>
            <div class="form-group">
              <label>身份证号</label>
              <input v-model="employeeForm.idCard" required class="input-field" />
            </div>
            <div class="form-group">
              <label>电话</label>
              <input v-model="employeeForm.phoneNum" required class="input-field" />
            </div>
            <div class="form-group">
              <label>地址</label>
              <input v-model="employeeForm.address" required class="input-field" />
            </div>
            <div class="form-group">
              <label>职位</label>
              <select v-model="employeeForm.employeePosition" required class="input-field">
                <option v-for="position in positions" :key="position" :value="position">{{ position }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>工资</label>
              <input v-model="employeeForm.salary" type="number" required class="input-field" />
            </div>
            <button type="submit" class="button primary confirm-button">确认</button>
          </form>
        </div>
      </div>

      <div v-if="isBatchModalVisible" class="modal-overlay" @click.self="closeBatchModal">
        <div class="modal-content">
          <!-- 修改关闭按钮为图像 -->
          <button class="close-button" @click="closeBatchModal">
            <img src="close.png" alt="关闭" class="close-icon" />
          </button>
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
                <tr v-for="employee in employees" :key="employee.employeeId">
                  <td><input type="checkbox" v-model="selectedEmployees" :value="employee.employeeId" /></td>
                  <td>{{ employee.employeeId }}</td>
                  <td>{{ employee.employeeName }}</td>
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

axios.defaults.baseURL = 'http://8.136.125.61'; // 

export default {
  setup() {
    const employees = ref([]);
    const filteredEmployees = ref([]);
    const isModalVisible = ref(false);
    const isBatchModalVisible = ref(false);
    const isEditing = ref(false);
    const employeeForm = reactive({
      employeeName: '',
      idCard: '', 
      phoneNum: '',
      address: '',
      employeePosition: '',
      salary: ''
    });
    const positions = ref(['财务','职工','仓库','用户','总管理']);
    const searchName = ref('');
    const searchPosition = ref('');
    const currentPage = ref(1);
    const totalPages = ref(1);
    const itemsPerPage = 10; 
    const selectedEmployees = ref([]);
    const selectAll = ref(false);
    const pageInput = ref('');

    const fetchEmployees = async () => {
  try {
    const response = await axios.get('/api/employee/getInfo');
    // 检查返回数据是数组并且数组的第一项是对象
    if (Array.isArray(response.data) && response.data.length > 0 && response.data[0].response && Array.isArray(response.data[0].response)) {
      employees.value = response.data[0].response.map(emp => ({
        ...emp,
        paid: emp.paid || 0
      }));
      filteredEmployees.value = employees.value;
      totalPages.value = Math.ceil(filteredEmployees.value.length / itemsPerPage);
    } else {
      console.error('API 返回的数据结构不符合预期:', response.data);
      employees.value = [];
      filteredEmployees.value = [];
      totalPages.value = 0;
    }
  } catch (error) {
    console.error('Error fetching employees:', error);
  }
};



    const search = async () => {
      try {
        let filtered = employees.value;
        if (searchName.value) {
          filtered = filtered.filter(emp => emp.employeeName.includes(searchName.value));
        }
        if (searchPosition.value) {
          filtered = filtered.filter(emp => emp.employeePosition === searchPosition.value);
        }
        filteredEmployees.value = filtered;
        totalPages.value = Math.ceil(filteredEmployees.value.length / itemsPerPage);
        currentPage.value = 1;
      } catch (error) {
        console.error('Error searching employees:', error);
      }
    };

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
      if (employeeForm.phoneNum.length !== 11) {
        alert('电话号码必须为11位,请重新输入。');
        return;
      }

      if (employeeForm.idCard.length !== 18) {
        alert('身份证号必须为18位,请重新输入。');
        return;
      }
      try {
        const response = await axios.post('/api/employee/add', { ...employeeForm, paid: 0 });
        
        if (response.status === 200) {
          employees.value.push(response.data);
          closeModal();
          totalPages.value = Math.ceil(employees.value.length / itemsPerPage);
          currentPage.value = totalPages.value;
          window.location.href = 'URL1';
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.error('Employee ID already exists');
          window.location.href = 'URL2';
        } else {
          console.error('Error adding employee:', error);
        }
      }
    };

    const updateEmployee = async () => {
      try {
        await axios.put(`/api/employee/${employeeForm.employeeId}`, { ...employeeForm });
        const index = employees.value.findIndex(employee => employee.employeeId === employeeForm.employeeId);
        employees.value.splice(index, 1, { ...employeeForm });
        closeModal();
      } catch (error) {
        console.error('Error updating employee:', error);
      }
    };

    const deleteEmployee = async (id) => {
      try {
        await axios.delete(`/api/employee/${id}`);
        employees.value = employees.value.filter(employee => employee.employeeId !== id);
        totalPages.value = Math.ceil(employees.value.length / itemsPerPage);
        if (currentPage.value > totalPages.value) {
          currentPage.value = totalPages.value;
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    };

    const batchPaySalary = async () => {
      try {
        await Promise.all(selectedEmployees.value.map(async (id) => {
          const employee = employees.value.find(emp => emp.employeeId === id);
          if (employee) {
            employee.paid = 1;
            await axios.put(`/api/employee/${id}`, employee);
            console.log(`Paid salary to ${employee.employeeName}`);
          }
        }));
        closeBatchModal();
      } catch (error) {
        console.error('Error in batch pay salary:', error);
      }
    };

    const resetForm = () => {
      employeeForm.employeeName = '';
      employeeForm.idCard = ''; 
      employeeForm.phoneNum = '';
      employeeForm.address = '';
      employeeForm.employeePosition = '';
      employeeForm.salary = '';
    };

    const toggleSelectAll = () => {
      if (selectAll.value) {
        selectedEmployees.value = employees.value.map(employee => employee.employeeId);
      } else {
        selectedEmployees.value = [];
      }
    };

    const changePage = (page) => {
      const pageNum = Number(page);
      if (pageNum >= 1 && pageNum <= totalPages.value) {
        currentPage.value = pageNum;
        pageInput.value = '';
      }
    };

    fetchEmployees();

    return {
      employees,
      filteredEmployees,
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
      pageInput,
      paginatedEmployees,
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



<style scoped>
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
  margin-right: 20px; /* 设置按钮之间的间距 */
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
.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  cursor: pointer;
  width: 30px; /* 设置按钮的宽度 */
  height: 30px; /* 设置按钮的高度 */
  padding: 0; /* 去除内边距 */
  transition: transform 0.3s ease, filter 0.3s ease; /* 添加过渡效果 */
}

/* 设置关闭图标的样式 */
.close-icon {
  width: 100%; /* 图像宽度适应按钮 */
  height: 100%; /* 图像高度适应按钮 */
  object-fit: contain; /* 保持图像的纵横比 */
}
.close-button:hover .close-icon {
  transform: scale(1.1); /* 悬停时放大 */
  filter: brightness(1.2); /* 悬停时增加亮度 */
}

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
  padding-bottom: 60px; /* 为表单底部留出空间 */
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

/* Right-aligned confirm button */
.confirm-button {
  position: absolute;
  width: 15%;
  bottom: 10px;
  right: 10px;
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
