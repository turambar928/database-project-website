<template>
  <div class="dish-list">
    <h2>菜品管理</h2>
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

    <div v-if="showForm" class="dish-form-overlay">
      <div class="dish-form-container">
        <div class="dish-form">
          <h3>{{ isEditing ? '编辑菜品' : '添加菜品' }}</h3>
          
          <!-- 图片预览和上传 -->
          <div class="image-preview">
            <img :src="imagePreviewUrl" alt="预览图片" v-if="imagePreviewUrl"/>
            <button @click="triggerFileInput">修改图片</button>
            <input type="file" ref="fileInput" @change="handleFileChange" style="display: none;" />
          </div>

          <label for="dish-form-name">菜品名称</label>
          <input v-model="form.name" id="dish-form-name" placeholder="输入菜品名称">

          <label for="dish-form-price">价格</label>
          <input v-model="form.price" id="dish-form-price" placeholder="输入菜品价格">

          <label for="dish-form-category">类别</label>
          <select v-model="form.category" id="dish-form-category">
            <option value="">请选择</option>
            <option value="烧烤">烧烤</option>
            <option value="蜜酿">蜜酿</option>
            <option value="蛋糕">蛋糕</option>
            <!-- 更多类别选项 -->
          </select>
          <!-- 配方表格 -->
          <div class="recipe-header">
            <label for="recipe-table" class="recipe-label">配方</label>
            <button @click="addIngredient" class="add-ingredient-button">添加原料</button>
          </div>

          <div id="recipe-table" class="recipe-table-container">
            <table class="recipe-table">
              <thead>
                <tr>
                  <th>食材</th>
                  <th>份量</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(ingredient, index) in form.recipe" :key="index">
                  <td>
                    <select v-model="ingredient.IngredientId" @change="updateIngredientName(index)">
                      <option :value="ingredient.IngredientId">{{ ingredient.IngredientName }}</option>
                      <option v-for="recipe in availableRecipes" :key="recipe.IngredientId" :value="recipe.IngredientId">
                        {{ recipe.IngredientName}}
                      </option>
                    </select>
                  </td>
                  <td>
                    <input v-model="ingredient.account" placeholder="输入原料数量" />
                  </td>
                  <td>
                    <button @click="removeIngredient(index)" class="delete-button">删除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="button-group">
            <button @click="isEditing ? updateDish() : saveDish()" class="confirm-button">{{ isEditing ? '保存' : '添加' }}</button>
            <button @click="cancelForm" class="cancel-button">取消</button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="dish-container">
      <div v-for="dish in paginatedDishes" :key="dish.id" class="dish-item">
        <img :src="dish.image" alt="Dish Image">
        <div class="dish-details">
          <h3>{{ dish.name }}</h3>
          <p>类别: {{ dish.category }}</p>
          <p>配方:</p>
          <ul>
            <li v-for="(ingredient, index) in dish.recipe" :key="index">
              {{ ingredient.IngredientName }} - 数量: {{ ingredient.account }}
            </li>
          </ul>
        </div>
        <div class="dish-actions">
          <span class="dish-price">价格: {{ dish.price }}</span>
          <div class="action-buttons">
            <button @click.stop="deleteDish(dish.id)">删除</button>
            <button @click.stop="openEditDishForm(dish)">修改</button>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination">
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">上一页</button>
      <input v-model="pageInput" type="number" min="1" :max="totalPages" />
      <button @click="goToPage(pageInput)" :disabled="!pageInput || pageInput < 1 || pageInput > totalPages">跳转</button>
      <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">下一页</button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

axios.defaults.baseURL = 'https://apifoxmock.com/m1/4808550-4462943-default'; // 替换为实际的 Mock URL

