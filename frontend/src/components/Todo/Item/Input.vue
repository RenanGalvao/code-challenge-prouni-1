<script setup lang="ts">
defineProps({
    done: {
        type: Boolean,
        required: false,
        default: false
    },
    description: {
        type: String,
        required: false,
        default: ''
    }
})

defineEmits({
    change(description: string) {
        return typeof description === 'string'
    },
    keydown() { return true },
    keyup() { return true }
})
</script>

<template>
    <input class="w-full" :class="{ 'line-through opacity-45': $props.done }" :value="description"
        :placeholder="'Eu preciso...'" @input="$emit('change', ($event.target as HTMLInputElement).value)"
        @keydown="$emit('keydown')" @keyup="$emit('keyup')" />
</template>