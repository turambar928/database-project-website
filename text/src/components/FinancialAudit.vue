<template>
  <div class="financial-audit">
    <h2>财务审核</h2>
    <div class="search-bar">
      <input type="text" placeholder="流水号" v-model="searchID" />
      <input type="text" placeholder="申请人" v-model="searchApplicant" />
      <button class="btn blue" @click="search">搜索</button>
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
      <tr v-for="item in paginatedItems" :key="item.financeId" class="table-row">
        <td>{{ item.financeId }}</td>
        <td>{{ item.financeType }}</td>
        <td>{{ item.accountId }}</td>
        <td>{{ item.proof }}</td>
        <td>{{ item.price }}</td>
        <td>{{ item.financeDate }}</td>
        <td>{{ item.inOrOut }}</td>
        <td>
          <button class="btn green" @click="updateStatus(item.financeId, '通过')">通过</button>
          <button class="btn red" @click="updateStatus(item.financeId, '不通过')">不通过</button>
        </td>
      </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">«</button>
      <span v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="{'active': currentPage === page}">{{ page }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">»</button>
    </div>

    <!-- 提示信息弹出框 -->
    <transition name="fade">
      <div v-if="showMessage" class="message-popup">{{ showMessage }}</div>
    </transition>
  </div>
</template>


<script>
export default {
  name: 'FinancialAudit',
  data() {
    return {
      searchID: '',
      searchApplicant: '',
      items: [],
      filteredItems: [],
      currentPage: 1,
      itemsPerPage: 8,
      showMessage: '', // 控制提示信息弹窗
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
    this.fetchFinancialRecords();
  },
  methods: {
    fetchFinancialRecords() {
      fetch('http://8.136.125.61/api/Finance/financial-records?status=待审核')
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              this.items = data.response || [];
              this.filteredItems = this.items;
            } else {
              this.showError('获取数据失败: ' + data.msg);
            }
          })
          .catch(() => {
            this.showError('获取数据时发生错误。');
          });
    },
    search() {
      this.filteredItems = this.items.filter(item => {
        return (
            (!this.searchID || item.financeId.toString().includes(this.searchID)) &&
            (!this.searchApplicant || item.accountId.includes(this.searchApplicant))
        );
      });
      this.currentPage = 1;
    },
    updateStatus(id, status) {
      const url = `http://8.136.125.61/api/Finance/financial-records/${id}/status`;
      const data = { Status: status };

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxNjgwMDAxNiIsInJvbGUiOiJhZG1pbiIsIm5iZiI6MTcyNTI0NzU1NCwiZXhwIjoxNzMzODg3NTU0LCJpYXQiOjE3MjUyNDc1NTQsImlzcyI6InlvdXJfaXNzdWVyIiwiYXVkIjoieW91cl9hdWRpZW5jZSJ9.WfcCVsnq1zi3jjXv27zKjYue6GgYV8ZCOreIXm_vwKw'
        },
        body: JSON.stringify(data)
      })
          .then(response => {
            if (!response.ok) {
              return response.json().then(errData => {
                throw new Error(errData.msg || '未知错误');
              });
            }
            return response.json();
          })
          .then(data => {
            if (data.success) {
              this.showSuccess(`状态更新成功: ${status}`);
              this.fetchFinancialRecords();
            } else {
              this.showError('状态更新失败: ' + data.msg);
            }
          })
          .catch(error => {
            this.showError('更新状态时发生错误：' + error.message);
          });
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
    showError(message) {
      this.showMessage = message;
      setTimeout(() => {
        this.showMessage = "";
      }, 3000); // 错误信息3秒后消失
    },
    showSuccess(message) {
      this.showMessage = message;
      setTimeout(() => {
        this.showMessage = "";
      }, 2000); // 成功信息2秒后消失
    }
  }
};
</script>

<style scoped>
.financial-audit {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
<<<<<<< HEAD
  background-color: #ffffff; /* 添加背景色 */
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 轻微阴影 */
=======
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
>>>>>>> f7b000bb3f6d043b5d594299674d37180c608251
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
<<<<<<< HEAD
  background-color: #fff; /* 白色背景 */
  overflow: hidden; /* 隐藏溢出 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 轻微阴影 */
=======
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
>>>>>>> f7b000bb3f6d043b5d594299674d37180c608251
}

.table th,
.table td {
  padding: 15px;
  border: 1px solid rgba(225, 217, 208, 0.5);
  text-align: left;
  font-size: 14px;
}

.table th {
  background-color: rgba(225, 217, 208, 0.5);
  color: rgb(0, 0, 0);
  text-transform: uppercase;
  font-weight: bold;
}

.table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.table tbody tr:hover {
  background-color: #f1f1f1;
}

.btn {
<<<<<<< HEAD
=======
  padding: 5px 10px;
  margin: 2px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn.search {
>>>>>>> f7b000bb3f6d043b5d594299674d37180c608251
  padding: 10px 20px;
  margin: 2px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100px;
  text-align: center;
<<<<<<< HEAD
}
.btn.blue {
  padding: 10px 15px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background-color: #97cfff;
  color: #0275d8;
  font-weight: bold;
}
.btn.red {
  padding: 10px 15px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background-color: #f98691;
  color: rgb(247, 10, 10);
  font-weight: bold;
}

.btn.green {
  padding: 10px 15px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background-color: #81fa9d;
  color: #006b29;
  font-weight: bold;
=======
  font-size: 14px;
  background-color: #0275d8;
}

.btn.approve {
  background-color: #4CAF50;
  color: white;
}

.btn.reject {
  background-color: #f44336;
  color: white;
>>>>>>> f7b000bb3f6d043b5d594299674d37180c608251
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

.message-popup {
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.6);
  color: rgb(255, 255, 255);
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 999;
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
  font-size: 12px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
