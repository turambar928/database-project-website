<template>
  <div class="dish-list">
    <h2>菜品管理</h2>
    <div class="search-bar">
      <label for="dish-name">名称 </label>
      <input v-model="searchName" id="dish-name" placeholder="输入菜品名称" />

      <label for="dish-category">类别 </label>
      <select v-model="searchCategory" id="dish-category">
        <option value="">请选择</option>
        <!-- 动态生成的类别选项 -->
        <option v-for="category in categories" :key="category.cateId" :value="category.cateName">
          {{ category.cateName }}
        </option>
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
            <img :src="imagePreviewUrl" alt="预览图片" v-if="imagePreviewUrl" />
            <button @click="triggerFileInput">修改图片</button>
            <input type="file" ref="fileInput" @change="handleFileChange" style="display: none;" />
          </div>

          <label for="dish-form-name">菜品名称</label>
          <input v-model="form.dishName" id="dish-form-name" placeholder="输入菜品名称" />

          <label for="dish-form-price">价格</label>
          <input v-model="form.price" id="dish-form-price" placeholder="输入菜品价格" />

          <label for="dish-form-category">类别</label>
          <select v-model="form.category" id="dish-form-category">
            <option value="">请选择</option>
            <!-- 动态生成的类别选项 -->
            <option v-for="category in categories" :key="category.cateId" :value="category.cateName">
              {{ category.cateName }}
            </option>
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
                <tr v-for="(ingredient, index) in form.formula" :key="index">
                  <td>
                    <select v-model="ingredient.ingredientId" @change="updateIngredientName(index)">
                      <option :value="ingredient.ingredientId">{{ ingredient.ingredientName }}</option>
                      <option v-for="recipe in availableRecipes" :key="recipe.ingredientId" :value="recipe.ingredientId">
                        {{ recipe.ingredientName }}
                      </option>
                    </select>
                  </td>
                  <td>
                    <input v-model="ingredient.amount" placeholder="输入原料数量" />
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
      <div v-for="dish in paginatedDishes" :key="dish.dishId" class="dish-item">
        <img :src="dish.image" alt="Dish Image" />
        <div class="dish-details">
          <h3>{{ dish.dishName }}</h3>
          <p>类别: {{ dish.category }}</p>
          <p>配方:</p>
          <ul>
            <li v-for="(ingredient, index) in dish.formula" :key="index">
              {{ ingredient.ingredientName }} - 数量: {{ ingredient.amount }}
            </li>
          </ul>
        </div>
        <div class="dish-actions">
          <span class="dish-price">价格: {{ dish.price }}</span>
          <div class="action-buttons">
            <button @click.stop="deleteDish(dish.dishId)">删除</button>
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

axios.defaults.baseURL = 'http://8.136.125.61'; 

