<template>
  <div class="financial-summary">
    <h2>财务总表</h2>
    <div class="search-bar">
      <select v-model="searchSource">
        <option value="">来源</option>
        <option value="捐赠">捐赠</option>
        <option value="进货">进货</option>
        <option value="工资">工资</option>
        <option value="点单">点单</option>
        <option value="订单">订单</option>
      </select>
      <select v-model="searchType">
        <option value="">收支</option>
        <option value="1">收入</option>
        <option value="0">支出</option>
      </select>
      <input type="date" v-model="searchDate" />
      <button class="btn search" @click="search">搜索</button>
    </div>
    <div class="summary">
      <div class="summary-item">
        <label>净收入：</label>
        <input type="text" v-model="netIncome" readonly />
      </div>
      <div class="summary-item">
        <label>总收入：</label>
        <input type="text" v-model="totalIncome" readonly />
      </div>
      <div class="summary-item">
        <label>总支出：</label>
        <input type="text" v-model="totalExpense" readonly />
      </div>
    </div>
    <table>
      <thead>
      <tr>
        <th>流水号</th>
        <th>来源</th>
        <th>申请人</th>
        <th>审核人</th>
        <th>金额</th>
        <th>时间</th>
        <th>收支</th>
        <th>审核状态</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in paginatedItems" :key="item.financeId" class="table-row">
        <td>{{ item.financeId }}</td>
        <td>{{ item.financeType }}</td>
        <td>{{ item.accountId }}</td>
        <td>{{ item.administratorId }}</td>
        <td>{{ item.price }}</td>
        <td>{{ item.financeDate }}</td>
        <td>{{ item.inOrOut === '1' ? '收入' : '支出' }}</td>
        <td>{{ item.status }}</td>
      </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">«</button>
      <span v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="{'active': currentPage === page}">{{ page }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">»</button>
    </div>
  </div>
</template>

<script>


export default {
  name: 'FinancialSummary',
  data() {
    return {
      searchSource: '',
      searchType: '',
      searchDate: '',
      netIncome: 0,   // 新增净收入字段
      totalIncome: 0, // 新增总收入字段
      totalExpense: 0, // 新增总支出字段
      items: [],
      filteredItems: [],
      currentPage: 1,
      itemsPerPage: 8,
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
    },
  },
  mounted() {
    this.fetchData(); // 初始化时获取数据
    this.fetchTotal(); // 初始化时获取总收入、总支出和净收入
  },
  methods: {
    async fetchData() {
      try {
        const formattedDate = this.searchDate ? this.searchDate : '';
        const response = await fetch(`http://8.136.125.61/api/Finance/financial-records?financeType=${this.searchSource}&inOrOut=${this.searchType}&financeDate=${formattedDate}`);
        const data = await response.json();
        this.items = data.response || [];
        this.filteredItems = this.items;
      } catch (error) {
        console.error('数据获取错误:', error);
      }
    },
    async fetchTotal() {
      try {
        const response = await fetch(`http://8.136.125.61/api/Finance/getTotal`);
        const data = await response.json();
        this.netIncome = data.response.netIn; // 设置净收入
        this.totalIncome = data.response.totalIn; // 设置总收入
        this.totalExpense = data.response.totalOut; // 设置总支出
      } catch (error) {
        console.error('获取总收入、总支出和净收入时发生错误:', error);
      }
    },
    search() {
      this.fetchData(); // 通过API获取过滤后的数据
      this.fetchTotal(); // 同时获取最新的总收入、总支出和净收入
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
  },
};
</script>

<style scoped>
.financial-summary {
  width: 100%;
  padding: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar select {
  margin-right: 10px;
}

.summary {
  display: flex;
  justify-content: space-around; /* 均匀分布 */
  margin-bottom: 10px;
}

.summary-item {
  display: flex;
  align-items: center;
}

.summary label {
  margin-right: 5px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
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
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn.search {
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

.pagination .active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
