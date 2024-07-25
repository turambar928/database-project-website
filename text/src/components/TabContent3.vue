<template>
  <div class="tab-content-3">
    <!-- 按照你的需求填充内容 -->
    <form>
      <div class="form-group" v-for="(field, index) in fields" :key="index">
        <label :for="field.name">{{ field.label }}</label>
        <input
            v-if="field.type !== 'select' && field.type !== 'date'"
            :type="field.type"
            :id="field.name"
            v-model="field.value"
        />
        <select v-if="field.type === 'select'" :id="field.name" v-model="field.value">
          <option v-for="option in field.options" :key="option" :value="option">{{ option }}</option>
        </select>
        <input v-if="field.type === 'date'" type="date" :id="field.name" v-model="field.value" />
      </div>
      <button type="submit" class="update-button">更新</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'TabContent3',
  data() {
    return {
      fields: [
        { label: '姓名', name: 'name', type: 'text', value: '' },
        { label: '手机号', name: 'phone', type: 'text', value: '' },
        { label: '性别', name: 'gender', type: 'select', value: '', options: ['男', '女'] },
        { label: '生日', name: 'birthdate', type: 'date', value: '' },
        { label: '身份证', name: 'idCard', type: 'text', value: '' },
        { label: '邮箱', name: 'email', type: 'text', value: '' },
        { label: '密码', name: 'password', type: 'password', value: '' },
        { label: '确认密码', name: 'confirmPassword', type: 'password', value: '' },
        { label: '头像', name: 'avatar', type: 'file', value: '' }
      ]
    };
  }
};
</script>

<style scoped>
.tab-content-3 {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

input, select {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  box-sizing: border-box;
}

.update-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
