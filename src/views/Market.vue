<template>
  <div class="flex gap-4 w-full bg-white dark:bg-gray-200 text-gray-800 p-6">
    <div class="w-1/3 bg-gray-100 p-3 rounded">
      <div class="flex items-center text-center w-full h-[50px]  gap-2 p-2">
        <h3 class="font-semibold flex items-center uppercase text-gray-600 text-sm">Boshlash</h3>
        <span
            v-if="columns.todo.length > 0"
            class="flex bg-gray-200 rounded-md min-w-6 h-6 items-center justify-center"
        >
          {{columns.todo.length}}
        </span>
      </div>
      <button
          class="mb-3 text-sm bg-blue-600 text-white px-2 py-1 rounded"
          @click="addTask('todo')"
      >
        + Add task
      </button>
      <Draggable
          v-model="columns.todo"
          group="tasks"
          :animation="200"
          :swapThreshold="0.65"
          ghost-class="ghost"
          class="h-full"
      >
        <template #item="{ element }">
          <TaskCard :task="element"
                    @edit="updateTask('todo', $event)"
                    @delete="deleteTask('todo', $event)"
          />
        </template>
      </Draggable>
    </div>

    <!-- BOSHLASH -->
    <div class="w-1/3 bg-gray-100 p-3 rounded">
      <div class="flex items-center w-full h-[50px] gap-2 p-2">
        <h3 class="font-semibold uppercase text-sm flex text-gray-600">Jarayonda</h3>
        <span
            v-if="columns.progress.length > 0"
            class="flex bg-gray-200 rounded-md min-w-6 items-center justify-center h-6"
        >
          {{columns.progress.length}}
        </span>
      </div>
      <button
          class="mb-3 text-sm bg-blue-600 text-white px-2 py-1 rounded"
          @click="addTask('progress')"
      >
        + Add task
      </button>
      <Draggable
          v-model="columns.progress"
          group="tasks"
          :animation="200"
          :swapThreshold="0.65"
          ghost-class="ghost"
          class="h-full"
      >
        <template #item="{ element }">
          <TaskCard :task="element"
                    @edit="updateTask('progress', $event)"
                    @delete="deleteTask('progress', $event)"
          />
        </template>
      </Draggable>
    </div>

    <!-- TEST -->
    <div class="w-1/3 bg-gray-100 p-3 rounded">
      <div class="flex items-center w-full h-[50px]  gap-2 p-2">
        <h3 class="font-semibold uppercase text-sm text-gray-600">Ko'rib chiqish va Test jarayonida</h3>
        <span
            v-if="columns.testing.length > 0"
            class="flex bg-gray-200 rounded-md min-w-6 h-6 items-center justify-center"
        >
          {{columns.testing.length}}
        </span>
      </div>
      <button
          class="mb-3 text-sm bg-blue-600 text-white px-2 py-1 rounded"
          @click="addTask('testing')"
      >
        + Add task
      </button>
      <Draggable
          v-model="columns.testing"
          item-key="id"
          group="tasks"
          :animation="200"
          :swapThreshold="0.65"
          ghost-class="ghost"
          class="h-full"

      >
        <template #item="{ element }">
          <TaskCard :task="element"
                    @edit="updateTask('testing', $event)"
                    @delete="deleteTask('testing', $event)"
          />
        </template>
      </Draggable>
    </div>

    <!-- BAJARILGAN -->
    <div class="w-1/3 bg-gray-100 p-3 rounded">
      <div class="flex items-center w-full h-[50px]  gap-2 p-2">
        <h3 class="font-semibold uppercase text-sm text-gray-600">Bajarilgan</h3>
        <span v-if="columns.done.length > 0" class="flex items-center justify-center min-w-6 h-6 rounded-md bg-gray-200">{{columns.done.length}}</span>
      </div>
      <button
          class="mb-3 text-sm bg-blue-600 text-white px-2 py-1 rounded"
          @click="addTask('done')"
      >
        + Add task
      </button>
      <Draggable
          v-model="columns.done"
          group="tasks"
          :animation="200"
          :swapThreshold="0.65"
          ghost-class="ghost"
          class="h-full"
      >
        <template #item="{ element }">
          <TaskCard :task="element"
                    @edit="updateTask('done', $event)"
                    @delete="deleteTask('done', $event)"
          />
        </template>
      </Draggable>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Draggable from 'vuedraggable'
import TaskCard from '../components/TaskCard.vue'

let uid = 1

const columns = ref({
  todo: [
    { id: 1, title: 'Task 1 task bajarishga tayyor' },
    { id: 2, title: 'Task 2' }
  ],
  progress: [
      { id: 1, title: 'Task 3' },
  ],
  testing: [
    { id: 3, title: 'Task 3 bajarish jarayonida' }
  ],
  done: [
    { id: 4, title: 'Task 4 bajarilib bulindi' }
  ]
})

// const addTask = (column) => {
//   columns.value[column].push({
//     id: ++uid,
//     title: '+Add task'
//   })
// }


// const updateTask = (column, updatedTask) => {
//   const index = columns.value[column].findIndex(t => t.id === updatedTask.id)
//   if (index !== -1) {
//     columns.value[column][index] = updatedTask
//   }
// }

// const deleteTask = (column, taskId) => {
//   columns.value[column] = columns.value[column].filter(t => t.id !== taskId)
// }


</script>



<style scoped>

</style>