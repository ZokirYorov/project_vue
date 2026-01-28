<template>
  <div class="rounded p-4 cursor-grab mb-4 shadow"
       :class="themeStore.theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-400'"
  >
    <div
        class="gap-5 flex flex-col"
    >
      <div class="flex items-center justify-between break-all w-full">
        <h4 class="w-3/4 px-3 py-2 font-semibold text-xl">{{ task.title || 'New task' }}</h4>
        <div
            class="rounded-full items-center flex justify-center  w-10 h-10"
            :class="[themeStore.theme === 'dark' ? 'bg-gray-600 ' : 'bg-gray-100',
              Number(task.id) % 4 === 0 ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
              Number(task.id) % 4 === 1 ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
              Number(task.id) % 4 === 2 ? 'bg-gradient-to-br from-purple-500 to-pink-600' : 'bg-blue-700'
            ]"
        >
          {{task.firstName.charAt(0).toUpperCase() || 'X'}}{{task.lastName.charAt(0).toUpperCase()}}
        </div>
      </div>
      <div
          v-if="task.files && task.files.length"
      >
        <img :src="task.files[0].url" alt="">
      </div>
      <div class="flex items-center justify-between w-full h-full">
        <div class="flex px-2 gap-2 mt-2">
          <button @click="$emit('edit', task)" class="bg-gray-600 text-white px-2 py-1 rounded cursor-pointer hover:bg-gray-300">Edit</button>
          <button @click="$emit('delete', task.id)" class="bg-red-800 px-2 py-1 rounded hover:bg-red-700 cursor-pointer text-white">Delete</button>
        </div>
        <div class="flex items-center h-full gap-2 text-gray-400">
          <i class="fa-regular fa-calendar-check"></i>
          <span class=" items-end flex">{{formatDate(task.date)}}</span>
        </div>
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
  lastName: string,
  firstName: string,
  date: Date,
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

const formatDate = (date: Date) => {
  if (!date) return
  const data = new Date(date);
  const day = data.getFullYear().toString();
  const month = data.getMonth().toString().slice(-2);
  const year = data.getDay().toString().slice(-2);
  return `${year}.${month + 1}.${day}`;
}
</script>
