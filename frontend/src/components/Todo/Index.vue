<script setup lang="ts">
import { onMounted, ref, computed, nextTick } from 'vue'
import { Task, TodoItem, Message } from '@/lib/types/index.js'
import { loadList, generateMessages } from '@/lib/utils/index.js'
import { ApiListResponse } from '@/lib/classes/index.js'
import { DEFAULT_ITEMS_PER_PAGE } from '@/const/index.js'
import { usePageSearchParam } from '@/lib/composables/index.js'

import CheckListIcon from '@/assets/icons/check-list.vue'
import Add from './Add.vue'
import Item from './Item/Index.vue'
import Signature from './Signature.vue'
import Pagination from './Pagination.vue'
import SimpleTransition from '@/components/SimpleTransition.vue'

const emits = defineEmits({
    messages(messages: Message[]) { return !!messages }
})

const items = ref([] as TodoItem[])
const textareaElementRefs = ref([] as InstanceType<typeof Item>[]) // expose textarea element ref from child component
const totalCount = ref(0)
const totalPages = ref(1)

const { page, setPageSearchParam } = usePageSearchParam()
const showPagination = computed(() => items.value.length >= DEFAULT_ITEMS_PER_PAGE || page.value > 1 && page.value <= totalPages.value)
const showAddTodoItem = computed(() => items.value.length < DEFAULT_ITEMS_PER_PAGE + 1)

onMounted(async () => {
    setPageSearchParam(page.value)
    await loadData()
})

async function onAdd() {
    const totalItems = items.value.length
    // changes page when max items is shown
    // DEFAULT_ITEMS_PER_PAGE == MAX_ITEMS_PER_PAGE
    if (totalItems === DEFAULT_ITEMS_PER_PAGE) {
        await onPageUpdate(page.value + 1)
    }

    // Do not allow to create new items before last one is filled
    const lastItemRef = getLastInputElementRef()
    if (lastItemRef && lastItemRef?.textareaElementRef?.value.length === 0) {
        lastItemRef?.textareaElementRef?.focus()
        emits('messages', generateMessages([{ message: 'Você deve preencher a nova tarefa antes de adicionar outra.', variant: 'info' }]))
        return
    }

    items.value.push({
        description: '',
        done: false,
        _vForKey: new Date().getTime()
    })

    // await for DOM update
    nextTick(() => {
        const lastItemRef = getLastInputElementRef()
        lastItemRef?.textareaElementRef?.focus()
    })
}

async function onRemove(vForKey: number) {
    const item = items.value.filter(item => item._vForKey === vForKey)[0]
    const indexOf = items.value.indexOf(item)
    items.value.splice(indexOf, 1)

    // fill current page with more Todo Items if not in the last page
    // DEFAULT_ITEMS_PER_PAGE == MAX_ITEMS_PER_PAGE
    if (totalCount.value > DEFAULT_ITEMS_PER_PAGE && page.value < totalPages.value) {
        await loadData()
    }
}

function tasksToItems(tasks: Task[]) {
    let items: TodoItem[] = []
    for (const task of tasks) {
        items.push({
            id: task.id,
            description: task.description,
            done: Boolean(task.done),
            _vForKey: Number(`${task.id}${new Date().getTime()}`) // avoid collision
        })
    }
    return items
}

async function loadData() {
    const url = window ? new URL(window.location.href) : new URL(import.meta.env.VITE_APP_ORIGIN)
    const res = await loadList<Task>('/tasks', url)

    if (res instanceof ApiListResponse) {
        items.value = tasksToItems(res.data)
        totalCount.value = res.info.totalCount
        totalPages.value = res.info.totalPages
    } else {
        emits('messages', res!.messages)
    }
}

async function onPageUpdate(pageNumber: number) {
    setPageSearchParam(pageNumber)
    items.value = []
    await loadData()
    // first time creating more items that can be shown in one page
    // corrects pagination
    if (totalPages.value < page.value) {
        totalPages.value += 1
    }
}

function getLastInputElementRef() {
    return textareaElementRefs.value.length > 0 ? textareaElementRefs.value[textareaElementRefs.value.length - 1] : null
}
</script>

<template>
    <main class="w-full h-full flex flex-col p-8 overflow-y-auto md:w-6/12 md:mx-auto lg:w-4/12">
        <h1 class="flex justify-text items-center text-3xl mx-auto mb-4 mt-12">
            <CheckListIcon class="w-8 h-8" /> Tarefas
        </h1>

        <Item v-for="item of items" :key="item._vForKey" v-bind="item" ref="textareaElementRefs" @remove="onRemove"
            @messages="$emit('messages', $event)" @key-enter="onAdd" />

        <SimpleTransition>
            <Add @add="onAdd" class="mb-auto" v-if="showAddTodoItem" />
        </SimpleTransition>

        <SimpleTransition>
            <Pagination v-if="showPagination" :page :max-page="totalPages" @page-updated="onPageUpdate" />
        </SimpleTransition>
        <Signature />
    </main>
</template>