export default {
  setup() {
    const searchName = ref('');
    const searchCategory = ref('');
    const dishes = ref([]);
    const filteredDishes = ref([]);
    const recipes = ref([]);
    const availableRecipes = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const showForm = ref(false);
    const isEditing = ref(false);
    const imagePreviewUrl = ref('');
    const form = ref({
      id: null,
      name: '',
      category: '',
      recipe: [],
      price: '',
      image: ''
    });
    const pageInput = ref(1);

    const fileInput = ref(null); // 使用 ref 来管理 file input 的引用

    const generateUniqueId = () => {
      return `dish-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    };

    const fetchDishes = async () => {
      try {
        const response = await axios.get('/api/dishes/search');
        if (response.data.success) {
          dishes.value = Array.isArray(response.data.response) ? response.data.response : [];
          filteredDishes.value = dishes.value;
        }
      } catch (error) {
        console.error('获取菜品数据失败:', error);
      }
    };

    const fetchRecipes = async () => {
      try {
        const response = await axios.get('/api/ingredients/search');
        console.log('API Response:', response.data);
        if (response.data.success) {
          if (Array.isArray(response.data.data) && response.data.data.length > 0) {
            availableRecipes.value = response.data.data;
            console.log('Available Recipes:', availableRecipes.value);
          } else {
            console.error('API 返回的 data 为空或不是数组:', response.data.data);
          }
        } else {
          console.error('API 请求成功，但返回的 success 为 false:', response.data.message);
          alert('错误: ' + response.data.message);
        }
      } catch (error) {
        console.error('获取配方数据失败:', error);
      }
    };

    const updateIngredientName = (index) => {
      const selectedRecipe = recipes.value.find(recipe => recipe.id === form.value.recipe[index].IngredientId);
      if (selectedRecipe) {
        form.value.recipe[index].IngredientName = selectedRecipe.name;
      }
    };

    const searchDishes = () => {
      filteredDishes.value = dishes.value.filter(dish => {
        return (searchName.value === '' || dish.name.includes(searchName.value)) &&
               (searchCategory.value === '' || dish.category === searchCategory.value);
      });
      currentPage.value = 1;
    };

    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        pageInput.value = page;
      }
    };

    const openAddDishForm = () => {
      isEditing.value = false;
      resetForm();
      showForm.value = true;
    };

    const openEditDishForm = async (dish) => {
      isEditing.value = true;
      showForm.value = true;
      form.value = { ...dish };
      imagePreviewUrl.value = form.value.image || '';

      await fetchRecipes(); // 获取可用食材的API调用

      if (Array.isArray(form.value.recipe)) {
        form.value.recipe.forEach((ingredient, index) => {
          updateIngredientName(index);
        });
      } else {
        console.warn('form.value.recipe 不是一个有效的数组:', form.value.recipe);
      }
    };

    const uploadImage = async (file) => {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await axios.post('/api/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data.url; // 假设服务器返回图片URL
      } catch (error) {
        console.error('上传图片失败:', error);
        alert('上传图片失败，请重试。');
        return null;
      }
    };

    const saveDish = async () => {
      try {
        if (!form.value.name || !form.value.category || !form.value.price || form.value.recipe.length === 0) {
          alert('请填写所有必需的字段，包括菜品名称、类别、价格和至少一个配方。');
          return;
        }

        if (fileInput.value.files[0]) {
          const uploadedImageUrl = await uploadImage(fileInput.value.files[0]);
          if (uploadedImageUrl) {
            form.value.image = uploadedImageUrl;
          } else {
            return;
          }
        }

        form.value.id = generateUniqueId();
        const response = await axios.post('/api/dishes', form.value);
        dishes.value.push(response.data);
        filteredDishes.value = dishes.value;
        cancelForm();
        goToPage(currentPage.value);
      } catch (error) {
        console.error('保存菜品失败:', error);
      }
    };

    const updateDish = async () => {
      try {
        if (fileInput.value.files[0]) {
          const updatedImageUrl = await uploadImage(fileInput.value.files[0]);
          if (updatedImageUrl) {
            form.value.image = updatedImageUrl;
          } else {
            return;
          }
        }

        await axios.put(`/api/dishes/${form.value.id}`, form.value);
        const index = dishes.value.findIndex(d => d.id === form.value.id);
        if (index !== -1) {
          dishes.value.splice(index, 1, { ...form.value });
          filteredDishes.value = dishes.value;
        }
        cancelForm();
        goToPage(currentPage.value);
      } catch (error) {
        console.error('更新菜品失败:', error);
      }
    };

    const cancelForm = () => {
      showForm.value = false;
      resetForm();
    };

    const resetForm = () => {
      form.value = {
        id: null,
        name: '',
        category: '',
        recipe: [],
        price: '',
        image: ''
      };
      imagePreviewUrl.value = '';
    };

    const addIngredient = () => {
      if (!Array.isArray(form.value.recipe)) {
        form.value.recipe = [];
      }
      form.value.recipe.push({ IngredientId: '', IngredientName: '', account: '' });
    };

    const removeIngredient = (index) => {
      form.value.recipe.splice(index, 1);
    };

    const deleteDish = async (id) => {
      try {
        await axios.delete(`/api/dishes/${id}`);
        dishes.value = dishes.value.filter(dish => dish.id !== id);
        filteredDishes.value = dishes.value;
        goToPage(currentPage.value);
      } catch (error) {
        console.error('删除菜品失败:', error);
      }
    };

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        imagePreviewUrl.value = URL.createObjectURL(file);
      }
    };

    const triggerFileInput = () => {
      fileInput.value.click();
    };

    const paginatedDishes = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredDishes.value.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredDishes.value.length / itemsPerPage.value);
    });

    onMounted(() => {
      fetchDishes();
    });

    return {
      searchName,
      searchCategory,
      dishes,
      filteredDishes,
      recipes,
      availableRecipes,
      currentPage,
      itemsPerPage,
      showForm,
      isEditing,
      imagePreviewUrl,
      form,
      fetchDishes,
      fetchRecipes,
      searchDishes,
      goToPage,
      openAddDishForm,
      openEditDishForm,
      saveDish,
      updateDish,
      cancelForm,
      resetForm,
      addIngredient,
      removeIngredient,
      updateIngredientName,
      deleteDish,
      handleFileChange,
      triggerFileInput,
      fileInput,
      paginatedDishes,
      totalPages,
      pageInput
    };
  }
};
</script>

<style>
.dish-list {
  padding: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-family: 'Arial', sans-serif;
  padding: 10px 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.search-bar label {
  font-weight: bold;
  margin-right: 10px;
  color: #333;
}

.search-bar input,
.search-bar select {
  margin-right: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  width: 200px;
}

.search-bar button {
  padding: 10px 15px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease, transform 0.3s ease;
  margin-left: 10px;
}

.search-bar button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.search-bar button:last-child {
  background-color: #28a745;
  font-size: 20px;
  padding: 5px 10px;
}

.search-bar button:last-child:hover {
  background-color: #218838;
}

.dish-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow-y: auto;
}

.dish-form-container {
  width: 100%;
  max-width: 600px;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
  max-height: 80vh;
  margin: 0 auto;
}

.dish-form {
  width: 100%;
}

.dish-form h3 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

.dish-form label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

.dish-form input,
.dish-form select {
  margin-bottom: 15px;
  padding: 12px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.dish-form input:focus,
.dish-form select:focus {
  border-color: #007bff;
  background-color: #fff;
}
/* 配方标签和按钮容器 */
.recipe-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

/* 配方标签样式 */
.recipe-label {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  display: inline-block;
  vertical-align: middle;
}

/* 添加原料按钮样式 */
.add-ingredient-button {
  padding: 5px 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  font-size: 14px;
  display: inline-block;
  vertical-align: middle;
}

/* 配方表格容器 */
.recipe-table-container {
  max-height: 200px; /* 固定表格的高度 */
  overflow-y: auto; /* 启用垂直滚动 */
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  position: relative; /* 让容器成为按钮的相对定位参考 */
}

/* 表头粘性效果 */
.recipe-table thead th {
  position: sticky;
  top: 0;
  background-color: #f9f9f9;
  z-index: 1;
  padding: 8px;
  border-bottom: 2px solid #ddd;
  text-align: center; /* 居中对齐表头 */
}

/* 配方表格样式 */
.recipe-table {
  width: 100%;
  border-collapse: collapse;
}

.recipe-table th, .recipe-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center; /* 数据居中 */
  vertical-align: middle; /* 垂直居中 */
}

/* 固定列宽 */
.recipe-table th:nth-child(1),
.recipe-table td:nth-child(1) {
  width: 50%; /* 食材列宽度 */
}

.recipe-table th:nth-child(2),
.recipe-table td:nth-child(2) {
  width: 35%; /* 份量列宽度 */
}

.recipe-table th:nth-child(3),
.recipe-table td:nth-child(3) {
  width: 15%; /* 操作列宽度 */
}

/* 确保 select 和 input 内容居中 */
.recipe-table select,
.recipe-table input {
  width: 100%;
  text-align: center; /* 水平居中 */
  padding: 5px;
  box-sizing: border-box; /* 确保 padding 不会影响宽度 */
  display: block;
  margin: 0 auto; /* 保证元素居中 */
}

/* 删除按钮样式 */
.delete-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-button:hover {
  background-color: #c82333;
}


.button-group {
  display: flex;
  justify-content: space-between; /* 将按钮分布在容器的两端 */
  margin-top: 20px;
  width: 100%; /* 确保按钮组占据父容器的全部宽度 */
}

.confirm-button, .cancel-button {
  width: 30%; /* 每个按钮的宽度减少以留出中间的空隙 */
  padding: 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}



.confirm-button {
  background-color: #28a745;
  color: white;
}

.confirm-button:hover {
  background-color: #218838;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
}

.cancel-button:hover {
  background-color: #c82333;
}

.image-preview {
  margin-bottom: 15px;
  text-align: center;
}

.image-preview img {
  max-width: 100%;
  max-height: 200px;
  display: block;
  margin: 0 auto 10px;
}

.dish-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  width: 60%;
  margin-left: auto;
  margin-right: auto;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.dish-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  background-color: #f9f9f9;
}

.dish-item img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  margin-right: 20px;
  border-radius: 10px;
  border: 1px solid #ccc;
}

.dish-details {
  flex-grow: 1;
}

.dish-details h3 {
  margin: 0 0 10px;
}

.dish-details p {
  margin: 5px 0;
}

.dish-actions {
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
}

.dish-price {
  font-weight: bold;
  margin-bottom: 10px;
}

.action-buttons button {
  margin-top: 5px;
  padding: 5px 10px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.action-buttons button:hover {
  background-color: #0056b3;
}

.pagination {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination button {
  margin-right: 5px;
  padding: 5px 10px;
  border: 1px solid #007bff;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination button:disabled {
  background-color: #ddd;
  border-color: #ddd;
  cursor: not-allowed;
}

.pagination input {
  width: 50px;
  text-align: center;
  margin-right: 5px;
  padding: 5px;
  border: 1px solid #007bff;
  border-radius: 5px;
}
</style>
