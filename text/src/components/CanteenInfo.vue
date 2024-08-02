<template>
  <div class="canteen-info">
    <h1>食堂信息</h1>
    <div class="canteen-details">
      <div class="canteen-images">
        <div v-for="(image, index) in canteenImages" :key="index" class="canteen-image">
          <img :src="image" alt="Canteen Image" />
        </div>
      </div>
      <div class="canteen-description">
        <h2>{{ canteenName }}</h2>
        <p><strong>地址:</strong> {{ canteenAddress }}</p>
        <p><strong>联系电话:</strong> {{ canteenPhone }}</p>
        <p><strong>开放时间:</strong> {{ canteenHours }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CanteenInfo',
  data() {
    return {
      canteenImages: [
        'canteen1.jpg', // 替换为 public 文件夹中的图片路径
        'canteen2.jpg',
        'canteen3.jpg',
      ],
      canteenName: '长者食堂',
      canteenAddress: '癫火教堂',
      canteenPhone: '123-456-7890',
      canteenHours: '每天 8:00 - 20:00'
    };
  }
};
</script>

<style scoped>
.canteen-info {
  max-width: 1000px;
  margin: auto;
  padding: 20px;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  background-color: #fdfdff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #ff6f61;
  margin-bottom: 20px;
  font-size: 2.5em;
}

.canteen-details {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.canteen-images {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.canteen-image img {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 300px;
  height: auto;
}

.canteen-description {
  text-align: center;
  margin-top: 20px;
}

.canteen-description h2 {
  color: #333;
  font-size: 2em;
  margin-bottom: 10px;
}

.canteen-description p {
  font-size: 1.2em;
  color: #555;
  margin: 5px 0;
}

.canteen-description strong {
  color: #ff6f61;
}
</style>
