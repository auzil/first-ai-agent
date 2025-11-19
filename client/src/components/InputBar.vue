<template>
    <form class="input" @submit.prevent="submit">
        <input v-model="text" :placeholder="placeholder" :disabled="loading" @keydown.enter.exact.prevent="submit" />
        <button :disabled="loading || !text">{{ loading ? 'Sending…' : 'Send' }}</button>
    </form>
</template>


<script>
export default {
    name: 'InputBar',
    props: {
        loading: { type: Boolean, default: false },
        placeholder: { type: String, default: 'Type a message' },
    },
    data() {
        return { text: '' };
    },
    computed: {},
    methods: {
        submit() {
            const t = this.text.trim();
            if (!t) return;
            this.$emit('submit', t);
            this.text = '';
        },
    },
}
</script>


<style lang="scss">
@use '../styles/_variables.scss' as *;


.input {
    display: flex;
    gap: 8px;
}

input {
    flex: 1;
    padding: 10px 12px;
    border: 1px solid $border;
    border-radius: 10px;
}

button {
    padding: 10px 14px;
    border-radius: 10px;
    border: 1px solid $primary;
    background: $primary;
    color: white;
    cursor: pointer;
}

button:disabled {
    opacity: .6;
    cursor: not-allowed;
}
</style>