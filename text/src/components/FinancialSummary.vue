<template>
  <div class="financial-summary">
    <h2>财务总表</h2>
    <div class="search-bar">
      <select v-model="searchSource">
        <option value="">来源</option>
        <!-- Add other sources as needed -->
        <option value="sourceA">来源A</option>
        <option value="sourceB">来源B</option>
      </select>
      <select v-model="searchType">
        <option value="">收支</option>
        <option value="income">收入</option>
        <option value="expense">支出</option>
      </select>
      <select v-model="searchDate">
        <option value="">时间</option>
        <option value="2024-01-01">2024-01-01</option>
        <option value="2024-01-02">2024-01-02</option>
      </select>
      <button class="btn search" @click="search">搜索</button>
    </div>
    <div class="summary">
      <label>合计收支：</label>
      <input type="text" v-model="totalAmount" readonly />
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
      <tr v-for="item in items" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.source }}</td>
        <td>{{ item.applicant }}</td>
        <td>{{ item.auditor }}</td>
        <td>{{ item.amount }}</td>
        <td>{{ item.date }}</td>
        <td>{{ item.type }}</td>
        <td>{{ item.status }}</td>
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
  name: 'FinancialSummary',
  data() {
    return {
      searchSource: '',
      searchType: '',
      searchDate: '',
      totalAmount: 0,
      items: [
        // 示例数据
        { id: 1, source: '来源A', applicant: '申请人A', auditor: '审核人A', amount: 100, date: '2024-01-01', type: '收入', status: '通过' },
        { id: 2, source: '来源B', applicant: '申请人B', auditor: '审核人B', amount: 200, date: '2024-01-02', type: '支出', status: '不通过' },
        // 添加更多数据
      ],
      currentPage: 1,
      totalPages: 5,
    };
  },
  methods: {
    search() {
      // 搜索逻辑
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
  align-items: center;
  margin-bottom: 10px;
}

.summary label {
  margin-right: 10px;
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
</style>
