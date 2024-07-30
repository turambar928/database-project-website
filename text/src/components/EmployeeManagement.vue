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
            <tr v-for="employee in filteredEmployees" :key="employee.id">
              <td>{{ employee.id }}</td>
              <td>{{ employee.name }}</td>
              <td>{{ employee.idNumber }}</td>
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
                <input v-model="employeeForm.idNumber" required class="input-field" />
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
  import { ref, reactive, computed } from 'vue';
  
  export default {
    setup() {
      const employees = ref([]);
      const isModalVisible = ref(false);
      const isBatchModalVisible = ref(false);
      const isEditing = ref(false);
      const employeeForm = reactive({
        id: null,
        name: '',
        idNumber: '',
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
      const selectedEmployees = ref([]);
      const selectAll = ref(false);
  
      const fetchEmployees = () => {
        // Fetch employee data from the server (this is just a mock)
        employees.value = [
          { id: 1, name: '胡英俊', idNumber: '100', phone: '110', address: '翻斗大街', position: '员工', salary: 500, paid: false },
          { id: 2, name: '牛爷爷', idNumber: '200', phone: '119', address: '翻斗花园', position: '经理', salary: 5000, paid: false }
        ];
        totalPages.value = 1;
      };
      //计算属性，根据输入条件完成过滤
      const filteredEmployees = computed(() => {
        return employees.value.filter(employee => {
          return (
            (!searchName.value || employee.name.includes(searchName.value)) &&
            (!searchPosition.value || employee.position === searchPosition.value)
          );
        });
      });
     //添加模态框
      const showAddModal = () => {
        isEditing.value = false;
        resetForm();
        isModalVisible.value = true;
      };
     //编辑模态框
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
  
      const addEmployee = () => {
        const newEmployee = { ...employeeForm, id: Date.now(), paid: false };
        employees.value.push(newEmployee);
        closeModal();
      };
  
      const updateEmployee = () => {
        const index = employees.value.findIndex(employee => employee.id === employeeForm.id);
        employees.value.splice(index, 1, { ...employeeForm });
        closeModal();
      };
  
      const deleteEmployee = (id) => {
        employees.value = employees.value.filter(employee => employee.id !== id);
      };
  
      const batchPaySalary = () => {
        selectedEmployees.value.forEach(id => {
          const employee = employees.value.find(emp => emp.id === id);
          if (employee) {
            employee.paid = true;
            console.log(`Paid salary to ${employee.name}`);
          }
        });
        closeBatchModal();
      };
  
      const resetForm = () => {
        employeeForm.id = null;
        employeeForm.name = '';
        employeeForm.idNumber = '';
        employeeForm.phone = '';
        employeeForm.address = '';
        employeeForm.position = '';
        employeeForm.salary = '';
      };
  
      const search = () => {
        fetchEmployees();
      };
  
      const toggleSelectAll = () => {
        if (selectAll.value) {
          selectedEmployees.value = employees.value.map(employee => employee.id);
        } else {
          selectedEmployees.value = [];
        }
      };
  
      const changePage = (page) => {
        if (page >= 1 && page <= totalPages.value) {
          currentPage.value = page;
          fetchEmployees();
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
  /* Add your styles here */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .search-add-container {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .input-field {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .button.primary {
    background-color: #007bff;
    color: white;
  }
  
  .button.primary:hover {
    background-color: #0056b3;
  }
  
  .button.success {
    background-color: #28a745;
    color: white;
  }
  
  .button.success:hover {
    background-color: #218838;
  }
  
  .button.warning {
    background-color: #ffc107;
    color: white;
  }
  
  .button.warning:hover {
    background-color: #e0a800;
  }
  
  .button.danger {
    background-color: #dc3545;
    color: white;
  }
  
  .button.danger:hover {
    background-color: #c82333;
  }
  
  .table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .table th, .table td {
    padding: 12px;
    border: 1px solid #ddd;
    text-align: left;
  }
  
  .table th {
    background-color: #f8f9fa;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    position: relative;
  }
  
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    font-size: 18px;
    cursor: pointer;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
  
  button {
    margin: 0 5px;
  }
  </style>
  