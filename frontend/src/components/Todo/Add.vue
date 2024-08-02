<script setup lang="ts">
import PlusIcon from '@/assets/icons/plus.vue'

const emits = defineEmits(['add'])

function onClick() {
    emits('add')
}
</script>

<template>
    <button class="w-full flex items-center py-1 px-2 opacity-45" @click="onClick">
        <PlusIcon class="w-4 h-4" /> <span class="font-bold">Adicionar tarefa</span>
    </button>
</template>