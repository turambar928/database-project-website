<template>
    <div class="stats-container">
      <h1>志愿者统计</h1>
      <div class="stat-section">
        <div class="stat-box">
          <h2>志愿者申请统计</h2>
          <div class="stat-value">{{ animatedVisitCount }} 次</div>
        </div>
        <div class="stat-box">
          <h2>志愿者总数达</h2>
          <div class="stat-value">{{ animatedTotalUsers }} 人</div>
        </div>
      </div>
      <div class="chart-section">
        <div class="chart-box">
          <h2>每月人均接单次数折线图</h2>
          <canvas id="lineChart"></canvas>
        </div>
        <div class="chart-box">
          <h2>志愿者得分排行榜</h2>
          <table>
            <thead>
              <tr>
                <th>姓名</th>
                <th>接单次数</th>
                <th>平均得分</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="volunteer in volunteers" :key="volunteer.name">
                <td>{{ volunteer.name }}</td>
                <td>{{ volunteer.orders }}</td>
                <td>{{ volunteer.score }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { Chart, registerables } from 'chart.js';
  
  Chart.register(...registerables);
  
  export default {
    setup() {
      const visitCount = ref(12);
      const totalUsers = ref(12);
      const monthlyNewUsers = ref(3);
  
      const animatedVisitCount = ref(0);
      const animatedTotalUsers = ref(0);
      const animatedMonthlyNewUsers = ref(0);
  
      const visitData = [20, 25, 30, 35, 40]; // 示例数据
      const volunteers = ref([
        { name: '张三', orders: 12, score: 90 },
        { name: '李四', orders: 15, score: 85 },
        { name: '王五', orders: 10, score: 88 }
      ]); // 示例数据
  
      let chartInstance = null;
  
      const animateValue = (refValue, targetValue, duration) => {
        let start = 0;
        const step = targetValue / (duration / 10);
        const interval = setInterval(() => {
          start += step;
          if (start >= targetValue) {
            refValue.value = targetValue;
            clearInterval(interval);
          } else {
            refValue.value = Math.floor(start);
          }
        }, 10);
      };
  
      const drawLineChart = () => {
        const canvas = document.getElementById('lineChart');
        const ctx = canvas.getContext('2d');
        if (chartInstance) {
          chartInstance.destroy(); // 销毁之前的图表实例
        }
        chartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['项目1', '项目2', '项目3', '项目4', '项目5'],
            datasets: [{
              label: '每月接单次数',
              data: visitData,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderWidth: 2,
              pointBackgroundColor: 'rgba(75, 192, 192, 1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(75, 192, 192, 1)'
            }]
          },
          options: {
            responsive: true,
            animation: {
              duration: 700,
              easing: 'easeInOutQuad'
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  color: '#555'
                },
                grid: {
                  color: '#ddd'
                }
              },
              x: {
                ticks: {
                  color: '#555'
                },
                grid: {
                  color: '#ddd'
                }
              }
            },
            plugins: {
              legend: {
                display: true,
                labels: {
                  color: '#333'
                }
              }
            }
          }
        });
      };
  
      onMounted(() => {
        const duration = 700; // 规定时间为 700 毫秒
        animateValue(animatedVisitCount, visitCount.value, duration);
        animateValue(animatedTotalUsers, totalUsers.value, duration);
        animateValue(animatedMonthlyNewUsers, monthlyNewUsers.value, duration);
        drawLineChart();
      });
  
      onBeforeUnmount(() => {
        if (chartInstance) {
          chartInstance.destroy(); // 组件卸载前销毁图表实例
        }
      });
  
      return {
        visitCount,
        totalUsers,
        monthlyNewUsers,
        animatedVisitCount,
        animatedTotalUsers,
        animatedMonthlyNewUsers,
        volunteers
      };
    }
  };
  </script>
  
  <style scoped>
  .stats-container {
    max-width: 1200px;
    margin: auto;
    padding: 20px;
    font-family: Arial, sans-serif;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
  }
  
  .stat-section {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
  }
  
  .stat-box {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 250px;
  }
  
  .stat-box h2 {
    font-size: 1.2em;
    color: #555;
    margin-bottom: 10px;
  }
  
  .stat-value {
    font-size: 2em;
    font-weight: bold;
    color: #333;
  }
  
  .chart-section {
    display: flex;
    justify-content: space-around;
  }
  
  .chart-box {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 45%;
  }
  
  .chart-box h2 {
    font-size: 1.2em;
    color: #555;
    margin-bottom: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }
  
  th {
    background-color: #f2f2f2;
    color: #333;
  }
  
  canvas {
  display: block;
  margin: auto;
  width: 100%;
  height: 100%;
}

svg {
  display: block;
  margin: auto;
  width: 100%;
  height: 100%;
}
  </style>
  