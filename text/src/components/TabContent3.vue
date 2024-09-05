<template>
  <div class="tab-content-3">
    <!-- 静态展示账户信息 -->
    <div class="form-group" v-for="(field, index) in fields" :key="index">
      <div class="label-container">
        <label>{{ field.label }}</label>
        <span>：</span>
      </div>
      <!-- 显示头像 -->
      <template v-if="field.name === 'portrait'">
        <img :src="field.value" alt="用户头像" class="user-avatar" />
      </template>
      <!-- 显示非头像的字段值 -->
      <template v-else>
        <span v-if="!isEditing || field.name === 'idCard' || field.name === 'money'" class="field-value">{{ field.value }}</span>
        <!-- 显示可编辑的输入框 -->
        <template v-if="isEditing && editableFields.includes(field.name)">
          <input
              v-if="field.name !== 'gender' && field.name !== 'birthDate' && field.name !== 'phoneNum'"
              type="text"
              v-model="field.value"
              class="edit-input"
          />
          <select v-if="field.name === 'gender'" v-model="field.value" class="edit-input">
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
          <input
              v-if="field.name === 'birthDate'"
              type="date"
              v-model="field.value"
              class="edit-input"
          />
          <!-- 电话号码输入框 -->
          <input
              v-if="field.name === 'phoneNum'"
              type="text"
              v-model="field.value"
              @blur="validatePhoneNumber"
              class="edit-input"
              maxlength="11"
              placeholder="请输入11位电话号码"
          />
        </template>
      </template>
    </div>

    <!-- 更新按钮 或 确认/取消按钮 -->
    <button v-if="!isEditing" class="update-button" @click="startEditing">更新</button>
    <div v-else class="edit-buttons-container">
      <button class="small-button confirm-button" @click="confirmUpdate">确认修改</button>
      <button class="small-button cancel-button" @click="cancelEditing">取消</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabContent3',
  data() {
    return {
      isEditing: false, // 编辑模式标志
      fields: [
        { label: '账户名称', name: 'accountName', type: 'text', value: '' },
        { label: '手机号', name: 'phoneNum', type: 'text', value: '' },
        { label: '性别', name: 'gender', type: 'text', value: '' },
        { label: '生日', name: 'birthDate', type: 'text', value: '' },
        { label: '身份证', name: 'idCard', type: 'text', value: '' },
        { label: '邮箱', name: 'email', type: 'text', value: '' },
        { label: '地址', name: 'address', type: 'text', value: '' },
        { label: '剩余金额', name: 'money', type: 'text', value: '' },
        { label: '头像', name: 'portrait', type: 'text', value: '' }
      ],
      editableFields: ['accountName', 'phoneNum', 'gender', 'birthDate', 'email', 'address'], // 可编辑字段
      token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxNjgwMDAxNiIsInJvbGUiOiJhZG1pbiIsIm5iZiI6MTcyNTQ1NDYxMSwiZXhwIjoxNzI1NTQxMDExLCJpYXQiOjE3MjU0NTQ2MTEsImlzcyI6InlvdXJfaXNzdWVyIiwiYXVkIjoieW91cl9hdWRpZW5jZSJ9.r9SFdp9ChD9jVDX4qmp97pyWr7uF81ct6yXgORksdbw'
    };
  },
  methods: {
    fetchUserInfo() {
      fetch('http://8.136.125.61/api/Admin/getAdminInfo', {
        method: 'GET',
        headers: {
          'Authorization': this.token,
          'Content-Type': 'application/json',
        },
      })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              this.fields = [
                { label: '账户名称', name: 'accountName', type: 'text', value: data.response.accountName },
                { label: '手机号', name: 'phoneNum', type: 'text', value: data.response.phoneNum },
                { label: '性别', name: 'gender', type: 'text', value: data.response.gender },
                { label: '生日', name: 'birthDate', type: 'date', value: data.response.birthDate },
                { label: '身份证', name: 'idCard', type: 'text', value: data.response.idCard },
                { label: '邮箱', name: 'email', type: 'text', value: data.response.email },
                { label: '地址', name: 'address', type: 'text', value: data.response.address },
                { label: '剩余金额', name: 'money', type: 'text', value: data.response.money },
                { label: '头像', name: 'portrait', type: 'text', value: data.response.portrait }
              ];
            } else {
              console.error(data.msg);
            }
          })
          .catch((error) => console.error('获取用户数据时出错:', error));
    },
    startEditing() {
      this.isEditing = true;
    },
    cancelEditing() {
      this.isEditing = false;
      this.fetchUserInfo(); // 重新获取用户信息
    },
    confirmUpdate() {
      const updatedData = {};
      this.fields.forEach((field) => {
        if (this.editableFields.includes(field.name)) {
          updatedData[field.name] = field.value;
        }
      });

      fetch('http://8.136.125.61/api/Admin/alterAdminInfo', {
        method: 'POST',
        headers: {
          'Authorization': this.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })
          .then((response) => response.json())
          .then((data) => {
            if (data.alterSuccess) {
              alert(data.msg); // 提示成功消息
              this.isEditing = false;
              this.fetchUserInfo(); // 更新成功后重新获取用户信息
            } else {
              alert(data.msg); // 显示错误消息
            }
          })
          .catch((error) => console.error('更新用户数据时出错:', error));
    },
    validatePhoneNumber() {
      const phoneNumField = this.fields.find(field => field.name === 'phoneNum');
      if (phoneNumField.value.length !== 11) {
        alert('电话号码必须为11位，请重新输入');
        phoneNumField.value = ''; // 清空错误输入
      }
    }
  },
  mounted() {
    this.fetchUserInfo();
  }
};
</script>

<style scoped>
.tab-content-3 {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  width: 100%;
}

.label-container {
  display: flex;
  justify-content: space-between;
  min-width: 100px;
}

label {
  font-weight: bold;
  text-align: left;
  font-size: 16px;
}

.field-value {
  flex: 1;
  padding-left: 5px;
  font-size: 16px;
  line-height: 1.5;
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.edit-input {
  flex: 1;
  margin-left: 5px;
  padding: 4px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.update-button {
  background-color: #4CAF50;
  color: white;
  padding: 5px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  align-self: center;
  font-size: 14px;
  font-weight: bold;
}

.edit-buttons-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  width: 100%;
}

.small-button {
  background-color: #4CAF50;
  color: white;
  padding: 5px 10px; /* 更短的按钮水平长度 */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  margin: 0 5px; /* 按钮之间的水平间距 */
  width: 80px; /* 设置固定宽度，稍微长于文字 */
}

.cancel-button {
  background-color: #f44336; /* 取消按钮颜色 */
}
</style>
