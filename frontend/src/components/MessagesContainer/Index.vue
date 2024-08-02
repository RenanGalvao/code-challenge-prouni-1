<template>
  <div id="messages-container" class="fixed bottom-0 right-0 z-10 w-full p-8 flex flex-col items-center md:items-end"
    v-if="thereAreMessagesToShow">
    <template v-for="message in _messages" :key="message.id">
      <Toast v-bind="message" @close="onToastClose" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Message } from '@/lib/types'
import Toast from './Toast.vue'

const props = defineProps<{ messages: Message[] }>()
const _messages = ref([] as Message[])
const thereAreMessagesToShow = computed(() => _messages.value.length > 0)

const delay_period = 100 // in ms
let accumulated_period = 0

watch(() => props.messages, (value) => {
  value.forEach((msg) => {
    _messages.value.push({
      ...msg,
      delay: accumulated_period,
      duration: msg.duration + accumulated_period
    })
    accumulated_period += delay_period
  })
})

function onToastClose(id: number) {
  _messages.value = _messages.value.filter(msg => msg.id !== id)
}
</script>
