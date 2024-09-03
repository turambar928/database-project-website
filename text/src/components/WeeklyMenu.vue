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
            <button v-if="status === '可编辑'" class="remove-button" @click="removeDish(day, dish.id)">
              <img src="close.png" alt="Remove" class="icon" />
            </button>
          </div>
          <button v-if="status === '可编辑'" class="add-button" @click="openAddDishDialog(day)">+</button>
        </div>
      </div>
    </div>

    <div class="add-dish-dialog" v-if="showDialog">
      <div class="dialog-content">
        <h3>添加菜品</h3>
        <button class="close-button" @click="closeAddDishDialog">
          <img src="close.png" alt="Close" class="icon" />
        </button>
        <label for="dish-select">选择菜品</label>
        <select v-model="selectedDishId" id="dish-select">
          <option value="">请选择菜品</option>
          <!-- 动态生成的菜品选项 -->
          <option v-for="dish in availableDishes" :key="dish.dishId" :value="dish.dishId">
            {{ dish.dishName }} ({{ dish.category }})
          </option>
        </select>
        <button class="confirm-button" @click="addDish">确认</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

// 配置全局的axios默认值
axios.defaults.baseURL = 'http://8.136.125.61/api';
axios.defaults.headers.common['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxNjgwMDAwMiIsInJvbGUiOiJhZG1pbiIsIm5iZiI6MTcyNTEyMjMxNywiZXhwIjoyMDg1MTIyMzE3LCJpYXQiOjE3MjUxMjIzMTcsImlzcyI6InlvdXJfaXNzdWVyIiwiYXVkIjoieW91cl9hdWRpZW5jZSJ9.iuxCr68lU34uW5KsZj2c15bwTFsdiguorpWyo_6quP0';

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
      availableDishes: [], // 用于存储可选菜品
      selectedDishId: "", // 用户选择的菜品ID
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
      const url = `http://8.136.125.61/api/menu?date=${selectedDate.toISOString().split('T')[0]}`;

      axios.get(url)
          .then(response => {
            if (response.data) {
              const menuData = response.data;
              this.weeklyMenu = {
                "星期一": menuData.mon || [],
                "星期二": menuData.tue || [],
                "星期三": menuData.wed || [],
                "星期四": menuData.thu || [],
                "星期五": menuData.fri || [],
                "星期六": menuData.sat || [],
                "星期日": menuData.sun || []
              };
            } else {
              console.error('获取菜单失败: 数据为空或格式不正确');
              this.clearWeeklyMenu();
            }
          })
          .catch(error => {
            console.error('Error fetching menu:', error);
            this.clearWeeklyMenu();
          });
    },
    clearWeeklyMenu() {
      this.weeklyMenu = {
        "星期一": [],
        "星期二": [],
        "星期三": [],
        "星期四": [],
        "星期五": [],
        "星期六": [],
        "星期日": [],
      };
    },
    getWeekStartDate(date) {
      const dayOfWeek = date.getDay();
      const startOfWeek = new Date(date);
      startOfWeek.setHours(0, 0, 0, 0);
      const diff = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
      startOfWeek.setDate(date.getDate() - diff);
      return startOfWeek;
    },
    openAddDishDialog(day) {
      if (this.status === '可编辑') {
        this.currentDay = day;
        this.showDialog = true;
        this.fetchAvailableDishes();
      }
    },
    closeAddDishDialog() {
      this.showDialog = false;
      this.selectedDishId = "";
    },



    fetchAvailableDishes() {
      axios.get('http://8.136.125.61/api/dish/search')
          .then(response => {
            console.log('API 响应完整数据:', response);

            if (response.data.success) {
              // 检查 API 返回的数据结构是否正确
              if (Array.isArray(response.data.dish)) {
                this.availableDishes = response.data.dish; // 使用 API 返回的菜品数据填充 availableDishes
                console.log('加载的可选菜品列表:', this.availableDishes); // 打印菜品列表到控制台
              } else {
                console.error('API 返回的菜品数据格式不正确:', response.data.dish);
              }
            } else {
              console.error('加载可选菜品失败:', response.data.msg);
            }
          })
          .catch(error => {
            console.error('获取可选菜品时出错:', error);
            if (error.response) {
              console.error('错误响应数据:', error.response.data);
            }
          });
    },



    addDish() {
      if (this.selectedDishId && this.currentDay) {
        const selectedDish = this.availableDishes.find(dish => dish.dishId === this.selectedDishId);

        if (!selectedDish) {
          console.error('在可选菜品中找不到所选菜品。');
          return;
        }

        // 将中文的星期几转换为英文缩写
        const dayMap = {
          "星期一": "Mon",
          "星期二": "Tue",
          "星期三": "Wed",
          "星期四": "Thu",
          "星期五": "Fri",
          "星期六": "Sat",
          "星期日": "Sun"
        };
        const englishDay = dayMap[this.currentDay];

        if (!englishDay) {
          console.error('无法转换星期几为英文缩写:', this.currentDay);
          return;
        }

        console.log('正在添加的菜品:', selectedDish, '选择的日期:', englishDay);

        // 发送添加请求
        axios.post('http://8.136.125.61/api/menu/add', {
          date: this.menuDate, // 用户选择的日期
          //day: englishDay, // 转换后的星期几（英文缩写）
          Day: englishDay, // 字段名需要与后端一致
          DishId: selectedDish.dishId, // DishId 在请求体的顶层
          dish: {
            category: selectedDish.category,
            name: selectedDish.dishName,
            //id: selectedDish.dishId // 添加 id 字段，确保与后端结构匹配
          },
          success: true, // 后端可能需要这个字段，你可以先尝试硬编码它
          message: "" // 如果需要，你可以初始化一个空字符串或根据需要传递实际的消息
        })
            .then(response => {
              console.log('后端响应:', response.data); // 打印完整的响应数据

              if (response.data.success) {
                console.log('菜品添加成功:', response.data);

                // 刷新菜单
                this.fetchWeeklyMenu();

                this.newDish = { category: "", name: "" }; // 重置新菜品输入
                this.closeAddDishDialog();
              } else {
                console.error('添加菜品失败:', response.data.message);
              }
            })
            .catch(error => {
              console.error('添加菜品时出错:', error);
              if (error.response) {
                console.error('后端返回错误:', error.response.data);
              }
            });
      } else {
        alert("请选择一个菜品和日期以添加。");
      }
    },



    convertDayToAbbreviation(day) {
      const dayMap = {
        "星期一": "Mon",
        "星期二": "Tue",
        "星期三": "Wed",
        "星期四": "Thu",
        "星期五": "Fri",
        "星期六": "Sat",
        "星期日": "Sun"
      };
      return dayMap[day];
    },
    removeDish(day, id) {
      if (this.status === '可编辑') {
        const requestPayload = {
          date: this.menuDate,
          day: day,
          dishId: id
        };

        axios.delete('http://8.136.125.61/api/menu/delete', {
          headers: {
            'Authorization': axios.defaults.headers.common['Authorization'],
            'Content-Type': 'application/json'
          },
          data: requestPayload
        }).then(response => {
          if (response.data.success) {
            console.log('菜品删除成功');
            this.fetchWeeklyMenu();
          } else {
            console.error('删除菜品失败:', response.data.message);
          }
        }).catch(error => {
          console.error('Error removing dish:', error);
        });
      }
    }
  },
  mounted() {
    this.fetchWeeklyMenu();
  },
};
</script>

<style scoped>
.weekly-menu {
  font-family: Arial, Helvetica, sans-serif;
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
  position: relative;
}
.dish-list {
  margin-top: 10px;
}
.dish-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  background: #f9f9f9;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;
}
.remove-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  position: absolute;
  right: -30px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.remove-button .icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}
.remove-button:hover .icon {
  transform: scale(1.2);
}

.add-button {
  background-color: green;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 20px;
  line-height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  margin-top: 15px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.add-button:hover {
  background-color: #27ae60;
  transform: scale(1.1);
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
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
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
  width: 15px;
  height: 15px;
  transition: transform 0.3s ease;
}
.close-button:hover .icon {
  transform: scale(1.2);
}

.confirm-button {
  background-color: green;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  margin-top: 10px;
  border-radius: 5px;
  font-size: 14px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.confirm-button:hover {
  background-color: #27ae60;
  transform: scale(1.05);
}
</style>
