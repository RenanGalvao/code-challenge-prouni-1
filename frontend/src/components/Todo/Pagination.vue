<script setup lang="ts">
import ChevronLeftIcon from '@/assets/icons/chevron-left.vue'
import ChevronRightIcon from '@/assets/icons/chevron-right.vue'

const props = defineProps({
  page: {
    type: Number,
    required: true
  },
  maxPage: {
    type: Number,
    required: true,
  }
})
const emits = defineEmits({
  'page-updated'(pageNumber: number) { return !!pageNumber }
})

const PAGES_AROUND_CURRENT = 0

function isPrintablePage(pageNumber: number) {
  return (
    pageNumber === props.page ||
    pageNumber + PAGES_AROUND_CURRENT === props.page ||
    pageNumber - PAGES_AROUND_CURRENT === props.page
  )
}

function toPage(pageNumber: number) {
  emits('page-updated', pageNumber)
}
</script>

<template>
  <div class="w-full flex justify-center items-center p-2 text-lg z-20">
    <button v-if="page !== 1" class="mr-1 bg-complementary text-dominant rounded w-6 h-6" @click="toPage(page - 1)">
      <ChevronLeftIcon />
    </button>

    <template v-for="(_, index) of Array(maxPage)" :key="`${index}${new Date().getTime()}`">
      <button v-if="isPrintablePage(index + 1)" class="underline">
        {{ index + 1 }}
      </button>
    </template>

    <button v-if="page !== maxPage && page + PAGES_AROUND_CURRENT < maxPage" @click="toPage(page + 1)"
      class="ml-1 bg-complementary text-dominant rounded w-6 h-6">
      <ChevronRightIcon />
    </button>
  </div>
</template>
