<script setup lang="ts">
import TrashIcon from '@/assets/icons/trash.vue'

const props = defineProps({
    description: {
        type: String,
        required: false,
        default: ''
    }
})

const emits = defineEmits(['remove'])

function onClick() {
    if(props.description.length === 0) {
        emits('remove')
        return
    }

    const remove = confirm(`Deseja remover tarefa: "${props.description}"`)
    if (remove) {
        emits('remove')
    }
}
</script>

<template>
    <button @click="onClick">
        <TrashIcon class="w-5 h-5" />
    </button>
</template>