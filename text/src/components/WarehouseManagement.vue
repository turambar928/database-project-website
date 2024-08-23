<template>
  <div class="warehouse-management">
    <h2>仓库管理</h2>
    <div class="search-bar">
      <input type="text" placeholder="食材名" v-model="searchName" />
      <select v-model="searchID">
        <option value="">ID</option>
        <!-- Add other IDs as needed -->
        <option value="1">1</option>
        <option value="2">2</option>
      </select>
      <select v-model="searchGrade">
        <option value="">高耗品等级</option>
        <!-- Add other grades as needed -->
        <option value="A">A</option>
        <option value="B">B</option>
      </select>
      <select v-model="searchExpiry">
        <option value="">保质期</option>
        <!-- Add other expiry dates as needed -->
        <option value="1 month">1 month</option>
        <option value="6 months">6 months</option>
      </select>
      <!-- 搜索按钮 -->
      <button @click="openSearchItem" class="btn blue">搜索</button>

      <!-- 进货按钮 -->
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
      <tr v-for="i in itemsPerPage" :key="i" class="table-row">
        <td>{{ paginatedItems[i - 1] ? paginatedItems[i - 1].id : '' }}</td>
        <td>{{ paginatedItems[i - 1] ? paginatedItems[i - 1].name : '' }}</td>
        <td>{{ paginatedItems[i - 1] ? paginatedItems[i - 1].quantity : '' }}</td>
        <td>{{ paginatedItems[i - 1] ? paginatedItems[i - 1].grade : '' }}</td>
        <td>{{ paginatedItems[i - 1] ? paginatedItems[i - 1].expiry : '' }}</td>
        <td>
          <button v-if="paginatedItems[i - 1]" class="btn yellow" @click="editItem(paginatedItems[i - 1])">修改</button>
          <button v-if="paginatedItems[i - 1]" class="btn red" @click="deleteItem(paginatedItems[i - 1].id)">删除</button>
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
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
          </div>
          <div class="form-group">
            <label for="newExpiry">保质期</label>
            <select id="newExpiry" v-model="newItem.expiry">
              <option value="1 month">1 month</option>
              <option value="6 months">6 months</option>
            </select>
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
        <form @submit.prevent="confirmSearchItem">
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
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
          </div>
          <div class="form-group">
            <label for="searchExpiry">保质期</label>
            <select id="searchExpiry" v-model="searchExpiry">
              <option value="1 month">1 month</option>
              <option value="6 months">6 months</option>
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
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
          </div>
          <div class="form-group">
            <label for="restockExpiry">保质期</label>
            <select id="restockExpiry" v-model="restockItem.expiry">
              <option value="1 month">1 month</option>
              <option value="6 months">6 months</option>
            </select>
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
            <input type="text" id="editName" v-model="selectedItem.name" />
          </div>
          <div class="form-group">
            <label for="editQuantity">数量</label>
            <input type="number" id="editQuantity" v-model="selectedItem.quantity" />
          </div>
          <div class="form-group">
            <label for="editGrade">高耗品等级</label>
            <select id="editGrade" v-model="selectedItem.grade">
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
          </div>
          <div class="form-group">
            <label for="editExpiry">保质期</label>
            <select id="editExpiry" v-model="selectedItem.expiry">
              <option value="1 month">1 month</option>
              <option value="6 months">6 months</option>
            </select>
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
      items: [
        // 示例数据
        { id: 1, name: '食材A', quantity: 100, grade: 'A', expiry: '6 months' },
        { id: 2, name: '食材B', quantity: 50, grade: 'B', expiry: '1 month' },
        // 添加更多食材
      ],
      filteredItems: [], // 用于存储过滤后的食材列表
      currentPage: 1,
      itemsPerPage: 8,
      showAddItem: false, // 控制添加食材弹出框的显示
      showEditItem: false, // 控制编辑食材信息弹出框的显示
      selectedItem: {},
      newItem: { name: '', quantity: '', grade: 'A', expiry: '1 month' },
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.itemsPerPage);
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredItems.slice(start, end);
    }
  },
  mounted() {
    this.filteredItems = this.items; // 初始化时显示所有食材
  },
  methods: {
    async search() {
      try {
        const response = await axios.get('http://127.0.0.1:4523/m1/4808550-4462943-default/api/ingredients/search', { params: this.filteredItems });
        if (response.status === 200) {
          // 使用过滤后的食材列表更新数据
          this.filteredItems = this.items.filter(item => {
            return (
                (!this.searchName || item.name.includes(this.searchName)) &&
                (!this.searchID || item.id == this.searchID) &&
                (!this.searchGrade || item.grade === this.searchGrade) &&
                (!this.searchExpiry || item.expiry === this.searchExpiry)
            );
          });
          this.currentPage = 1; // 搜索后重置到第一页
        } else {
          console.error('搜索失败', response);
        }
      } catch (error) {
        console.error('请求失败', error);
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



    async confirmAddItem() {
      // 添加食材逻辑 - 调用 Apifox Mock 接口
      try {
        const response = await axios.post('http://127.0.0.1:4523/m1/4808550-4462943-default/api/ingredients/add', this.newItem);
        if (response.status === 200) {
          // 添加成功，将新食材加入到列表
          const newId = this.items.length ? this.items[this.items.length - 1].id + 1 : 1;
          const newItem = { ...this.newItem, id: newId };
          this.items.push(newItem);
          this.filteredItems = [...this.items]; // 同步更新过滤后的食材列表
          this.closeAddItem();
          this.resetNewItem();
        } else {
          console.error('添加食材失败', response);
        }
      } catch (error) {
        console.error('请求失败', error);
      }
    },
    resetNewItem() {
      this.newItem = { name: '', quantity: '', grade: 'A', expiry: '1 month' };
    },
    editItem(item) {

      this.selectedItem = { ...item };
      this.showEditItem = true;
    },
    closeEditItem() {
      this.showEditItem = false;
    },
    async confirmEditItem() {
      // 更新食材信息逻辑
      //修改食材-调用apifox的mock
      try {
        const response = await axios.put('http://127.0.0.1:4523/m1/4808550-4462943-default/api/ingredients/update', this.selectedItem, this.showEditItem);
        if (response.status === 200) {
          const index = this.items.findIndex(i => i.id === this.selectedItem.id);
          if (index !== -1) {
            this.items.splice(index, 1, this.selectedItem); // 使用 splice 更新食材信息
            this.filteredItems = [...this.items]; // 同步更新过滤后的食材列表
          }
          this.showEditItem = false;
        } else {
          console.error('修改食材失败', response);

        }
      }
      catch (error) {
        console.error('请求失败',error);
      }
    },
    async deleteItem(itemId) {
      try {
        // 使用模板字符串将 itemId 作为 URL 的一部分传递
        const response = await axios.delete('http://127.0.0.1:4523/m1/4808550-4462943-default/api/ingredients/delete',this.item);

        if (response.status === 200) {
          // 删除成功
          this.items = this.items.filter(i => i.id !== itemId);
          this.filteredItems = this.items; // 同步更新过滤后的食材列表
          console.log('删除成功');
        } else {
          console.error('删除失败', response);
        }
      } catch (error) {
        console.error('请求失败', error);
      }
    },


    async restock() {
      try {
        const response = await axios.post('http://127.0.0.1:4523/m1/4808550-4462943-default/api/ingredients/restock', this.item);

        if (response.status === 200) {
          // 处理成功响应
          const restockedItem = response.data; // 假设返回的数据是补货后的商品信息

          // 查找并更新库存列表中的对应商品
          const index = this.items.findIndex(i => i.id === restockedItem.id);
          if (index !== -1) {
            this.items[index].quantity += restockedItem.restockedQuantity; // 假设返回的有一个 restockedQuantity 表示补货的数量
          } else {
            console.warn('未找到对应的商品', restockedItem);
          }

          // 同步更新过滤后的食材列表
          this.filteredItems = [...this.items];

          console.log('进货成功');
        } else {
          console.error('进货失败', response);
        }
      } catch (error) {
        console.error('请求失败', error);
        // 你可以在这里添加用户提示，比如 alert 或在页面上显示错误信息
      }
    },


    openSearchItem() {
      this.showSearchItem = true;
    },
    closeSearchItem() {
      this.showSearchItem = false;
    },
    confirmSearchItem() {
      this.search(); // 调用现有的 search 方法
      this.closeSearchItem();
    },
    openRestockItem() {
      this.showRestockItem = true;
    },
    closeRestockItem() {
      this.showRestockItem = false;
    },
    confirmRestockItem() {
      this.restock(); // 调用现有的 restock 方法
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
  height: 50px; /* 固定行高 */
}

.btn {
  padding: 10px 20px; /* 调整 padding 以确保按钮具有相同的高度 */
  margin: 2px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100px; /* 设定固定宽度，使按钮具有相同的宽度 */
  text-align: center;
}

.btn.search {
  background-color: #4CAF50; /* 绿色 */
  color: white;
}

.btn.add {
  background-color: #f0ad4e; /* 黄色 */
  color: white;
}

.btn.restock {
  background-color: #0275d8; /* 蓝色 */
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