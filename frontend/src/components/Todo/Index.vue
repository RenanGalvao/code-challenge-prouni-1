<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Task, TodoItem } from '@/lib/types/index.js'
import { loadList } from '@/lib/utils/index.js'
import { ApiListResponse } from '@/lib/classes/index.js'

import CheckListIcon from '@/assets/icons/check-list.vue'
import Add from './Add.vue'
import Item from './Item/Index.vue'

const items = ref([] as TodoItem[])

onMounted(async () => {
    await loadData()
})

function onAdd() {
    items.value.push({
        description: '',
        done: false,
        _vForKey: new Date().getTime()
    })
}

function onRemove(vForKey: number) {
    const item = items.value.filter(item => item._vForKey === vForKey)[0]
    const indexOf = items.value.indexOf(item)
    items.value.splice(indexOf, 1)
}

function tasksToItems(tasks: Task[]) {
    let items: TodoItem[] = []
    for (const task of tasks) {
        items.push({
            id: task.id,
            description: task.description,
            done: Boolean(task.done),
            _vForKey: new Date().getTime()
        })
    }
    return items
}

async function loadData() {
    // @TODO create env for origin
    const url = window ? new URL(window.location.href) : new URL(import.meta.env.VITE_APP_ORIGIN)
    const res = await loadList<Task>('/tasks', url)

    if (res instanceof ApiListResponse) {
        items.value = tasksToItems(res.data)
        //totalCount.value = res.info.totalCount
        //totalPages.value = res.info.totalPages
        //messages.value = res.messages
    } else {
        //messages.value = res!.messages
    }
}
</script>

<template>
    <main class="w-full h-full flex flex-col p-8">
        <h1 class="flex justify-text items-center text-3xl mx-auto mb-4">
            <CheckListIcon class="w-8 h-8" /> Tarefas
        </h1>
        <Item v-for="item of items" :key="item._vForKey" v-bind="item" @remove="onRemove" />
        <Add @add="onAdd" />
    </main>
</template>