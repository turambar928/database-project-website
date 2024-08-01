<template>
  <div class="announcement-management">
    <h2>公告管理</h2>
    <div class="search-bar">
      <input type="text" placeholder="标题" v-model="searchTitle" />
      <select v-model="searchDate">
        <option value="">日期</option>
        <option value="2024-01-01">2024-01-01</option>
        <option value="2024-01-02">2024-01-02</option>
      </select>
      <button class="btn search" @click="search">搜索</button>
      <button class="btn add" @click="addAnnouncement">添加</button>
      <button class="btn draft" @click="saveDraft">草稿</button>
    </div>
    <table>
      <thead>
      <tr>
        <th>标题</th>
        <th>发布人</th>
        <th>时间</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="announcement in announcements" :key="announcement.id">
        <td><img src="bell-icon.png" alt="icon">{{ announcement.title }}</td>
        <td>{{ announcement.author }}</td>
        <td>{{ announcement.date }}</td>
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
  name: 'AnnouncementManagement',
  data() {
    return {
      searchTitle: '',
      searchDate: '',
      announcements: [
        // 示例数据
        { id: 1, title: '公告1', author: '发布人A', date: '2024-01-01' },
        { id: 2, title: '公告2', author: '发布人B', date: '2024-01-02' },
        // 添加更多公告
      ],
      currentPage: 1,
      totalPages: 5,
    };
  },
  methods: {
    search() {
      // 搜索逻辑
    },
    addAnnouncement() {
      // 添加公告逻辑
    },
    saveDraft() {
      // 保存草稿逻辑
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
.announcement-management {
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
  color: #FFA500; /* 橙色 */
}

td img {
  width: 20px;
  margin-right: 10px;
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

.btn.add {
  background-color: #5cb85c; /* 绿色 */
  color: white;
}

.btn.draft {
  background-color: #f0ad4e; /* 黄色 */
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
