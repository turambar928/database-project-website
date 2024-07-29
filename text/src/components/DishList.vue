<template>
  <div class="dish-list">
    <div class="search-bar">
      <label for="dish-name">名称 </label>
      <input v-model="searchName" id="dish-name" placeholder="输入菜品名称">
      
      <label for="dish-category">类别 </label>
      <select v-model="searchCategory" id="dish-category">
        <option value="">请选择</option>
        <option searchCategory="category1">烧烤</option>
        <option searchCategory="category2">蜜酿</option>
        <option searchCategory="category3">蛋糕</option>
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
      return this.filteredDishes.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredDishes.length / this.itemsPerPage);
    }
  },
  methods: {
    fetchDishes() {
      // 初始化菜品数据，可以在这里添加一些默认的菜品
      this.dishes = [
      { id:1, name: '甜甜花酿鸡', category: '蜜酿', recipe: '甜甜花，鸡肉，提子', price: '200摩拉', image: 'chicken.jpg' },
      { id:2, name: '蒙德烤鱼', category: '烧烤', recipe: '鱼肉，胡椒', price: '150摩拉', image: 'fish.jpg' },
      { id:3, name: '厚云朵松饼', category: '蛋糕', recipe: '奶油，面粉，水果', price: '500摩拉', image: 'cake.jpg' },

        // 添加更多默认菜品
      ];
      this.searchDishes(); // 初始化过滤后的菜品数据
    },
    searchDishes() {
      this.currentPage = 1; // 搜索后重置到第一页
      this.filteredDishes = this.dishes.filter(dish => {
        return (this.searchName === '' || dish.name.includes(this.searchName)) &&
               (this.searchCategory === '' || dish.category === this.searchCategory);
      });
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
    saveDish() {
      const newDish = { ...this.form, id: Date.now() }; // 使用时间戳作为 ID
      this.dishes.push(newDish);
      this.searchDishes();
      this.cancelForm();
    },
    updateDish() {
      const index = this.dishes.findIndex(d => d.id === this.form.id);
      if (index !== -1) {
         this.dishes.splice(index, 1, { ...this.form });
      }
      this.searchDishes();
      this.cancelForm();
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
    deleteDish(id) {
      this.dishes = this.dishes.filter(dish => dish.id !== id);
      this.searchDishes(); // 更新过滤后的菜品数据
    }
  },
  mounted() {
    this.fetchDishes(); // 在组件挂载时初始化菜品数据
  }
};
</script>

<style scoped>
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
