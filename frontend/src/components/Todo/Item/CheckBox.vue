<script setup lang="ts">
import CheckedBoxIcon from '@/assets/icons/checked-box.vue'
import UncheckedBoxIcon from '@/assets/icons/unchecked-box.vue'

const props = defineProps({
    done: {
        type: Boolean,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: ''
    }
})

const emits = defineEmits({
    change(done: boolean) {
        return typeof done === 'boolean'
    }
})

function onClick() {
    if (props.description.length !== 0) {
        emits('change', !props.done)
    }
}
</script>

<template>
    <button class="" @click="onClick">
        <CheckedBoxIcon v-if="done" class="w-5 h-5 opacity-45" />
        <UncheckedBoxIcon v-if="!done" class="w-5 h-5" />
    </button>
</template>