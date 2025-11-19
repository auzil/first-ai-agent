<template>
  <div class="messages" ref="listRef">
    <div
      v-for="(m, i) in items"
      :key="m.id || i"
      class="msg"
      :class="m?.role"
    >
      <div class="avatar">{{ m?.role === 'assistant' ? '🤖' : '🧑' }}</div>
      <div class="bubble">
        <div class="text">{{ m?.text }}</div>
        <div class="meta">{{ time(m?.ts) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageList',
  props: { items: { type: Array, default: () => [] } },
  data() {
    return { atBottom: true }
  },
  computed: {
    // Watching this avoids deep watching the whole array
    count() { return this.items.length },
  },
  watch: {
    // When the number of messages changes, maybe snap to bottom
    count() {
      this.$nextTick(() => this.maybeStickBottom())
    }
  },
  methods: {
    time(ts) {
      // Short, consistent time (HH:MM:SS)
      return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    },
    isNearBottom(threshold = 60) {
      const el = this.$refs.listRef
      if (!el) return true
      const distance = el.scrollHeight - el.clientHeight - el.scrollTop
      return distance <= threshold
    },
    stickBottom() {
      const el = this.$refs.listRef
      if (!el) return
      el.scrollTop = el.scrollHeight
    },
    maybeStickBottom() {
      if (this.atBottom) this.stickBottom()
    },
    onScroll() {
      // Update stickiness based on user scroll position
      this.atBottom = this.isNearBottom()
    }
  },
  mounted() {
    const el = this.$refs.listRef
    // Initial snap
    this.stickBottom()
    // Track user scroll to respect reading position
    el.addEventListener('scroll', this.onScroll, { passive: true })
    // Keep bottom when container resizes (fonts, window resize, images)
    if ('ResizeObserver' in window) {
      this._ro = new ResizeObserver(() => this.maybeStickBottom())
      this._ro.observe(el)
    }
  },
  unmounted() {
    const el = this.$refs.listRef
    el && el.removeEventListener('scroll', this.onScroll)
    this._ro && this._ro.disconnect()
  }
}
</script>

<style lang="scss">
@use '../styles/_variables.scss' as *;

.messages {
  flex: 1;
  overflow: auto;
  padding: 8px;
  background: #fafafa;
  border-radius: 12px;
  border: 1px solid #eef2f7;
}

.msg {
  display: flex;
  gap: 10px;
  margin: 10px 0;
  align-items: flex-start;
}

.avatar {
  width: 28px;
  text-align: center;
  margin-top: 2px;
}

.bubble {
  @include card;
  padding: 10px 12px;
  max-width: 80%;
}

.msg.user .bubble { background: #ecfeff; }
.msg.assistant .bubble { background: #f8fafc; }

.text {
  white-space: pre-wrap;
  word-break: break-word;
}

.meta {
  font-size: 11px;
  color: $muted;
  margin-top: 6px;
}
</style>