// 设置 axios 默认的 Authorization 头
axios.defaults.headers.common['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxNjgwMDAxNiIsInJvbGUiOiJhZG1pbiIsIm5iZiI6MTcyNTI0NzU1NCwiZXhwIjoxNzMzODg3NTU0LCJpYXQiOjE3MjUyNDc1NTQsImlzcyI6InlvdXJfaXNzdWVyIiwiYXVkIjoieW91cl9hdWRpZW5jZSJ9.WfcCVsnq1zi3jjXv27zKjYue6GgYV8ZCOreIXm_vwKw';

export default {
  setup() {
    const searchName = ref('');
    const searchCategory = ref('');
    const dishes = ref([]);
    const filteredDishes = ref([]);
    const availableRecipes = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const showForm = ref(false);
    const isEditing = ref(false);
    const categories = ref([]);
    const imagePreviewUrl = ref('');
    const form = ref({
      dishId: null,
      dishName: '',
      category: '',
      formula: [],
      price: '',
      image: ''
    });
    const pageInput = ref(1);
    const fileInput = ref(null); // 使用 ref 来管理 file input 的引用



    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category/search');
        if (response.data.success) {
          categories.value = response.data.cates;
        } else {
          console.error('API 请求成功，但返回的 success 为 false:', response.data.message);
        }
      } catch (error) {
        console.error('获取类别数据失败:', error.message);
      }
    };

    const fetchDishes = async () => {
  try {
    const response = await axios.get('/api/dish/search');
    if (response.data.success) {
      dishes.value = Array.isArray(response.data.dish) ? response.data.dish : [];
      filteredDishes.value = dishes.value;
      console.log(response.data);
    } else {
      console.error('API 请求成功，但返回的 success 为 false:', response.data.message);
    }
  } catch (error) {
    console.error('获取菜品数据失败:', error.message);
    if (error.response) {
      console.error('请求配置:', error.config);
      console.error('响应状态码:', error.response.status);
      console.error('响应数据:', error.response.data);
    } else {
      console.error('请求失败:', error.message);
    }
  }
};

const fetchRecipes = async () => {
  try {
    const response = await axios.get('/api/ingredients/search');

    // 检查 response 和 response.data 的有效性
    if (response && response.data) {
      if (response.data.success) {
        // 检查 ingredients 是否为数组并且有内容
        if (Array.isArray(response.data.ingredients) && response.data.ingredients.length > 0) {
          availableRecipes.value = response.data.ingredients; // 更新配方数据
        } else {
          console.error('API 返回的 ingredients 为空或不是数组:', response.data.ingredients);
          alert('API 返回的数据格式不正确，请稍后重试。');
        }
      } else {
        console.error('API 请求成功，但返回的 success 为 false:', response.data.message);
        alert('错误: ' + (response.data.message || '未知错误'));
      }
    } else {
      console.error('API 响应无效或没有返回数据:', response);
      alert('无法获取配方数据，请稍后重试。');
    }
  } catch (error) {
    console.error('获取配方数据失败:', error);
    alert('获取配方数据时发生错误，请检查您的网络连接或稍后重试。');
  }
};

const updateIngredientName = (index) => {
      const selectedRecipe = availableRecipes.value.find(recipe => recipe.ingredientId === form.value.formula[index].ingredientId);
      if (selectedRecipe) {
        form.value.formula[index].ingredientName = selectedRecipe.ingredientName;
      }
    };

    const searchDishes = () => {
      filteredDishes.value = dishes.value.filter(dish => {
        return (searchName.value === '' || dish.dishName.includes(searchName.value)) &&
               (searchCategory.value === '' || dish.category === searchCategory.value);
      });
      currentPage.value = 1;
    };

    const goToPage = (page) => {
      const pageNum = Number(page);
      if (pageNum >= 1 && pageNum <= totalPages.value) {
        currentPage.value = pageNum;
        pageInput.value = pageNum;
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

      await fetchRecipes();

      if (Array.isArray(form.value.formula)) {
        form.value.formula.forEach((ingredient, index) => {
          updateIngredientName(index);
        });
      } else {
        console.warn('form.value.formula 不是一个有效的数组:', form.value.formula);
      }
    };

    const uploadImage = async (file,dishId) => {
  if (!file || !(file instanceof File)) {
    alert('请选择一个有效的图片文件。');
    return null;
  }

  const formData = new FormData();
  formData.append('image', file);
  formData.append('DishId', dishId);

  for (let pair of formData.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`);
  }

  try {
    const response = await fetch(`http://8.136.125.61/api/Dish/uploadImage?DishId=${dishId}`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxNjgwMDAxNiIsInJvbGUiOiJhZG1pbiIsIm5iZiI6MTcyNTI0NzU1NCwiZXhwIjoxNzMzODg3NTU0LCJpYXQiOjE3MjUyNDc1NTQsImlzcyI6InlvdXJfaXNzdWVyIiwiYXVkIjoieW91cl9hdWRpZW5jZSJ9.WfcCVsnq1zi3jjXv27zKjYue6GgYV8ZCOreIXm_vwKw' // 添加Authorization头部
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP 错误！状态码: ${response.status}，响应文本: ${response.statusText}`);
    }

    const responseData = await response.json();
    // 提示上传成功
    alert('图片上传成功！');

    fetchDishes();

    return responseData.url;
  } catch (error) {
    console.error('上传图片失败:', error.message);

    alert('上传图片失败，请检查请求路径和服务器配置，然后重试。');
    return null;
  }
};

const saveDish = async () => {
  try {
    if (!form.value.dishName || !form.value.category || !form.value.price || form.value.formula.length === 0) {
      alert('请填写所有必需的字段，包括菜品名称、类别、价格和至少一个配方。');
      return;
    }

    // 使用已有的 dishId
    if (fileInput.value.files[0]) {
      const uploadedImageUrl = await uploadImage(fileInput.value.files[0], form.value.dishId);
      if (uploadedImageUrl) {
        form.value.image = uploadedImageUrl;
      } else {
        return;
      }
    }

    const response = await axios.post('/api/dish/add', form.value);
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
      const updatedImageUrl = await uploadImage(fileInput.value.files[0], form.value.dishId);
      if (updatedImageUrl) {
        form.value.image = updatedImageUrl; // 如果有新的图片URL，更新表单中的 image 字段
      } else {
        return; // 如果上传失败，退出函数
      }
    }
// 根据选中的 cateName 找到对应的 cateId
   const selectedCategory = categories.value.find(category => category.cateName === form.value.category);
    if (selectedCategory) {
      form.value.cateId = selectedCategory.cateId; // 更新表单中的 cateId
    } else {
      alert('所选类别无效，请重新选择。');
      return; // 如果未找到匹配的类别，退出函数
    }
    
    const updateData = {
      dishId: form.value.dishId, // 使用已有的 dishId
      Name: form.value.dishName,
      cateId: form.value.cateId,
      category: form.value.category,
      price: parseFloat(parseFloat(form.value.price).toFixed(2)),
      formula: form.value.formula.map(item => ({
        ingredientId: item.ingredientId,
        ingredientName: item.ingredientName,
        amount: item.amount
      }))
    };
    console.log('更新后的数据：',updateData);
    const response = await axios.put('/api/dish/updateDish', updateData);
    console.log('返回的数据：',response.data.dish);
    if (response.data.success) {
      const index = dishes.value.findIndex(d => d.dishId === form.value.dishId);
      if (index !== -1) {
        dishes.value.splice(index, 1, { ...form.value });
        filteredDishes.value = dishes.value;
      }
      alert("更新菜品成功");
      cancelForm();
      goToPage(currentPage.value);
    } else {
      console.error('更新请求成功，但服务器返回失败信息:', response.data.msg);
    }
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
        dishId: null,
        dishName: '',
        category: '',
        formula: [],
        price: '',
        image: ''
      };
      imagePreviewUrl.value = '';
    };

    const addIngredient = () => {
      form.value.formula.push({ IngredientId: '', IngredientName: '', amount: '' });
    };

    const removeIngredient = (index) => {
      form.value.formula.splice(index, 1);
    };

    const deleteDish = async (id) => {
  try {
    // 在删除请求之前，打印要删除的菜品ID
    console.log('即将删除的菜品ID:', id);

    // 发送删除请求
    const response = await axios.delete(`/api/dishes/${id}`,{
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxNjgwMDAxNiIsInJvbGUiOiJhZG1pbiIsIm5iZiI6MTcyNTI0NzU1NCwiZXhwIjoxNzMzODg3NTU0LCJpYXQiOjE3MjUyNDc1NTQsImlzcyI6InlvdXJfaXNzdWVyIiwiYXVkIjoieW91cl9hdWRpZW5jZSJ9.WfcCVsnq1zi3jjXv27zKjYue6GgYV8ZCOreIXm_vwKw' // 添加Authorization头部
      }
    });
    
    // 在收到响应后，打印服务器返回的响应数据
    console.log('删除请求成功，服务器响应:', response.data);

    // 更新本地数据
    dishes.value = dishes.value.filter(dish => dish.dishId !== id);
    filteredDishes.value = dishes.value;
    
    console.log('本地菜品数据更新完成。当前菜品列表:', dishes.value);
    
    goToPage(currentPage.value);
  } catch (error) {
    console.error('删除菜品失败:', error);

    // 打印详细的错误信息
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
      console.error('响应头部:', error.response.headers);
    } else if (error.request) {
      console.error('请求未收到响应:', error.request);
    } else {
      console.error('请求配置时发生错误:', error.message);
    }
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
      return filteredDishes.value.slice(start, start + itemsPerPage.value);
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredDishes.value.length / itemsPerPage.value);
    });

    onMounted(() => {
      fetchDishes();
      fetchCategories(); // 在组件加载时获取类别数据
    });

    return {
      searchName,
      searchCategory,
      dishes,
      filteredDishes,
      availableRecipes,
      currentPage,
      itemsPerPage,
      showForm,
      categories,
      isEditing,
      imagePreviewUrl,
      form,
      fetchDishes,
      fetchRecipes,
      searchDishes,
      fetchCategories,
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
