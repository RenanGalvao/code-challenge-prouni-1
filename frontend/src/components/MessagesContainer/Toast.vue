<template>
  <Transition>
    <div v-if="!silent && isOpen" :class="`bg-${variant}`"
      class="toast min-w-full p-2 border-2 border-solid rounded mb-1 flex items-center justify-between md:min-w-80">
      <div>{{ message }}</div>
      <button class="ml-1" @click="close">Fechar</button>
    </div>
  </Transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.bg-danger {
  color: #a94442;
  background-color: #f2dede;
  border-color: #a94442;

  .toast-close {
    color: #a94442;
  }
}

.bg-success {
  color: #3c763d;
  background-color: #dff0d8;
  border-color: #3c763d;

  .toast-close {
    color: #3c763d;
  }
}

.bg-info {
  color: #31708f;
  background-color: #d9edf7;
  border-color: #31708f;

  .toast-close {
    color: #31708f;
  }
}
</style>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const emits = defineEmits({
  close(id: number) { return !!id }
})

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    required: false,
    default: 'danger'
  },
  silent: {
    type: Boolean,
    required: false,
    default: false
  },
  duration: {
    type: Number,
    required: false,
    default: 3 * 1000 // in ms
  },
  delay: {
    type: Number,
    required: false,
    default: 0 // in ms
  }
})

onMounted(() => {
  if (props.silent) {
    console.debug(props.message)
  }
})

const isOpen = ref(true)
const autoHide = ref(true)

if (autoHide.value) {
  setTimeout(() => {
    close()
  }, props.duration)
}

function close() {
  isOpen.value = false
  emits('close', props.id)
}
</script>
