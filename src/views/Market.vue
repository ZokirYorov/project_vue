<template>
  <div class="flex flex-col h-full w-full">
    <div class="flex w-full gap-2 p-4"
         :class="dataStore.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100 text-gray-400 rounded-xl'"
    >
      <div
          class="flex flex-col rounded w-1/4 p-4"
          :class="[dataStore.theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-800']"

      >
        <span
            :class="dataStore.theme === 'dark' ? 'text-gray-400' : ''"
            class="text-sm font-semibold uppercase flex items-center"
        >Boshlash</span>
        <div
            v-for="(item, status) in columns.todo"
            :key="status"
            @dragover.prevent
            @drop="onDrop(status as any)"
            class="flex flex-col gap-4 cursor-grab"
        >
          <h2 class="text-lg font-semibold mb-2">{{item.title}}</h2>
          <div>
            <img v-if="item.files && item.files.length" :src="item.files[0].url" alt="">
          </div>
          <div
              class="flex w-full justify-between mb-2"
          >
            <div class="flex gap-2">
              <button @click="editItem(item)" class="bg-gray-600 text-white rounded px-2 py-1">Edit</button>
              <button @click="deleteItem(item.id)" class="bg-red-600 text-white rounded px-2 py-1">Delete</button>
            </div>
            <div
                class="rounded-full w-10 h-10 flex items-center justify-center"
                :class="[dataStore.theme === 'dark' ? 'bg-gray-600 ' : 'bg-gray-100',
              Number(item.id) % 4 === 0 ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
              Number(item.id) % 4 === 1 ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
              Number(item.id) % 4 === 2 ? 'bg-gradient-to-br from-purple-500 to-pink-600' : 'bg-blue-700'
            ]"
            >
              {{item.firstName.charAt(0).toUpperCase()}}{{item.lastName.charAt(0).toUpperCase()}}
            </div>
          </div>
        </div>
        <button class="bg-gray-400 text-gray-200 rounded w-full px-2 py-1">+Add task</button>
      </div>
      <div
          class="flex flex-col rounded w-1/4 p-4"
          :class="[dataStore.theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-800']"

      >
        <span
            :class="dataStore.theme === 'dark' ? 'text-gray-400' : ''"
            class="text-sm font-semibold uppercase flex items-center"
        >Jarayonda</span>
        <div
            v-for="(item, status) in columns.progress"
            :key="status"
            @dragover.prevent
            class="flex flex-col gap-4 cursor-grab"
        >
          <h2 class="text-lg font-semibold mb-2">{{item.title}}</h2>
          <div>
            <img v-if="item.files && item.files.length" :src="item.files[0].url" alt="">
          </div>
          <div
              class="flex w-full justify-between mb-2"
          >
            <div class="flex gap-2">
              <button @click="editItem(item)" class="bg-gray-600 text-white rounded px-2 py-1">Edit</button>
              <button @click="deleteItem(item.id)" class="bg-red-600 text-white rounded px-2 py-1">Delete</button>
            </div>
            <div
                class="rounded-full w-10 h-10 flex items-center justify-center"
                :class="[dataStore.theme === 'dark' ? 'bg-gray-600 ' : 'bg-gray-100',
              Number(item.id) % 4 === 0 ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
              Number(item.id) % 4 === 1 ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
              Number(item.id) % 4 === 2 ? 'bg-gradient-to-br from-purple-500 to-pink-600' : 'bg-blue-700'
            ]"
            >
              {{item.firstName.charAt(0).toUpperCase()}}{{item.lastName.charAt(0).toUpperCase()}}
            </div>
          </div>
        </div>
      </div>
      <div
          class="flex flex-col rounded w-1/4 p-4"
          :class="[dataStore.theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-800']"

      >
        <span
            :class="dataStore.theme === 'dark' ? 'text-gray-400' : ''"
            class="text-sm font-semibold uppercase flex items-center"
        >Testing</span>
        <div
            v-for="(item, status) in columns.testing"
            :key="status"
            @dragover.prevent
            class="flex flex-col gap-4 cursor-grab"
        >
          <h2 class="text-lg font-semibold mb-2">{{item.title}}</h2>
          <div>
            <img v-if="item.files && item.files.length" :src="item.files[0].url" alt="">
          </div>
          <div
              class="flex w-full justify-between mb-2"
          >
            <div class="flex gap-2">
              <button @click="editItem(item)" class="bg-gray-600 text-white rounded px-2 py-1">Edit</button>
              <button @click="deleteItem(item.id)" class="bg-red-600 text-white rounded px-2 py-1">Delete</button>
            </div>
            <div
                class="rounded-full w-10 h-10 flex items-center justify-center"
                :class="[dataStore.theme === 'dark' ? 'bg-gray-600 ' : 'bg-gray-100',
              Number(item.id) % 4 === 0 ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
              Number(item.id) % 4 === 1 ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
              Number(item.id) % 4 === 2 ? 'bg-gradient-to-br from-purple-500 to-pink-600' : 'bg-blue-700'
            ]"
            >
              {{item.firstName.charAt(0).toUpperCase()}}{{item.lastName.charAt(0).toUpperCase()}}
            </div>
          </div>
        </div>
      </div>
      <div
          class="flex flex-col rounded w-1/4 h-full p-4"
          :class="[dataStore.theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-800']"

      >
        <span
            :class="dataStore.theme === 'dark' ? 'text-gray-400' : ''"
            class="text-sm font-semibold uppercase flex items-center"
        >Bajarildi</span>
        <div
            v-for="(item, status) in columns.done"
            :key="status"
            @dragover.prevent
            class="flex flex-col gap-4 cursor-grab"
        >
          <h2 class="text-lg font-semibold mb-2">{{item.title}}</h2>
          <div>
            <img v-if="item.files && item.files.length" :src="item.files[0].url" alt="">
          </div>
          <div
              class="flex w-full justify-between mb-2"
          >
            <div class="flex gap-2">
              <button @click="editItem(item)" class="bg-gray-600 text-white rounded px-2 py-1">Edit</button>
              <button @click="deleteItem(item.id)" class="bg-red-600 text-white rounded px-2 py-1">Delete</button>
            </div>
            <div
                class="rounded-full w-10 h-10 flex items-center justify-center"
                :class="[dataStore.theme === 'dark' ? 'bg-gray-600 ' : 'bg-gray-100',
              Number(item.id) % 4 === 0 ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
              Number(item.id) % 4 === 1 ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
              Number(item.id) % 4 === 2 ? 'bg-gradient-to-br from-purple-500 to-pink-600' : 'bg-blue-700'
            ]"
            >
              {{item.firstName.charAt(0).toUpperCase()}}{{item.lastName.charAt(0).toUpperCase()}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
        class="flex flex-col mt-4 rounded w-full bg-gray-600 h-full p-4"
    >
      <h2 class="my-4 text-2xl">FAQ</h2>
      <div
          v-if="columns"
          class="flex flex-col gap-4 bg-gray-800 text-gray-400 rounded-lg p-2 border-b border-gray-400"

          v-for="(item, status) in columns"
          :key="status"
      >
      <div class="flex items-center justify-between p-2"
           @click="clickDrop(status)"
      >
        <span
        >
          {{statuses[status]}}
        </span>
        <i
            class="flex transition-all duration-200 ease-in-out"
           :class="dropDown === status
           ? 'fa-solid fa-chevron-up'
            : 'fa-solid fa-chevron-down'"
        ></i>
      </div>
        <!-- BODY -->
        <div v-if="dropDown === status">
          <div
              v-if="item && item.length"
              class="flex flex-col gap-3 p-2"
          >
            <div
                v-for="(data, index) in item"
                :key="index"
                class="flex gap-4 items-center"
            >
              <img
                  v-if="data.files && data.files.length"
                  class="w-40"
                  :src="data.files[0].url"
                  alt=""
              >
              <span>{{ data.title }}</span>
              <span>{{ data.firstName }} {{ data.lastName }}</span>
            </div>
          </div>
          <div
              v-else
              class="text-gray-500 italic p-2"
          >
            Nomalum
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import { useStore } from "@/stores";
import {ApiItems} from "@/models/ProjectModels";
import axios from "axios";

const dataStore = useStore();

interface Data {
  name: string;
  type: string;
  url: string;
}

interface Task {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  status: string;
  files: Data[]
}

const tasks = ref<Task[]>([]);
const draggedTask = ref<Task | string>('');
const selectedTask = ref<Task | string>('');
const isShowForm = ref(false);
const dropDown = ref<string | null>(null);

type ColumnKey = 'todo' | 'progress' | 'testing' | 'done';

const statuses = {
  todo: 'Todo',
  progress: 'Progress',
  testing: 'Testing',
  done: 'Done',
}

const columns = computed<Record<ColumnKey, Task[]>>(() =>  ({
  todo: dataStore.state.items.filter(item => item.status === 'todo'),
  progress: dataStore.state.items.filter(item => item.status === 'progress'),
  testing: dataStore.state.items.filter(item => item.status === 'testing'),
  done: dataStore.state.items.filter(item => item.status === 'done')
}))

const clickDrop = (index: string) => {
  dropDown.value = dropDown.value === index ? null : index;
}

const onDrop = async (status: ColumnKey) => {
  if(!draggedTask.value) return

  try {
    draggedTask.value = status
    await axios.put(`http://localhost:3000/posts/${draggedTask.value}`)
    draggedTask.value = '';
  }
  catch (error) {
    console.log(error);
  }
}

const editItem = (item: Task) => {
  selectedTask.value = item;
  isShowForm.value = true
}

const deleteItem = async (id: string) => {
  try {
    await axios.delete(`http://localhost:3000/posts/${id}`)
    dataStore.state.items = dataStore.state.items.filter(f => f.id !== id)
    await dataStore.loadGetApi()
  }
  catch (error) {
    console.error(error);
  }
}

onMounted(() => {
  dataStore.loadGetApi()
})
</script>



<style scoped>

</style>