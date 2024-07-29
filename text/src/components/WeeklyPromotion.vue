<template>
    <div class="weekly-promotion">
      <div class="header">
        <h1>每周促销</h1>
        <div class="date-picker">
          <label for="promotion-date">
            <i class="calendar-icon"></i>
          </label>
          <input type="date" v-model="promotionDate" id="promotion-date" />
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
            <td>{{ dish.originalPrice }}</td>
            <td>
              <div v-if="editingIndex === index">
                <input type="text" v-model="dish.currentPrice" />
                <button @click="confirmEdit">确认</button>
                <button @click="cancelEdit">取消</button>
              </div>
              <div v-else>
                {{ dish.currentPrice }}
              </div>
            </td>
            <td>
              <button v-if="editingIndex !== index" @click="editPrice(index)">修改</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        promotionDate: "",
        editingIndex: null,
        dishes: [
          { id: 1, name: "番茄炒蛋", category: "素菜", originalPrice: 4, currentPrice: 4 },
          { id: 2, name: "鱼香茄子盖浇饭", category: "素菜", originalPrice: 9, currentPrice: 9 },
          { id: 3, name: "肉末蒸蛋", category: "荤菜", originalPrice: 8, currentPrice: 8 },
          // 添加更多菜品信息
        ]
      };
    },
    methods: {
      editPrice(index) {
        this.editingIndex = index;
      },
      confirmEdit() {
        this.editingIndex = null;
        // 可以在此处添加保存修改后的价格到后端的逻辑
      },
      cancelEdit() {
        this.editingIndex = null;
        // 取消修改时，恢复原来的价格
        this.dishes = this.dishes.map(dish => {
          return { ...dish, currentPrice: dish.originalPrice };
        });
      }
    }
  };
  </script>
  
  <style scoped>
  .weekly-promotion {
    font-family: Arial, sans-serif;
    padding: 20px;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .date-picker {
    display: flex;
    align-items: center;
  }
  .calendar-icon {
    margin-right: 10px;
  }
  .status {
    margin-left: 20px;
    background-color: #007bff;
    color: white;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
  }
  .promotion-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  .promotion-table th,
  .promotion-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }
  .promotion-table th {
    background-color: #f2f2f2;
  }
  .promotion-table td button {
    margin: 0 5px;
  }
  .promotion-table td input {
    width: 60px;
    text-align: center;
  }
  </style>
  