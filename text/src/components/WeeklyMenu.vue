<template>
    <div class="weekly-menu">
      <div class="header">
        <h1>每周菜单</h1>
        <div class="date-picker">
          <label for="menu-date">
            <i class="calendar-icon"></i>
          </label>
          <input type="date" v-model="menuDate" id="menu-date" />
        </div>
        <div class="status">
          状态: {{ status }}
        </div>
      </div>
  
      <div class="menu-grid">
        <div class="day" v-for="day in days" :key="day">
          <h2>{{ day }}</h2>
          <div class="dish-list">
            <div class="dish-item" v-for="dish in weeklyMenu[day]" :key="dish.id">
              <span>{{ dish.name }}</span>
              <button @click="removeDish(day, dish.id)">删除</button>
            </div>
          </div>
          <button class="add-button" @click="openAddDishDialog(day)">+</button>
        </div>
      </div>
  
      <div class="add-dish-dialog" v-if="showDialog">
        <div class="dialog-content">
          <h3>添加菜品</h3>
          <button class="close-button" @click="closeAddDishDialog">X</button>
          <label for="category">类别</label>
          <select v-model="newDish.category" id="category">
            <option value="category1">类别1</option>
            <option value="category2">类别2</option>
            <!-- 添加更多类别选项 -->
          </select>
          <label for="dish-name">菜品名称</label>
          <input
            type="text"
            v-model="newDish.name"
            id="dish-name"
            list="dish-names"
          />
          <datalist id="dish-names">
            <option value="菜品1"></option>
            <option value="菜品2"></option>
            <!-- 添加更多菜品名称 -->
          </datalist>
          <button class="confirm-button" @click="addDish">确认</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        menuDate: "",
        status: "可编辑/可查看",
        days: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
        weeklyMenu: {
          "星期一": [],
          "星期二": [],
          "星期三": [],
          "星期四": [],
          "星期五": [],
          "星期六": [],
          "星期日": [],
        },
        showDialog: false,
        currentDay: "",
        newDish: {
          category: "",
          name: "",
        },
      };
    },
    methods: {
      openAddDishDialog(day) {
        this.currentDay = day;
        this.showDialog = true;
      },
      closeAddDishDialog() {
        this.showDialog = false;
      },
      addDish() {
        if (this.newDish.name && this.newDish.category) {
          this.weeklyMenu[this.currentDay].push({
            id: Date.now(),
            category: this.newDish.category,
            name: this.newDish.name,
          });
          this.newDish = { category: "", name: "" };
          this.closeAddDishDialog();
        } else {
          alert("请填写完整的菜品信息");
        }
      },
      removeDish(day, id) {
        this.weeklyMenu[day] = this.weeklyMenu[day].filter((dish) => dish.id !== id);
      },
    },
  };
  </script>
  
  <style scoped>
  .weekly-menu {
    font-family: 楷体;
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
  }
  .menu-grid {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  .day {
    width: 13%;
    border: 1px solid #ccc;
    padding: 10px;
    text-align: center;
  }
  .dish-list {
    margin-top: 10px;
  }
  .dish-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
  }
  .add-button {
    background-color: green;
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
  }
  .add-dish-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border: 1px solid #ccc;
    padding: 20px;
    z-index: 1000;
  }
  .dialog-content {
    position: relative;
  }
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: red;
    color: white;
    border: none;
    cursor: pointer;
  }
  .confirm-button {
    background: green;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
  }
  </style>
  