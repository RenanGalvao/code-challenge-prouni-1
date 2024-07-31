<script setup lang="ts">
import * as yup from 'yup'
import { ref } from 'vue'
import { validate, sendRequest } from '@/lib/utils/index.js'
import { ApiResponse } from '@/lib/classes/index.js'
import { Message, Task } from '@/lib/types/index.js'

import CheckBox from './CheckBox.vue'
import Input from './Input.vue'
import Options from './Options.vue'

const emits = defineEmits({
    remove(vForKey: number) {
        return typeof vForKey === 'number'
    },
    messages(messages: Message[]) {
        return !!messages
    }
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

const id = ref(props.id)
const done = ref(props.done)
const description = ref(props.description)

function onCheckBoxChange(value: boolean) {
    done.value = value
    requestCountDown()
}

function onDescriptionChange(value: string) {
    description.value = value
}

async function onRemove() {
    if (id.value !== 0) {
        removeTodo()
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

function clearRequestCountDown() {
    clearTimeout(requestTimer)
}
</script>

<template>
    <div class="flex">
        <CheckBox :done :description @change="onCheckBoxChange" class="mr-1" />
        <Input :done :description @change="onDescriptionChange" @keydown="clearRequestCountDown"
            @keyup="requestCountDown" />
        <Options :description @remove="onRemove" />
    </div>
</template>