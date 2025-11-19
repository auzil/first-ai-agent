import { ref, reactive, computed } from 'vue'
import { io } from 'socket.io-client'

const socket = ref(null)
const isConnected = ref(false)
const connecting = ref(false)
const messages = reactive([])
const username = ref('anon-' + Math.floor(Math.random() * 1000))
const unread = ref(0)
const error = ref(null)

export function useStore() {
  const sortedMessages = computed(() =>
    [...messages].sort((a, b) => a.ts - b.ts)
  )

  function connect(url = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3030', opts = {}) {
    if (socket.value || connecting.value) return
    connecting.value = true
    error.value = null

    const options = Object.assign({
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
    }, opts)

    socket.value = io(url, options)

    socket.value.on('connect', () => {
      isConnected.value = true
      connecting.value = false
    })

    socket.value.on('disconnect', () => {
      isConnected.value = false
    })

    socket.value.on('connect_error', (err) => {
      error.value = err?.message || 'Connection error'
      connecting.value = false
    })

    socket.value.on('chat:message', (msg) => {
      messages.push(msg)
      unread.value++
    })

    socket.value.on('chat:backlog', (items = []) => {
      messages.push(...items)
    })
  }

  function disconnect() {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      isConnected.value = false
    }
  }

  function sendMessage(text) {
    if (!socket.value || !isConnected.value) {
      error.value = 'Not connected'
      return
    }

    const payload = {
      id: crypto.randomUUID(),
      user: username.value,
      text: String(text || '').trim(),
      ts: Date.now()
    }
    if (!payload.text) return

    socket.value.emit('chat:message', payload)
    messages.push(payload) // optimistic update
  }

  function setUsername(name) {
    username.value = name?.trim() || username.value
  }

  function markRead() {
    unread.value = 0
  }

  function clear() {
    messages.splice(0, messages.length)
    unread.value = 0
  }

  return {
    socket,
    isConnected,
    connecting,
    messages,
    sortedMessages,
    username,
    unread,
    error,
    connect,
    disconnect,
    sendMessage,
    setUsername,
    markRead,
    clear
  }
}