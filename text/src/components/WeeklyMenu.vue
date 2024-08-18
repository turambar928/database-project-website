<template>
  <div class="weekly-menu">
    <div class="header">
      <h1>每周菜单</h1>
      <div class="date-picker">
        <label for="menu-date">
          <i class="calendar-icon"></i>
        </label>
        <input type="date" v-model="menuDate" id="menu-date" @change="fetchWeeklyMenu" />
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
            <button v-if="status === '可编辑'" class="remove-button" @click="removeDish(day, dish.id)">X</button>
          </div>
        </div>
        <button v-if="status === '可编辑'" class="add-button" @click="openAddDishDialog(day)">+</button>
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
        <input type="text" v-model="newDish.name" id="dish-name" list="dish-names" />
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
import axios from 'axios';

export default {
  data() {
    return {
      menuDate: new Date().toISOString().split('T')[0], // 默认为今天
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
  computed: {
    isCurrentWeek() {
      const selectedDate = new Date(this.menuDate);
      const currentDate = new Date();
      const currentWeekStart = this.getWeekStartDate(currentDate);
      const selectedWeekStart = this.getWeekStartDate(selectedDate);
      return currentWeekStart.getTime() === selectedWeekStart.getTime();
    },
    status() {
      return this.isCurrentWeek ? "可编辑" : "可查看";
    },
  },
  methods: {
  fetchWeeklyMenu() {
    const selectedDate = new Date(this.menuDate);
    const weekStartDate = this.getWeekStartDate(selectedDate);
    axios.get(`/api/menu?date=${weekStartDate.toISOString().split('T')[0]}`)
      .then(response => {
        this.weeklyMenu = response.data; // 假设API返回的格式与weeklyMenu相同
      })
      .catch(error => {
        console.error('Error fetching menu:', error);
      });
  },
  getWeekStartDate(date) {
  const dayOfWeek = date.getDay(); // 获取星期几，0（周日）到 6（周六）
  const startOfWeek = new Date(date);
  startOfWeek.setHours(0, 0, 0, 0); // 将时间部分设为 00:00:00.000
  const diff = (dayOfWeek === 0 ? 6 : dayOfWeek - 1); // 计算到周一的差距
  startOfWeek.setDate(date.getDate() - diff); // 得到周一的日期
  return startOfWeek;
},
  openAddDishDialog(day) {
    if (this.status === '可编辑') {
      this.currentDay = day;
      this.showDialog = true;
    }
  },
  closeAddDishDialog() {
    this.showDialog = false;
  },
  addDish() {
    if (this.newDish.name && this.newDish.category) {
      axios.post('/api/menu/add', {
        date: this.menuDate,
        day: this.currentDay,
        dish: {
          category: this.newDish.category,
          name: this.newDish.name
        }
      }).then(response => {
        this.weeklyMenu[this.currentDay].push(response.data.dish);
        this.newDish = { category: "", name: "" };
        this.closeAddDishDialog();
      }).catch(error => {
        console.error('Error adding dish:', error);
      });
    } else {
      alert("请填写完整的菜品信息");
    }
  },
  removeDish(day, id) {
  if (this.status === '可编辑') {
    axios.delete(`/api/menu/${id}`)
      .then(response => {
        // 假设后端返回更新后的当天菜品数组
        this.weeklyMenu[day] = response.data.updatedDishes;
      })
      .catch(error => {
        console.error('Error removing dish:', error);
      });
  }
}

},
  mounted() {
    this.fetchWeeklyMenu(); // 组件加载时获取当前周的菜单
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
  border: 1px solid #413d3d;
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
.remove-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}
.remove-button:hover {
  background-color: #c0392b;
}
.add-button {
  background-color: green;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
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
