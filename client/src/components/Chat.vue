<template>
  <div class="chat">
    <MessageList :items="messages" />

    <div class="divider" />

    <InputBar
      :loading="sending"
      placeholder="Type your lovely message…"
      @submit="handleSend"
    />
  </div>
</template>

<script>
import { computed } from 'vue'
import MessageList from './MessageList.vue'
import InputBar from './InputBar.vue'
import { useStore } from '../store.js'

export default {
  name: 'Chat',
  components: { MessageList, InputBar },
  data() {
    return {
      sending: false,
    }
  },
  setup() {
    const chat = useStore()
    // const messages = computed(() => chat.sortedMessages)
    const messages = chat.messages
    console.log('Chat messages:', messages.value)
    return { chat, messages }
  },
  methods: {
    async handleSend(text) {
      if (!text) return
      this.sending = true
      this.chat.sendMessage(text)
      setTimeout(() => (this.sending = false), 200)
    },
  },
}
</script>

<style lang="scss">
.chat {
  display: flex;
  flex-direction: column;
  min-height: 520px;
}

.divider {
  height: 1px;
  background: #f1f5f9;
  margin: 10px 0;
}
</style>