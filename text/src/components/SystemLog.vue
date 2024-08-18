<template>
  <div class="system-log">
    <h1>系统日志</h1>
    <div class="log-list">
      <ul>
        <li v-for="log in logs" :key="log.id" @click="selectLog(log)">
          {{ log.timestamp }} - {{ log.message }}
        </li>
      </ul>
    </div>
    <div class="log-details" v-if="selectedLog">
      <h2>日志详情</h2>
      <p><strong>时间:</strong> {{ selectedLog.timestamp }}</p>
      <p><strong>类型:</strong> {{ selectedLog.type }}</p>
      <p><strong>消息:</strong> {{ selectedLog.message }}</p>
      <p><strong>详细信息:</strong></p>
      <pre>{{ selectedLog.details }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SystemLog',
  data() {
    return {
      logs: [], // Array to hold logs
      selectedLog: null // Currently selected log
    };
  },
  methods: {
    // Fetch logs (example, replace with real data fetching logic)
    fetchLogs() {
      // Example log data
      this.logs = [
        {

        },
        {

        }
        // Add more logs as needed
      ];
    },
    selectLog(log) {
      this.selectedLog = log;
    }
  },
  mounted() {
    this.fetchLogs();
  }
};
</script>

<style scoped>
.system-log {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

h1 {
  text-align: center;
  color: #333;
}

.log-list {
  margin-bottom: 20px;
}

.log-list ul {
  list-style-type: none;
  padding: 0;
}

.log-list li {
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  transition: background-color 0.2s;
}

.log-list li:hover {
  background-color: #f0f0f0;
}

.log-details {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  background-color: #fff;
}

pre {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap; /* Allows text wrapping */
}
</style>
