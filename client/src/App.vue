<template>
    <div class="app">
        <h1>AI Agent Chat</h1>
        <p class="subtitle">Your friendly AI assistant</p>
        <div class="layout">
            <div class="left">
                <Chat />
            </div>
            <div class="right">
                <p>History debug:</p>
                <Debug />
            </div>
        </div>
    </div>
</template>


<script>
import Chat from './components/Chat.vue'
import Debug from './components/Debug.vue';
import { useStore } from './store.js'

export default {
    name: 'App',
    components: { Chat, Debug },
    setup() { 
        const chat = useStore()
        chat.connect()
        return { chat }
     },
    computed: {},
    methods: {}
}
</script>


<style lang="scss">
@use './styles/_variables.scss' as *;


body {
    margin: 0;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    background: $bg;
}

.app {
    max-width: 1100px;
    margin: 24px auto;
    padding: 16px;
    color: $text;
}

.subtitle {
    color: $muted;
    margin-top: 4px;
}

.layout {
    display: grid;
    grid-template-columns: 1.3fr .7fr;
    gap: 16px;
    margin-top: 16px;
}

.left,
.right {
    @include card;
    padding: 14px;
}

@media (max-width: 920px) {
    .layout {
        grid-template-columns: 1fr;
    }
}
</style>