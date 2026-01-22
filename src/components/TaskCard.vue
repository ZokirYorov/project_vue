<template>
  <div class="rounded p-4 cursor-grab mb-4 shadow"
       :class="themeStore.theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-400'"
  >
    <div
        class="gap-5 flex flex-col"
    >
      <h4 class="px-3 py-2  font-semibold text-xl">{{ task.title || 'New task' }}</h4>
      <div
          v-if="task.files && task.files.length"
      >
        <img :src="task.files[0].url" alt="">
      </div>
      <div class="flex px-2 gap-2 mt-2">
        <button @click="$emit('edit', task)" class="bg-gray-400 text-white px-2 py-1 rounded cursor-pointer hover:bg-gray-300">Edit</button>
        <button @click="$emit('delete', task.id)" class="bg-red-800 px-2 py-1 rounded hover:bg-red-700 cursor-pointer text-white">Delete</button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/stores";

const themeStore = useStore()
interface TaskFile {
  name: string;
  url: string;
  size: number;
  type: string;
}

interface Tasks {
  id: string;
  title: string;
  status: string;
  files: TaskFile[];
}

defineProps<{
  task: Tasks
}>()

defineEmits<{
  (e: 'edit', task: Tasks): void
  (e: 'delete', id: string): void
}>()

</script>
