<script setup lang="ts">
import { onMounted, ref } from 'vue'

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

const emits = defineEmits({
    change(description: string) {
        return typeof description === 'string'
    },
    keydown(event: KeyboardEvent) { return true },
    keyup() { return true },
    'key-enter'() { return true }
})

// Lifting element ref to parent
const elementRef = ref(null as HTMLTextAreaElement | null)
defineExpose({
    elementRef,
})

onMounted(() => {
    growAsNeeded(elementRef.value as HTMLTextAreaElement)
})

function onKeyDown(event: KeyboardEvent) {
    emits('keydown', event)
    if (event.key === 'Enter') {
        event.preventDefault()
        emits('key-enter')
    }
}

function onInput(event: Event) {
    emits('change', (event.target as HTMLTextAreaElement).value)
    growAsNeeded(event.target as HTMLTextAreaElement)

}

function growAsNeeded(el: HTMLElement) {
    const offset = getInnerHeight(el) - el.clientHeight

    if (getInnerHeight(el) < el.scrollHeight) {
        // Grow the field if scroll height is smaller
        el.style.height = `${el.scrollHeight - offset}px`
    } else {
        // Shrink the field and then re-set it to the scroll height in case it needs to shrink
        el.style.height = '1px'
        el.style.height = `${el.scrollHeight - offset}px`
    }

}

function getInnerHeight(el: HTMLElement) {
    const computed = getComputedStyle(el)
    const padding = parseInt(computed.paddingTop) + parseInt(computed.paddingBottom);

    return el.clientHeight - padding
}
</script>

<template>
    <textarea class="w-full focus:outline-0 resize-none" :class="{ 'line-through opacity-45': $props.done }" :value="description"
        rows="1" wrap="soft" :placeholder="'Eu preciso...'" ref="elementRef" @input="onInput" @keydown="onKeyDown"
        @keyup="$emit('keyup')"></textarea>
</template>