<template>
  <div class="weekly-promotion">
    <div class="header">
      <h1>每周促销</h1>
      <div class="date-picker">
        <label for="promotion-date">
          <i class="calendar-icon"></i>
        </label>
        <input type="date" v-model="promotionDate" id="promotion-date" @change="fetchDishes" />
      </div>
      <div class="status">
        批量管理
      </div>
    </div>

    <table class="promotion-table">
      <thead>
        <tr>
          <th>菜品</th>
          <th>类别</th>
          <th>原价</th>
          <th>现价</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(dish, index) in dishes" :key="dish.id">
          <td>{{ dish.name }}</td>
          <td>{{ dish.category }}</td>
          <td>{{ dish.originalPrice.toFixed(2) }} 元</td>
          <td>
            <div v-if="editingIndex === index">
              <input type="number" v-model="dish.currentPrice" min="0" />
              <button @click="confirmEdit(dish.id)" class="confirm-button">确认</button>
              <button @click="cancelEdit" class="cancel-button">取消</button>
            </div>
            <div v-else>
              {{ dish.currentPrice.toFixed(2) }} 元
            </div>
          </td>
          <td>
            <button v-if="editingIndex !== index" @click="editPrice(index)" class="edit-button">修改</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      promotionDate: this.getCurrentDate(),  // 默认时间设置为当前日期
      editingIndex: null, // 正在编辑的菜品索引
      dishes: [],         // 菜品列表
    };
  },
  methods: {
    // 获取当前日期，格式为yyyy-mm-dd
    getCurrentDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // 月份从0开始
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    fetchDishes() {
      axios.get('/api/weeklymenu', {
        params: {
          date: this.promotionDate
        }
      }).then(response => {
        console.log('API response:', response.data); // 调试信息
        this.dishes = response.data.dishes;
      }).catch(error => {
        console.error('Error fetching dishes:', error);
      });
    },
    editPrice(index) {
      this.editingIndex = index;
    },
    confirmEdit(dishId) {
      axios.put(`/api/weeklymenu/${dishId}`, {
        currentPrice: this.dishes[this.editingIndex].currentPrice
      })
        .then(response => {
          this.editingIndex = null;
          // 更新菜品列表
          this.dishes = this.dishes.map(dish => 
            dish.id === dishId 
            ? { ...dish, currentPrice: response.data.updatedPrice }
            : dish
          );
        })
        .catch(error => {
          console.error('Error updating price:', error);
        });
    },
    cancelEdit() {
      this.editingIndex = null;
      // 重新获取数据以恢复原始价格
      this.fetchDishes();
    }
  },
  mounted() {
    this.fetchDishes(); // 组件加载时获取初始数据
  }
};
</script>

<style scoped>
.weekly-promotion {
  font-family: Arial, sans-serif;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.date-picker {
  display: flex;
  align-items: center;
}
.calendar-icon {
  margin-right: 10px;
  font-size: 18px;
}
.status {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}
.promotion-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.promotion-table th,
.promotion-table td {
  border: 1px solid #ddd;
  padding: 12px 15px;
  text-align: center;
}
.promotion-table th {
  background-color: #f2f2f2;
  color: #333;
}
.promotion-table td button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}
.promotion-table td button:hover {
  background-color: #0056b3;
}
.promotion-table td input {
  width: 80px;
  padding: 4px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.confirm-button {
  background-color: #28a745;
}
.confirm-button:hover {
  background-color: #218838;
}
.cancel-button {
  background-color: #dc3545;
}
.cancel-button:hover {
  background-color: #c82333;
}
.edit-button {
  background-color: #17a2b8;
}
.edit-button:hover {
  background-color: #138496;
}
</style>
