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
      <button class="am search" @click="search">搜索</button>
      <button class="am add" @click="showAddAnnouncementModal">添加</button>
      <button class="am draft1" @click="showDraftModal">草稿</button>
    </div>
    <table class="table">
      <thead>
      <tr>
        <th>标题</th>
        <th>发布人</th>
        <th>时间</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="announcement in announcements" :key="announcement.id">
        <td><img src="bell-icon.png" alt="icon">{{ announcement.title }}</td>
        <td>{{ announcement.author }}</td>
        <td>{{ announcement.date }}</td>
        <td><button class="am view" @click="viewAnnouncement(announcement)">查看内容</button></td>
      </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button @click="prevPage">«</button>
      <span v-for="page in totalPages" :key="page" @click="goToPage(page)">{{ page }}</span>
      <button @click="nextPage">»</button>
    </div>

    <!-- 添加公告的模态框 -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h3>添加公告</h3>
        <input type="text" v-model="newAnnouncement.title" placeholder="标题" />
        <input type="text" v-model="newAnnouncement.author" placeholder="发布人" />
        <input type="date" v-model="newAnnouncement.date" placeholder="日期" />
        <textarea v-model="newAnnouncement.content" placeholder="内容"></textarea>
        <button @click="addAnnouncement">保存</button>
        <button @click="closeAddAnnouncementModal">取消</button>
      </div>
    </div>

    <!-- 草稿模态框 -->
    <div v-if="showDraftModalFlag" class="modal">
      <div class="modal-content">
        <h3>草稿</h3>
        <input type="text" v-model="newAnnouncement.title" placeholder="标题" />
        <input type="text" v-model="newAnnouncement.author" placeholder="发布人" />
        <input type="date" v-model="newAnnouncement.date" placeholder="日期" />
        <textarea v-model="newAnnouncement.content" placeholder="内容"></textarea>
        <button @click="saveDraft">保存草稿</button>
        <button @click="closeDraftModal">取消</button>
      </div>
    </div>

    <!-- 查看公告内容的模态框 -->
    <div v-if="showViewModal" class="modal">
      <div class="modal-content">
        <h3>公告内容</h3>
        <p><strong>标题:</strong> {{ selectedAnnouncement.title }}</p>
        <p><strong>发布人:</strong> {{ selectedAnnouncement.author }}</p>
        <p><strong>日期:</strong> {{ selectedAnnouncement.date }}</p>
        <p><strong>内容:</strong> {{ selectedAnnouncement.content }}</p>
        <button @click="closeViewModal">关闭</button>
      </div>
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
        { id: 1, title: '公告1', author: '发布人A', date: '2024-01-01', content: '这是公告1的内容。' },
        { id: 2, title: '公告2', author: '发布人B', date: '2024-01-02', content: '这是公告2的内容。' },
      ],
      newAnnouncement: {
        title: '',
        author: '',
        date: '',
        content: '',
      },
      selectedAnnouncement: {
        title: '',
        author: '',
        date: '',
        content: '',
      },
      currentPage: 1,
      totalPages: 5,
      showAddModal: false,
      showDraftModalFlag: false,
      showViewModal: false,
    };
  },
  methods: {
    search() {
      // 搜索逻辑
    },
    showAddAnnouncementModal() {
      this.showAddModal = true;
    },
    closeAddAnnouncementModal() {
      this.showAddModal = false;
      this.newAnnouncement = { title: '', author: '', date: '', content: '' };
    },
    addAnnouncement() {
      if (this.newAnnouncement.title && this.newAnnouncement.author && this.newAnnouncement.date && this.newAnnouncement.content) {
        this.announcements.push({
          id: this.announcements.length + 1,
          ...this.newAnnouncement
        });
        this.closeAddAnnouncementModal();
      } else {
        alert("请填写所有字段");
      }
    },
    showDraftModal() {
      this.showDraftModalFlag = true;
    },
    closeDraftModal() {
      this.showDraftModalFlag = false;
      this.newAnnouncement = { title: '', author: '', date: '', content: '' };
    },
    saveDraft() {
      console.log("草稿保存成功: ", this.newAnnouncement);
      this.closeDraftModal();
    },
    viewAnnouncement(announcement) {
      this.selectedAnnouncement = announcement;
      this.showViewModal = true;
    },
    closeViewModal() {
      this.showViewModal = false;
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f7fa; /* 添加背景色 */
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 轻微阴影 */
}

.am {
  padding: 10px 15px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.am.search {
  background-color: #0275d8;
  color: white;
}

.am.add {
  background-color: #5cb85c;
  color: white;
}

.am.draft1 {
  padding: 10px 15px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background-color: #f0ad4e;
  color: white;
}

.am.view {
  background-color: #ffa500;
  color: white;
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
.table td img {
  width: 20px;
  margin-right: 10px;
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

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 300px;
}

textarea {
  width: 100%;
  height: 100px;
  margin-top: 10px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 14px;
}
</style>
