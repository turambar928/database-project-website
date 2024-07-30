<template>
    <div>
      <h1>上任志愿者管理</h1>
      <div class="search-bar">
        <input v-model="searchName" placeholder="姓名" />
        <select v-model="searchCriteria">
          <option value="score">得分</option>
        </select>
        <button @click="search">🔍</button>
        <button @click="addVolunteer">➕</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>姓名</th>
            <th>身份证号</th>
            <th>电话</th>
            <th>接单次数</th>
            <th>得分</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="volunteer in filteredVolunteers" :key="volunteer.id">
            <td>{{ volunteer.id }}</td>
            <td>{{ volunteer.name }}</td>
            <td>{{ volunteer.idNumber }}</td>
            <td>{{ volunteer.phone }}</td>
            <td>{{ volunteer.orderCount }}</td>
            <td>{{ volunteer.score }}</td>
            <td>
              <button class="edit-button" @click="editVolunteer(volunteer)">修改</button>
              <button class="delete-button" @click="deleteVolunteer(volunteer.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="showEditDialog" class="edit-dialog">
        <div class="dialog-content">
          <h2>{{ editMode ? '修改志愿者' : '添加志愿者' }}</h2>
          <label>姓名: <input v-model="editVolunteerData.name" /></label>
          <label>身份证号: <input v-model="editVolunteerData.idNumber" /></label>
          <label>电话: <input v-model="editVolunteerData.phone" /></label>
          <label>接单次数: <input type="number" v-model="editVolunteerData.orderCount" /></label>
          <label>得分: <input type="number" step="0.1" v-model="editVolunteerData.score" /></label>
          <div class="dialog-actions">
            <button @click="saveVolunteer">{{ editMode ? '保存' : '添加' }}</button>
            <button @click="closeEditDialog">取消</button>
          </div>
          <button class="close-dialog" @click="closeEditDialog">X</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchName: '',
        searchCriteria: 'score',
        volunteers: [
          { id: 1, name: 'a', idNumber: '500', phone: '500', orderCount: 1, score: 4.5 },
          { id: 2, name: 'a', idNumber: '500', phone: '500', orderCount: 3, score: 5.0 }
        ],
        filteredVolunteers: [],
        showEditDialog: false,
        editMode: false,
        editVolunteerData: {
          id: null,
          name: '',
          idNumber: '',
          phone: '',
          orderCount: 0,
          score: 0
        }
      };
    },
    methods: {
      search() {
        this.filteredVolunteers = this.volunteers.filter(v => 
          v.name.includes(this.searchName) &&
          (this.searchCriteria === 'score' ? v.score : true)
        );
      },
      addVolunteer() {
        this.editMode = false;
        this.editVolunteerData = { id: null, name: '', idNumber: '', phone: '', orderCount: 0, score: 0 };
        this.showEditDialog = true;
      },
      editVolunteer(volunteer) {
        this.editMode = true;
        this.editVolunteerData = { ...volunteer };
        this.showEditDialog = true;
      },
      saveVolunteer() {
    if (this.editMode) {
      // 如果是在编辑模式下，通过ID找到对应的志愿者并更新数据
      const index = this.volunteers.findIndex(v => v.id === this.editVolunteerData.id);
      if (index !== -1) {
        // 使用splice方法替换数组中的数据
        this.volunteers.splice(index, 1, this.editVolunteerData);
      }
    } else {
      // 如果是在添加模式下，设置新志愿者的ID并添加到volunteers数组中
      this.editVolunteerData.id = this.volunteers.length + 1;
      this.volunteers.push({ ...this.editVolunteerData });
    }
    // 关闭编辑对话框
    this.closeEditDialog();
    // 重新执行搜索以更新显示的志愿者列表
    this.search();
    },
      deleteVolunteer(id) {
        this.volunteers = this.volunteers.filter(v => v.id !== id);
        this.search();
      },
      closeEditDialog() {
        this.showEditDialog = false;
      }
    },
    mounted() {
      this.search();
    }
  };
  </script>
  
  <style scoped>
  .search-bar {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .search-bar input, .search-bar select {
    margin-right: 10px;
    padding: 5px;
  }
  
  .search-bar button {
    cursor: pointer;
    padding: 5px 10px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }
  
  th {
    background-color: #f2f2f2;
  }
  
  button {
    cursor: pointer;
    padding: 5px 10px;
    margin: 5px;
  }
  
  .edit-button {
    background-color: #4CAF50;
    color: white;
  }
  
  .delete-button {
    background-color: #f44336;
    color: white;
  }
  
  .edit-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border: 1px solid #ddd;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
  
  .dialog-content {
    position: relative;
  }
  
  .dialog-content h2 {
    margin-top: 0;
  }
  
  label {
    display: block;
    margin-bottom: 10px;
  }
  
  .dialog-actions {
    display: flex;
    justify-content: space-between;
  }
  
  .close-dialog {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
  }
  </style>
  