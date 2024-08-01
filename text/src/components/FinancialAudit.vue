<template>
  <div class="financial-audit">
    <h2>财务审核</h2>
    <table>
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
      <tr v-for="item in items" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.source }}</td>
        <td>{{ item.applicant }}</td>
        <td>{{ item.voucher }}</td>
        <td>{{ item.amount }}</td>
        <td>{{ item.date }}</td>
        <td>{{ item.type }}</td>
        <td>
          <button class="btn approve" @click="approve(item.id)">通过</button>
          <button class="btn reject" @click="reject(item.id)">不通过</button>
        </td>
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
  name: 'FinancialAudit',
  data() {
    return {
      items: [
        // 示例数据
        { id: 1, source: '来源A', applicant: '申请人A', voucher: '文件A', amount: 100, date: '2024-01-01', type: '收入' },
        { id: 2, source: '来源B', applicant: '申请人B', voucher: '文件B', amount: 200, date: '2024-01-02', type: '支出' },
        // 添加更多数据
      ],
      currentPage: 1,
      totalPages: 5,
    };
  },
  methods: {
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
  width: 100%;
  padding: 20px;
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
</style>
