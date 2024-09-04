<template>
  <div class="financial-audit">
    <h2>财务审核</h2>
    <div class="search-bar">
      <input type="text" placeholder="流水号" v-model="searchID" />
      <input type="text" placeholder="申请人" v-model="searchApplicant" />
      <button class="btn search" @click="search">搜索</button>
    </div>
    <table class="table">
      <thead>
      <tr>
        <th>流水号</th>
        <th>来源</th>
        <th>申请人</th>
        <th>凭证</th>
        <th>金额</th>
        <th>时间</th>
        <th>收支</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="i in itemsPerPage" :key="i" class="table-row">
        <td>{{ paginatedItems[i - 1] ? paginatedItems[i - 1].id : '' }}</td>
        <td>{{ paginatedItems[i - 1] ? paginatedItems[i - 1].source : '' }}</td>
        <td>{{ paginatedItems[i - 1] ? paginatedItems[i - 1].applicant : '' }}</td>
        <td>{{ paginatedItems[i - 1] ? paginatedItems[i - 1].voucher : '' }}</td>
        <td>{{ paginatedItems[i - 1] ? paginatedItems[i - 1].amount : '' }}</td>
        <td>{{ paginatedItems[i - 1] ? paginatedItems[i - 1].date : '' }}</td>
        <td>{{ paginatedItems[i - 1] ? paginatedItems[i - 1].type : '' }}</td>
        <td>
          <button v-if="paginatedItems[i - 1]" class="btn approve" @click="approve(paginatedItems[i - 1].id)">通过</button>
          <button v-if="paginatedItems[i - 1]" class="btn reject" @click="reject(paginatedItems[i - 1].id)">不通过</button>
        </td>
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
  name: 'FinancialAudit',
  data() {
    return {
      searchID: '',
      searchApplicant: '',
      items: [
        // 示例数据
        { id: 1, source: '来源A', applicant: '申请人A', voucher: '文件A', amount: 100, date: '2024-01-01', type: '收入' },
        { id: 2, source: '来源B', applicant: '申请人B', voucher: '文件B', amount: 200, date: '2024-01-02', type: '支出' },
        // 添加更多数据
      ],
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
    }
  },
  mounted() {
    this.filteredItems = this.items; // 初始化时显示所有数据
  },
  methods: {
    search() {
      // 过滤列表
      this.filteredItems = this.items.filter(item => {
        return (
            (!this.searchID || item.id.toString().includes(this.searchID)) &&
            (!this.searchApplicant || item.applicant.includes(this.searchApplicant))
        );
      });
      this.currentPage = 1; // 搜索后重置到第一页
    },
    approve(id) {
      // 通过逻辑
      alert(`审批通过: ${id}`);
    },
    reject(id) {
      // 不通过逻辑
      alert(`审批不通过: ${id}`);
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
.financial-audit {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f7fa; /* 添加背景色 */
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 轻微阴影 */
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar input {
  margin-right: 10px;
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
.btn {
  padding: 5px 10px;
  margin: 2px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn.search{
  padding: 10px 20px;
  margin: 2px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100px;
  text-align: center;
  font-size:14px;
  background-color: #0275d8; /* 蓝色 */
}
.btn.approve {
  background-color: #4CAF50; /* 绿色 */
  color: white;
}

.btn.reject {
  background-color: #f44336; /* 红色 */
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
