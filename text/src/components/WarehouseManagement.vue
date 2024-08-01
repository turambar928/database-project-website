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
        <option value="">高耗品</option>
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
      <button class="btn search" @click="search">搜索</button>
      <button class="btn add" @click="addItem">添加</button>
      <button class="btn restock" @click="restock">进货</button>
    </div>
    <table>
      <thead>
      <tr>
        <th>食材ID</th>
        <th>食材名</th>
        <th>数量</th>
        <th>高耗品等级</th>
        <th>保质期</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in items" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.quantity }}</td>
        <td>{{ item.grade }}</td>
        <td>{{ item.expiry }}</td>
      </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button @click="prevPage">«</button>
      <span v-for="page in totalPages" :key="page" @click="goToPage(page)">{{ page }}</span>
      <button @click="nextPage">»</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WarehouseManagement',
  data() {
    return {
      searchName: '',
      searchID: '',
      searchGrade: '',
      searchExpiry: '',
      items: [
        // 示例数据
        { id: 1, name: '食材A', quantity: 100, grade: 'A', expiry: '6 months' },
        { id: 2, name: '食材B', quantity: 50, grade: 'B', expiry: '1 month' },
        // 添加更多食材
      ],
      currentPage: 1,
      totalPages: 5,
    };
  },
  methods: {
    search() {
      // 搜索逻辑
    },
    addItem() {
      // 添加食材逻辑
    },
    restock() {
      // 进货逻辑
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

.btn {
  padding: 5px 10px;
  margin: 2px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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
</style>
