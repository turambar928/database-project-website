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
      <button class="status" @click="openBatchManage">批量管理</button>
    </div>

    <!-- 批量管理对话框 -->
    <div v-if="showBatchManageDialog" class="batch-manage-dialog">
      <div class="dialog-content">
        <h3>批量管理</h3>
        <button class="close-button" @click="closeBatchManageDialog">
          <img src="close.png" alt="Close" class="icon" />
        </button>
        <div class="dish-selection">
          <div v-for="dish in dishes" :key="dish.id" class="dish-item">
            <input type="checkbox" v-model="selectedDishes" :value="dish.id" />
            <label>{{ dish.name }}</label>
          </div>
        </div>
        <div class="discount-section">
          <label for="discount">折扣率: </label>
          <input type="number" v-model="discount" min="0" max="100" step="1" />
          <span>%</span>
        </div>
        <button class="confirm-button" @click="applyDiscount">确认</button>
      </div>
    </div>

    <table class="promotion-table">
      <thead>
      <tr>
        <th>菜品</th>
        <th>类别</th>
        <th>原价</th>
        <th>现价</th>
        <th>折扣率</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(dish, index) in dishes" :key="dish.id">
        <td>{{ dish.name }}</td>
        <td>{{ dish.category }}</td>
        <td>{{ dish.originalPrice !== undefined ? dish.originalPrice.toFixed(2) : 'N/A' }} 元</td>
        <td>
          {{ dish.currentPrice !== undefined ? dish.currentPrice.toFixed(2) : 'N/A' }} 元
        </td>
        <td>
          <div v-if="editingIndex === index">
            <input type="number" v-model="dish.discountRate" min="0" max="100" class="edit-input" />
            <div class="edit-buttons">
              <button @click="confirmEdit(dish.id)" class="confirm-button small">确认</button>
              <button @click="cancelEdit" class="cancel-button small">取消</button>
            </div>
          </div>
          <div v-else>
            {{ dish.discountRate ? dish.discountRate + '' : 'N/A' }}
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
      promotionDate: this.getCurrentDate(),
      editingIndex: null,
      dishes: [],
      showBatchManageDialog: false,
      selectedDishes: [],
      discount: null,
    };
  },
  methods: {
    getCurrentDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    fetchDishes() {
      const url = `http://8.136.125.61/api/menu/getDiscount?week=${this.promotionDate}`;

      axios.get(url, {
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxNjgwMDAwMiIsInJvbGUiOiJhZG1pbiIsIm5iZiI6MTcyNTEyMjMxNywiZXhwIjoyMDg1MTIyMzE3LCJpYXQiOjE3MjUxMjIzMTcsImlzcyI6InlvdXJfaXNzdWVyIiwiYXVkIjoieW91cl9hdWRpZW5jZSJ9.iuxCr68lU34uW5KsZj2c15bwTFsdiguorpWyo_6quP0'
        }
      }).then(response => {
        console.log('API response:', response.data);
        this.dishes = response.data.dishes.map(dish => ({
          ...dish,
          discountRate: 0,
          currentPrice: dish.originalPrice // 初始现价等于原价
        }));
      }).catch(error => {
        console.error('Error fetching dishes:', error);
      });
    },
    editPrice(index) {
      this.editingIndex = index;
    },
    confirmEdit(dishId) {
      const dish = this.dishes[this.editingIndex];
      const discount = dish.discountRate / 100; // 将折扣率转换为小数

      // 计算折扣后的价格
      const discountedPrice = dish.originalPrice * (1 - discount);
      dish.currentPrice = discountedPrice; // 更新现价

      // 调用 API 更新折扣信息
      axios.put('http://8.136.125.61/api/menu/uploadDiscount', {
        date: this.promotionDate,
        dishId: dishId,
        discount: dish.discountRate // 传递折扣率给后端
      })
          .then(response => {
            // 假设后端返回的是更新后的价格
            const updatedDish = response.data;
            const updatedPrice = updatedDish.updatedPrice; // 假设返回的字段名是 'updatedPrice'

            // 更新本地的 dishes 数组
            this.dishes = this.dishes.map(d =>
                d.id === dishId
                    ? { ...d, currentPrice: updatedPrice, discountRate: dish.discountRate }
                    : d
            );
            this.editingIndex = null; // 清除编辑状态
            console.log('折扣率:', dish.discountRate, '现价:', updatedPrice); // 打印折扣率和现价
          })
          .catch(error => {
            console.error('Error updating price:', error);
          });
    },
    cancelEdit() {
      this.editingIndex = null;
      this.fetchDishes();
    },
    openBatchManage() {
      this.showBatchManageDialog = true;
      this.fetchDishes();
    },
    closeBatchManageDialog() {
      this.showBatchManageDialog = false;
    },
    applyDiscount() {
      if (this.selectedDishes.length === 0 || this.discount <= 0 || this.discount > 100) {
        alert("请正确选择菜品并设置有效的折扣！");
        return;
      }
      axios.post('/api/weeklymenu/batch-discount', {
        dishIds: this.selectedDishes,
        discount: this.discount
      }).then(() => {
        this.closeBatchManageDialog();
        this.fetchDishes();
        alert("折扣已成功应用！");
      }).catch(error => {
        console.error('Error applying discount:', error);
      });
    },
  },
  mounted() {
    this.fetchDishes();
  }
}
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
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}
.status:hover {
  background-color: #0056b3;
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
.promotion-table td input.edit-input {
  width: 80px;
  padding: 4px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
}
.confirm-button.small,
.cancel-button.small {
  width: 60px;
  padding: 6px;
  font-size: 14px;
  text-align: center;
  display: inline-block;
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
.edit-buttons {
  display: block;
  justify-content: center;
}
.batch-manage-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border: 1px solid #ccc;
  padding: 20px;
  z-index: 1000;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
.dialog-content {
  position: relative;
}
.close-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.close-button .icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}
.close-button:hover .icon {
  transform: scale(1.2);
}
.dish-selection {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #d3d3d3;
}
.dish-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.dish-item label {
  margin-left: 10px;
}
.discount-section {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.discount-section label {
  margin-right: 10px;
}
.confirm-button {
  margin-top: 20px;
  width: 100%;
}
</style>
