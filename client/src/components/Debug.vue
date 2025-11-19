<template>
  <div class="conversation-history">

    <pre
      v-for="(msg, i) in history"
      :key="i"
      class="json-block"
    >
{{ formatJSON(msg) }}
    </pre>
  </div>
</template>

<script>
import { useStore } from '../store.js'
import { ref } from 'vue'
export default {
  name: 'ConversationHistory',
  setup() {
    const {socket} = useStore()
    const history = ref([])

    socket.value.on('debug:history', (newHistory) => {
      history.value = newHistory
    })

    return { socket, history }
  },
  methods: {
    formatJSON(obj) {
      return JSON.stringify(obj, null, 2);
    }
  },
  created() {

  }
};
</script>

<style scoped>
.conversation-history {
  font-family: Consolas, Menlo, monospace;
  font-size: 13px;
  padding: 12px;
}
.json-block {
  background: #f6f6f6;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  white-space: pre-wrap;
  margin-bottom: 10px;
}
</style>