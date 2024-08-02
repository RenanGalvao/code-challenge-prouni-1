<script setup lang="ts">
import * as yup from 'yup'
import { ref, computed, onMounted } from 'vue'
import { validate, sendRequest } from '@/lib/utils/index.js'
import { ApiResponse } from '@/lib/classes/index.js'
import { Message, Task } from '@/lib/types/index.js'

import CheckBox from './CheckBox.vue'
import Input from './Input.vue'
import Options from './Options.vue'
import SimpleTransition from '@/components/SimpleTransition.vue'

const emits = defineEmits({
    remove(vForKey: number) {
        return typeof vForKey === 'number'
    },
    messages(messages: Message[]) {
        return !!messages
    },
    'key-enter'() { return true }
})

const props = defineProps({
    id: {
        type: Number,
        required: false,
        default: 0
    },
    done: {
        type: Boolean,
        required: false,
        default: false,
    },
    description: {
        type: String,
        required: false,
        default: ''
    },
    _vForKey: {
        type: Number,
        required: true
    }
})

// Lifting textarea element ref to parent
const textareaComponentRef = ref(null as InstanceType<typeof Input> | null)
const textareaElementRef = computed(() => textareaComponentRef.value?.elementRef)
defineExpose({
    textareaElementRef,
})

const id = ref(props.id)
const done = ref(props.done)
const description = ref(props.description)

// Simple animation
// not using Transition Group since it clutches the screen when switching pages
const show = ref(false)
onMounted(() => {
    show.value = true
})

function onCheckBoxChange(value: boolean) {
    done.value = value
    requestCountDown()
}

function onDescriptionChange(value: string) {
    description.value = value
}

async function onRemove() {
    // animation
    show.value = false

    if (id.value !== 0) {
        await removeTodo()
    }

    // tells parent component to remove from list
    emits('remove', props._vForKey)
}

/*
* Sync Data to API 
*/
const schema = yup.object().shape({
    description: yup.string().required('Descrição é um campo obrigatório'),
    done: yup.boolean().required('Feito é um campo obrigatório')
})

async function saveTodo() {
    if (description.value.length === 0) {
        return
    }

    const validation = validate({
        description: description.value,
        done: done.value
    }, schema)
    if (validation) {
        emits('messages', validation.messages)
        return
    }

    const res = await sendRequest<Task>('/tasks', 'POST', {
        description: description.value,
        done: Number(done.value)
    })

    if (res instanceof ApiResponse) {
        id.value = res.data.id
    } else {
        emits('messages', res!.messages)
    }
}

async function updateTodo() {
    const validation = validate({
        description: description.value,
        done: done.value
    }, schema)
    if (validation) {
        emits('messages', validation.messages)
        return
    }

    const res = await sendRequest<Task>(`/tasks/${id.value}`, 'PUT', {
        description: description.value,
        done: Number(done.value)
    })

    if (!(res instanceof ApiResponse)) {
        emits('messages', res!.messages)
    }
}

async function removeTodo() {
    const res = await sendRequest<Task>(`/tasks/${id.value}`, 'DELETE')

    if (!(res instanceof ApiResponse)) {
        emits('messages', res!.messages)
    }
}

/*
* Timer to avoid multiple request while changing description
*/
const REQUEST_COOL_DOWN = 1 * 1000 // second in ms
let requestTimer: NodeJS.Timeout

function requestCountDown() {
    clearTimeout(requestTimer)
    requestTimer = setTimeout(async () => {
        if (id.value === 0) {
            await saveTodo()
        } else {
            if (description.value.length > 0) {
                await updateTodo()
            } else {
                await onRemove()
            }
        }
    }, REQUEST_COOL_DOWN)
}

function clearRequestCountDown(event: KeyboardEvent) {
    // ignore Enter key as it's used to move to next item
    if (event.key !== 'Enter') {
        clearTimeout(requestTimer)
    }
}
</script>

<template>
    <SimpleTransition>
        <div class="flex py-1 px-2 rounded-md shadow-lg" v-if="show">
            <CheckBox :done :description @change="onCheckBoxChange" class="mr-1" />
            <Input :done :description ref="textareaComponentRef" @change="onDescriptionChange"
                @keydown="clearRequestCountDown" @keyup="requestCountDown" @key-enter="$emit('key-enter')" />
            <Options :description @remove="onRemove" />
        </div>
    </SimpleTransition>
</template>