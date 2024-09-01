<template>
  <div class="warehouse-management">
    <h2>仓库管理</h2>
    <div class="search-bar">
      <input type="text" placeholder="食材名" v-model="searchName" />
      <select v-model="searchID">
        <option value="">ID</option>
        <option value="1">1</option>
        <option value="2">2</option>
      </select>
      <select v-model="searchGrade">
        <option value="">高耗品等级</option>
        <option value="1">1</option>
        <option value="2">2</option>
      </select>
      <select v-model="searchExpiry">
        <option value="">保质期</option>
        <option value="2024-09-11">2024-09-11</option>
        <option value="2024-08-30">2024-08-30</option>
      </select>
      <!-- 搜索按钮 -->
      <button @click="searchWarehouse" class="btn blue">搜索</button>
      <button @click="openRestockItem" class="btn green">进货</button>
      <button class="btn add" @click="addItem">添加</button>
    </div>
    <table>
      <thead>
      <tr>
        <th>食材ID</th>
        <th>食材名</th>
        <th>数量</th>
        <th>高耗品等级</th>
        <th>保质期</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in paginatedItems" :key="index" class="table-row">
        <td>{{ item.ingredientId }}</td>
        <td>{{ item.ingredientName }}</td>
        <td>{{ item.amount }}</td>
        <td>{{ item.grade }}</td>
        <td>{{ item.expiry }}</td>
        <td>
          <button class="btn yellow" @click="editItem(item)">修改</button>
          <button class="btn red" @click="deleteItem(item.ingredientId)">删除</button>
        </td>
      </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">«</button>
      <span v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="{'active': currentPage === page}">{{ page }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">»</button>
    </div>

    <!-- 添加食材弹出框 -->
    <div v-if="showAddItem" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeAddItem">&times;</span>
        <h3>添加食材</h3>
        <form @submit.prevent="confirmAddItem">
          <div class="form-group">
            <label for="newName">食材名</label>
            <input type="text" id="newName" v-model="newItem.name" />
          </div>
          <div class="form-group">
            <label for="newQuantity">数量</label>
            <input type="number" id="newQuantity" v-model="newItem.quantity" />
          </div>
          <div class="form-group">
            <label for="newGrade">高耗品等级</label>
            <select id="newGrade" v-model="newItem.grade">
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>
          <div class="form-group">
            <label for="newExpiry">保质期</label>
            <input type="date" id="newExpiry" v-model="newItem.expiry" />
          </div>
          <button type="submit" class="btn green">确认</button>
        </form>
      </div>
    </div>

    <!-- 搜索食材弹出框 -->
    <div v-if="showSearchItem" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeSearchItem">&times;</span>
        <h3>搜索食材</h3>
        <form @submit.prevent="searchWarehouse">
          <div class="form-group">
            <label for="searchName">食材名</label>
            <input type="text" id="searchName" v-model="searchName" />
          </div>
          <div class="form-group">
            <label for="searchID">食材ID</label>
            <input type="text" id="searchID" v-model="searchID" />
          </div>
          <div class="form-group">
            <label for="searchGrade">高耗品等级</label>
            <select id="searchGrade" v-model="searchGrade">
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>
          <div class="form-group">
            <label for="searchExpiry">保质期</label>
            <select id="searchExpiry" v-model="searchExpiry">
              <option value="2024-09-11">2024-09-11</option>
              <option value="2024-08-30">2024-08-30</option>
            </select>
          </div>
          <button type="submit" class="btn green">确认</button>
        </form>
      </div>
    </div>

    <!-- 进货食材弹出框 -->
    <div v-if="showRestockItem" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeRestockItem">&times;</span>
        <h3>进货食材</h3>
        <form @submit.prevent="confirmRestockItem">
          <div class="form-group">
            <label for="restockName">食材名</label>
            <input type="text" id="restockName" v-model="restockItem.name" />
          </div>
          <div class="form-group">
            <label for="restockQuantity">数量</label>
            <input type="number" id="restockQuantity" v-model="restockItem.quantity" />
          </div>
          <div class="form-group">
            <label for="restockGrade">高耗品等级</label>
            <select id="restockGrade" v-model="restockItem.grade">
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>
          <div class="form-group">
            <label for="restockExpiry">保质期</label>
            <input type="date" id="restockExpiry" v-model="restockItem.expiry" />
          </div>
          <button type="submit" class="btn green">确认</button>
        </form>
      </div>
    </div>

    <!-- 修改食材信息弹出框 -->
    <div v-if="showEditItem" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeEditItem">&times;</span>
        <h3>修改食材信息</h3>
        <form @submit.prevent="confirmEditItem">
          <div class="form-group">
            <label for="editName">食材名</label>
            <input type="text" id="editName" v-model="selectedItem.ingredientName" />
          </div>
          <div class="form-group">
            <label for="editQuantity">数量</label>
            <input type="number" id="editQuantity" v-model="selectedItem.amount" />
          </div>
          <div class="form-group">
            <label for="editGrade">高耗品等级</label>
            <select id="editGrade" v-model="selectedItem.grade">
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>
          <div class="form-group">
            <label for="editExpiry">保质期</label>
            <input type="date" id="editExpiry" v-model="selectedItem.expiry" />
          </div>
          <button type="submit" class="btn green">确认</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'WarehouseManagement',
  data() {
    return {
      showSearchItem: false,
      showRestockItem: false,
      searchName: '',
      searchID: '',
      searchGrade: '',
      searchExpiry: '',
      restockItem: {
        name: '',
        quantity: 0,
        grade: '',
        expiry: ''
      },
      items: [], // 初始化为一个空数组
      filteredItems: [], // 初始化为一个空数组
      currentPage: 1,
      itemsPerPage: 8,
      showAddItem: false,
      showEditItem: false,
      selectedItem: {},
      newItem: { name: '', quantity: '', grade: '1', expiry: '2024-09-11' },
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.itemsPerPage);
    },
    paginatedItems() {
      if (!Array.isArray(this.filteredItems)) {
        return [];
      }
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredItems.slice(start, end);
    }
  },
  mounted() {
    this.fetchWarehouseData(); // 初始化时从后端加载数据
  },
  methods: {
    async fetchWarehouseData() {
      try {
        const response = await axios.get('http://8.136.125.61/api/repo/search/', {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxNjgwMDAwMiIsInJvbGUiOiJhZG1pbiIsIm5iZiI6MTcyNTEyMjMxNywiZXhwIjoyMDg1MTIyMzE3LCJpYXQiOjE3MjUxMjIzMTcsImlzcyI6InlvdXJfaXNzdWVyIiwiYXVkIjoieW91cl9hdWRpZW5jZSJ9.iuxCr68lU34uW5KsZj2c15bwTFsdiguorpWyo_6quP0'
          }
        });

        if (response.status === 200 && response.data.success) {
          this.items = Array.isArray(response.data.ingredients) ? response.data.ingredients : [];
          this.filteredItems = [...this.items];
        } else {
          console.error('加载仓库数据失败', response.data.message || response);
        }
      } catch (error) {
        console.error('请求失败', error.response ? error.response.data : error.message);
      }
    },

    async searchWarehouse() {
      try {
        const response = await axios.get('http://8.136.125.61/api/repo/search/', {
          params: {
            name: this.searchName || undefined,
            id: this.searchID || undefined,
            grade: this.searchGrade || undefined,
            expiry: this.searchExpiry || undefined
          },
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxNjgwMDAwMiIsInJvbGUiOiJhZG1pbiIsIm5iZiI6MTcyNTEyMjMxNywiZXhwIjoyMDg1MTIyMzE3LCJpYXQiOjE3MjUxMjIzMTcsImlzcyI6InlvdXJfaXNzdWVyIiwiYXVkIjoieW91cl9hdWRpZW5jZSJ9.iuxCr68lU34uW5KsZj2c15bwTFsdiguorpWyo_6quP0'
          }
        });

        if (response.status === 200 && response.data.success) {
          this.filteredItems = Array.isArray(response.data.ingredients) ? response.data.ingredients : [];
          this.currentPage = 1;
        } else {
          console.error('搜索失败', response.data.message || response);
        }
      } catch (error) {
        console.error('请求失败', error.response ? error.response.data : error.message);
      }
    },

    async confirmAddItem() {
      const requestPayload = {
        name: this.newItem.name,
        quantity: this.newItem.quantity,
        grade: this.newItem.grade,
        expiry: this.newItem.expiry
      };

      try {
        const response = await axios.post('http://8.136.125.61/api/ingredients/add', requestPayload, {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxNjgwMDAwMiIsInJvbGUiOiJhZG1pbiIsIm5iZiI6MTcyNTEyMjMxNywiZXhwIjoyMDg1MTIyMzE3LCJpYXQiOjE3MjUxMjIzMTcsImlzcyI6InlvdXJfaXNzdWVyIiwiYXVkIjoieW91cl9hdWRpZW5jZSJ9.iuxCr68lU34uW5KsZj2c15bwTFsdiguorpWyo_6quP0',
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 200 && response.data.success) {
          console.log('食材添加成功');
          this.fetchWarehouseData();  // 刷新仓库数据
          this.closeAddItem();        // 关闭添加食材的弹出框
          this.resetNewItem();        // 重置表单
        } else {
          console.error('添加食材失败', response.data.message || response);
          alert(response.data.message);
        }
      } catch (error) {
        console.error('请求失败', error.response ? error.response.data : error.message);
      }
    },

    resetNewItem() {
      this.newItem = { name: '', quantity: 0, grade: '1', expiry: '2024-09-11' };
    },

    editItem(item) {
      this.selectedItem = { ...item };
      this.showEditItem = true;
    },

    closeEditItem() {
      this.showEditItem = false;
    },

    async confirmEditItem() {
      try {
        const response = await axios.put('http://8.136.125.61/api/ingredients/update', this.selectedItem, {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxNjgwMDAwMiIsInJvbGUiOiJhZG1pbiIsIm5iZiI6MTcyNTEyMjMxNywiZXhwIjoyMDg1MTIyMzE3LCJpYXQiOjE3MjUxMjIzMTcsImlzcyI6InlvdXJfaXNzdWVyIiwiYXVkIjoieW91cl9hdWRpZW5jZSJ9.iuxCr68lU34uW5KsZj2c15bwTFsdiguorpWyo_6quP0',
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 200 && response.data.success) {
          const index = this.items.findIndex(i => i.id === this.selectedItem.id);
          if (index !== -1) {
            this.items.splice(index, 1, this.selectedItem);
            this.filteredItems = [...this.items];
          }
          this.showEditItem = false;
        } else {
          console.error('修改食材失败', response.data.message || response);
        }
      } catch (error) {
        console.error('请求失败', error.response ? error.response.data : error.message);
      }
    },

    async deleteItem(itemId) {
      try {
        const response = await axios.delete(`http://8.136.125.61/api/repo/delete`, {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxNjgwMDAwMiIsInJvbGUiOiJhZG1pbiIsIm5iZiI6MTcyNTEyMjMxNywiZXhwIjoyMDg1MTIyMzE3LCJpYXQiOjE3MjUxMjIzMTcsImlzcyI6InlvdXJfaXNzdWVyIiwiYXVkIjoieW91cl9hdWRpZW5jZSJ9.iuxCr68lU34uW5KsZj2c15bwTFsdiguorpWyo_6quP0'
          }
        });

        if (response.status === 200 && response.data.success) {
          this.items = this.items.filter(i => i.ingredientId !== itemId);
          this.filteredItems = this.items;
          console.log('删除成功');
        } else {
          console.error('删除失败', response.data.message || response);
        }
      } catch (error) {
        console.error('请求失败', error.response ? error.response.data : error.message);
      }
    },

    async restock() {
      try {
        const response = await axios.post('http://8.136.125.61/api/ingredients/restock', this.restockItem, {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxNjgwMDAwMiIsInJvbGUiOiJhZG1pbiIsIm5iZiI6MTcyNTEyMjMxNywiZXhwIjoyMDg1MTIyMzE3LCJpYXQiOjE3MjUxMjIzMTcsImlzcyI6InlvdXJfaXNzdWVyIiwiYXVkIjoieW91cl9hdWRpZW5jZSJ9.iuxCr68lU34uW5KsZj2c15bwTFsdiguorpWyo_6quP0',
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 200 && response.data.success) {
          const restockedItem = response.data;
          const index = this.items.findIndex(i => i.id === restockedItem.id);
          if (index !== -1) {
            this.items[index].quantity += restockedItem.restockedQuantity;
          } else {
            this.items.push(restockedItem);
          }
          this.filteredItems = [...this.items];
          console.log('进货成功');
        } else {
          console.error('进货失败', response.data.message || response);
        }
      } catch (error) {
        console.error('请求失败', error.response ? error.response.data : error.message);
      }
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

    addItem() {
      this.showAddItem = true;
    },

    closeAddItem() {
      this.showAddItem = false;
    },

    openSearchItem() {
      this.showSearchItem = true;
    },

    closeSearchItem() {
      this.showSearchItem = false;
    },

    openRestockItem() {
      this.showRestockItem = true;
    },

    closeRestockItem() {
      this.showRestockItem = false;
    },

    confirmRestockItem() {
      this.restock();
      this.closeRestockItem();
    }
  }
};
</script>

<style scoped>
.warehouse-management {
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
  padding: 10px 20px;
  margin: 2px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100px;
  text-align: center;
}

.btn.search {
  background-color: #4CAF50;
  color: white;
}

.btn.add {
  background-color: #f0ad4e;
  color: white;
}

.btn.restock {
  background-color: #0275d8;
  color: white;
}

.btn.red {
  background-color: #dc3545;
  color: white;
}

.btn.yellow {
  background-color: #ffc107;
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
