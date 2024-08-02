<script setup lang="ts">
import './assets/main.css'
import { ref } from 'vue'
import Todo from '@/components/Todo/Index.vue'
import MessagesContainer from '@/components/MessagesContainer/Index.vue'
import type { Message } from '@/lib/types/index.js'

const messages = ref([] as Message[])

function onMessages(_messages: Message[]) {
    messages.value = _messages
}
</script>

<template>
    <Todo @messages="onMessages" />
    <MessagesContainer :messages />
</template>