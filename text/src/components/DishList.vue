<template>
  <div class="dish-list">
    <div class="search-bar">
      <label for="dish-name">名称 </label>
      <input v-model="searchName" id="dish-name" placeholder="输入菜品名称">

      <label for="dish-category">类别 </label>
      <select v-model="searchCategory" id="dish-category">
        <option value="">请选择</option>
        <option value="烧烤">烧烤</option>
        <option value="蜜酿">蜜酿</option>
        <option value="蛋糕">蛋糕</option>
        <!-- 更多类别选项 -->
      </select>

      <button @click="searchDishes">搜索</button>
      <button @click="openAddDishForm">+</button>
    </div>

    <div v-if="showForm" class="dish-form">
      <h3>{{ isEditing ? '编辑菜品' : '添加菜品' }}</h3>
      <label for="dish-form-name">名称</label>
      <input v-model="form.name" id="dish-form-name" placeholder="输入菜品名称">

      <label for="dish-form-category">类别</label>
      <input v-model="form.category" id="dish-form-category" placeholder="输入菜品类别">

      <label for="dish-form-recipe">配方</label>
      <input v-model="form.recipe" id="dish-form-recipe" placeholder="输入菜品配方">

      <label for="dish-form-price">价格</label>
      <input v-model="form.price" id="dish-form-price" placeholder="输入菜品价格">

      <label for="dish-form-image">图片 URL</label>
      <input v-model="form.image" id="dish-form-image" placeholder="输入图片 URL">

      <button @click="isEditing ? updateDish() : saveDish()">{{ isEditing ? '保存' : '添加' }}</button>
      <button @click="cancelForm">取消</button>
    </div>

    <div class="dish-container">
      <div v-for="dish in paginatedDishes" :key="dish.id" class="dish-item">
        <img :src="dish.image" alt="Dish Image">
        <div>
          <h3>{{ dish.name }}</h3>
          <p>类别: {{ dish.category }}</p>
          <p>配方: {{ dish.recipe }}</p>
        </div>
        <div class="dish-actions">
          <span>价格: {{ dish.price }}</span>
          <button @click.stop="deleteDish(dish.id)">删除</button>
          <button @click.stop="openEditDishForm(dish)">修改</button>
        </div>
      </div>
    </div>

    <div class="pagination">
      <button v-for="page in totalPages" :key="page" @click="goToPage(page)">
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

// 使用本地 Mock URL
axios.defaults.baseURL = 'https://apifoxmock.com/m1/4808550-4462943-default'; // 替换为实际的 Mock URL

export default {
  data() {
    return {
      searchName: '',
      searchCategory: '',
      dishes: [], // 存储所有菜品数据
      filteredDishes: [], // 存储过滤后的菜品数据
      currentPage: 1,
      itemsPerPage: 10,
      showForm: false, // 控制表单显示
      isEditing: false, // 控制表单是添加还是编辑模式
      form: {
        id: null,
        name: '',
        category: '',
        recipe: '',
        price: '',
        image: ''
      }
    };
  },
  computed: {
    paginatedDishes() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      console.log('filteredDishes type:', typeof this.filteredDishes, Array.isArray(this.filteredDishes)); // 调试信息
      return this.filteredDishes.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredDishes.length / this.itemsPerPage);
    }
  },
  methods: {
    async fetchDishes() {
      try {
        const response = await axios.get('/api/dishes');
        console.log('获取的菜品数据:', response.data); // 调试信息
        if (response.data.success) {
          this.dishes = Array.isArray(response.data.response) ? response.data.response : [];
          this.filteredDishes = this.dishes; // 确保 filteredDishes 被正确赋值为数组
        }
      } catch (error) {
        console.error('获取菜品数据失败:', error);
      }
    },
    async searchDishes() {
      try {
        const response = await axios.get('/api/dishes', {
          params: {
            name: this.searchName,
            category: this.searchCategory
          }
        });
        console.log('搜索的菜品数据:', response.data); // 调试信息
        if (response.data.success) {
          this.filteredDishes = Array.isArray(response.data.response) ? response.data.response : []; // 确保 filteredDishes 被正确赋值为数组
          this.currentPage = 1; // 搜索后重置到第一页
        }
      } catch (error) {
        console.error('搜索菜品失败:', error);
      }
    },
    goToPage(page) {
      this.currentPage = page;
    },
    openAddDishForm() {
      this.isEditing = false;
      this.showForm = true;
      this.resetForm();
    },
    openEditDishForm(dish) {
      this.isEditing = true;
      this.showForm = true;
      this.form = { ...dish };
    },
    async saveDish() {
      try {
        const response = await axios.post('/api/dishes', this.form);
        this.dishes.push(response.data);
        this.filteredDishes = this.dishes; // 确保 filteredDishes 被正确赋值为数组
        this.searchDishes();
        this.cancelForm();
      } catch (error) {
        console.error('添加菜品失败:', error);
      }
    },
    async updateDish() {
      try {
        await axios.put(`/api/dishes/${this.form.id}`, this.form);
        const index = this.dishes.findIndex(d => d.id === this.form.id);
        if (index !== -1) {
          this.dishes.splice(index, 1, { ...this.form });
          this.filteredDishes = this.dishes; // 确保 filteredDishes 被正确赋值为数组
        }
        this.searchDishes();
        this.cancelForm();
      } catch (error) {
        console.error('更新菜品失败:', error);
      }
    },
    cancelForm() {
      this.showForm = false;
      this.resetForm();
    },
    resetForm() {
      this.form = {
        id: null,
        name: '',
        category: '',
        recipe: '',
        price: '',
        image: ''
      };
    },
    async deleteDish(id) {
      try {
        await axios.delete(`/api/dishes/${id}`);
        this.dishes = this.dishes.filter(dish => dish.id !== id);
        this.filteredDishes = this.dishes; // 确保 filteredDishes 被正确赋值为数组
        this.searchDishes();
      } catch (error) {
        console.error('删除菜品失败:', error);
      }
    }
  },
  mounted() {
    this.fetchDishes(); // 在组件挂载时初始化菜品数据
  }
};
</script>




<style>
.dish-list {
  /* 样式 */
}

.search-bar {
  display: flex;
  align-items: center;
  font-family: 楷体;
}

.search-bar input,
.search-bar select,
.search-bar button {
  margin-right: 10px;
}

.dish-form {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.dish-form label {
  display: block;
  margin-bottom: 5px;
}

.dish-form input {
  margin-bottom: 10px;
  padding: 5px;
  width: 100%;
  box-sizing: border-box;
}

.dish-container {
  margin-top: 20px;
  margin-block: 30px;
}

.dish-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 60%; /* 设置元素宽度为60% */
  margin-left: auto; /* 使元素水平居中 */
  margin-right: auto; /* 使元素水平居中 */
  background-color: #e5e5e5;
  cursor: pointer; /* 添加手型光标 */
}

.dish-item:hover {
  background-color: #d5d5d5; /* 悬停时背景颜色变化 */
}

.dish-item img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 20px;
}

.dish-actions {
  display: flex;
  align-items: center;
}

.dish-actions button {
  margin-left: 10px;
}

.pagination {
  margin-top: 20px;
}

.pagination button {
  margin-right: 5px;
}
</style>
