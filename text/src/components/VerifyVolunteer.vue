<template>
  <div>
    <h1>志愿者审核申请</h1>
    <table>
      <thead>
        <tr>
          <th>申请ID</th>
          <th>账户ID</th>
          <th>申请时间</th>
          <th>查看</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="application in applications" :key="application.applicationId">
          <td>{{ application.applicationId }}</td>
          <td>{{ application.accountId }}</td>
          <td>{{ application.applicationTime }}</td>
          <td>
            <button @click="viewApplication(application)">查看详情</button>
          </td>
          <td>
            <button @click="openApproveDialog(application)">审核</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="selectedApplication" class="application-details">
      <h2>申请详情</h2>
      <p>姓名: {{ selectedApplication.name }}</p>
      <p>性别: {{ selectedApplication.gender }}</p>
      <p>出生日期: {{ selectedApplication.birthdate }}</p>
      <p>手机号: {{ selectedApplication.phone }}</p>
      <p>身份证号: {{ selectedApplication.idNumber }}</p>
      <p>申请理由: {{ selectedApplication.reason }}</p>
      <button @click="closeDetails">关闭</button>
    </div>

    <div v-if="showApproveDialog" class="approve-dialog">
      <div class="dialog-content">
        <h2>审核情况</h2>
        <div class="textarea-container">
          <textarea v-model="approvalReason" placeholder="审核理由"></textarea>
        </div>
        <div class="dialog-actions">
          <button class="approve-button" @click="approveApplication('通过')">通过</button>
          <button class="reject-button" @click="approveApplication('不通过')">不通过</button>
        </div>
        <button class="close-dialog" @click="closeApproveDialog">X</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      applications: [
        {
          applicationId: '2024010100002',
          accountId: '12345',
          applicationTime: '2024-01-01 13:30:31',
          name: '张三',
          gender: '男',
          birthdate: '1999-03-13',
          phone: '12345678901',
          idNumber: 'XXXXXXXXXXXXXXXXXXXXXXX',
          reason: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
        },
        {
          applicationId: '2024010100003',
          accountId: '22345',
          applicationTime: '2024-01-01 13:32:31',
          name: '李四',
          gender: '女',
          birthdate: '1995-05-20',
          phone: '09876543210',
          idNumber: 'XXXXXXXXXXXXXXXXXXXXXXX',
          reason: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
        }
      ],
      selectedApplication: null,
      showApproveDialog: false,
      approvalReason: '',
    };
  },
  methods: {
    viewApplication(application) {
      this.selectedApplication = application;
    },
    openApproveDialog(application) {
      this.selectedApplication = application;
      this.showApproveDialog = true;
    },
    closeDetails() {
      this.selectedApplication = null;
    },
    closeApproveDialog() {
      this.showApproveDialog = false;
      this.approvalReason = '';
    },
    approveApplication(status) {
      alert(`申请ID: ${this.selectedApplication.applicationId} 审核状态: ${status} 理由: ${this.approvalReason}`);
      this.closeApproveDialog();
    }
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

th {
  background-color: #f2f2f2;
}

button {
  cursor: pointer;
  padding: 5px 10px;
  margin: 5px;
}

.application-details {
  border: 1px solid #ddd;
  padding: 10px;
  background-color: #f9f9f9;
}

.application-details h2 {
  margin-top: 0;
}

.approve-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  max-width: 400px;
  width: 100%;
}

.dialog-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dialog-content h2 {
  margin-top: 0;
  font-size: 20px;
  margin-bottom: 15px;
}

.textarea-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

textarea {
  width: 100%;
  height: 100px;
  margin-top: 10px;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.dialog-actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.approve-button,
.reject-button {
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 14px;
}

.approve-button {
  background-color: #4CAF50;
  color: white;
  border: none;
}

.reject-button {
  background-color: #f44336;
  color: white;
  border: none;
}

.close-dialog {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
}
</style>
