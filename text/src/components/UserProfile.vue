<template>
  <div class="user-profile">
    <div class="profile-card">
      <div class="profile-section">
        <div class="profile-header">关于我</div>
        <img src="/xian.png" alt="Divider" class="divider-image"/>
      </div>
      <img src="/avatar.jpg" alt="User" class="user-image"/>
      <h2>人名</h2>
      <p>管理员</p>
      <div class="profile-section">
        <div class="profile-privilege">权限</div>
        <img src="/xian.png" alt="Divider" class="divider-image"/>
        <button class="finance-button">财务</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserProfile',
};
</script>

<style scoped>
.user-profile {
  position: absolute;
  top: 20px;
  left: 20px;
}

.profile-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 250px;
  position: relative;
}

.profile-section {
  width: 100%;
  text-align: left;
  margin-bottom: 10px;
}

.profile-header, .profile-privilege {
  font-size: 14px;
  font-weight: bold;
  color: #D8CBA7; /* 使用与提供图片相同的颜色 */
}

.divider-image {
  width: 100%;
  margin: 5px 0;
}

.user-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-top: 10px;
  margin-bottom: 10px;
}

h2 {
  margin: 10px 0 5px;
  font-size: 20px;
  font-weight: bold;
}

p {
  margin: 5px 0;
  font-size: 14px;
  color: #777;
}

.finance-button {
  background-color: #e0f7fa;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  color: #00796b;
  cursor: pointer;
  margin-top: 10px;
}
</style>
