<template>
  <div class="stats-container">
    <h1>用户统计</h1>
    <div class="stat-section">
      <div class="stat-box">
        <h2>页面访问统计</h2>
        <div class="stat-value">{{ animatedVisitCount }} 次</div>
      </div>
      <div class="stat-box">
        <h2>注册用户总数</h2>
        <div class="stat-value">{{ animatedTotalUsers }} 人</div>
      </div>
      <div class="stat-box">
        <h2>月均新增用户数</h2>
        <div class="stat-value">{{ animatedMonthlyNewUsers }} 人</div>
      </div>
    </div>
    <div class="chart-section">
      <div class="chart-box">
        <h2>每月访问网站的数量折线图</h2>
        <canvas id="lineChart"></canvas>
      </div>
      <div class="chart-box">
        <h2>用户评价词云</h2>
        <svg id="wordCloud"></svg>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Chart, registerables } from 'chart.js';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

Chart.register(...registerables);

export default {
  setup() {
    const visitCount = ref(12);
    const totalUsers = ref(12);
    const monthlyNewUsers = ref(3);

    const animatedVisitCount = ref(0);
    const animatedTotalUsers = ref(0);
    const animatedMonthlyNewUsers = ref(0);

    const visitData = [20, 25, 15, 35, 30]; // 示例数据
    const wordData = [
      { text: '舒适', size: 40 },
      { text: '不懂', size: 30 },
      { text: '质量', size: 20 },
      { text: '包装', size: 50 },
      { text: '手感', size: 60 },
      { text: '娃娃', size: 30 },
      { text: '哈哈', size: 36 },
      { text: '嘻嘻', size: 42 },
      { text: '呵呵', size: 11 },
      { text: '呃呃', size: 3 },
      { text: '实惠', size: 22 },
      { text: '便宜', size: 60 },
      { text: '好吃', size: 28 },
      { text: '丰盛', size: 33 },
      { text: '方便', size: 41 },
      { text: '快捷', size: 11 },
    ]; // 示例数据

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
            label: '每月访问量',
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

    const drawWordCloud = () => {
      d3.select('#wordCloud').selectAll('*').remove();  // 清除已有的 SVG 元素

      const layout = cloud()
        .size([500, 300])
        .words(wordData)
        .padding(5)
        .rotate(() => ~~(Math.random() * 2) * 90)
        .font('Impact')
        .fontSize(d => d.size)
        .on('end', draw);

      layout.start();

      function draw(words) {
        d3.select('#wordCloud')
          .attr('width', layout.size()[0])
          .attr('height', layout.size()[1])
          .append('g')
          .attr('transform', `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`)
          .selectAll('text')
          .data(words)
          .enter().append('text')
          .style('font-size', d => `${d.size}px`)
          .style('font-family', 'Impact')
          .style('fill', (d, i) => d3.schemeCategory10[i % 10])
          .attr('text-anchor', 'middle')
          .attr('transform', d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
          .text(d => d.text)
          .on('mouseover', function (event, d) {
            d3.select(this).transition()
              .duration(200)
              .style('font-size', `${d.size * 1.5}px`)
              .style('fill', 'red');
          })
          .on('mouseout', function (event, d) {
            d3.select(this).transition()
              .duration(200)
              .style('font-size', `${d.size}px`)
              .style('fill', d3.schemeCategory10[d.size % 10]);
          });
      }
    };

    onMounted(() => {
      const duration = 700; // 规定时间为 2000 毫秒
      animateValue(animatedVisitCount, visitCount.value, duration);
      animateValue(animatedTotalUsers, totalUsers.value, duration);
      animateValue(animatedMonthlyNewUsers, monthlyNewUsers.value, duration);
      drawLineChart();
      drawWordCloud();
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
      animatedMonthlyNewUsers
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
