<template>
  <div class="flex flex-col gap-5 w-full h-full p-6">
    <div class="flex items-center justify-between gap-5">
      <span class="text-2xl font-semibold">Task list </span>
      <CButton
          text="Home"
          type="button"
          @click="backButton"
          variant="ghost-accent"
      />
    </div>

    <CDialog
        :show="isShowDeleteConfirm"
        has-close-icon
        @close="closeModal"
        bodyClass="rounded-lg !bg-bg-primary text-center px-4 py-6"
    >
      <DeleteConfirm
          title="Delete item"
          v-model:show="isShowDeleteConfirm"
          @confirm="handleConfirm"
      />
    </CDialog>

    <!-- Kanban Board -->
    <div class="flex gap-4 w-full rounded-md text-gray-800 p-6"
         :class="themeStore.theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 text-gray-600'"
    >
      <div
          :class="themeStore.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100 text-gray-400'"
          class="w-1/4 p-3 group rounded"
      >
        <div class="flex items-center text-center w-full h-[50px] gap-2 p-2">
          <h3 class="font-semibold flex items-center uppercase text-sm"
              :class="[themeStore.theme === 'dark' ? 'text-gray-400' : '']"
          >Boshlash</h3>
          <span
              v-if="columns.todo.length > 0"
              :class="themeStore.theme === 'dark' ? 'text-gray-200 bg-gray-500' : 'bg-gray-200 text-gray-600'"
              class="flex rounded-md min-w-6 h-6 items-center justify-center"
          >
            {{columns.todo.length}}
          </span>
        </div>
        <Draggable
            v-model="columns.todo"
            group="tasks"
            :animation="200"
            item-key="id"
            ghost-class="ghost"
            class="h-full"
            @change="onDragChange('todo', $event)"
        >
          <template #item="{ element }">
            <TaskCard
                :task="element"
                @edit="updateTask('todo', $event)"
                @delete="deleteTask('todo', $event)"
            />
          </template>
          <template #footer>
            <button
                :class="[themeStore.theme === 'dark' ? 'text-gray-400 bg-gray-800 hover:bg-gray-600' : 'text-gray-600 bg-white hover:bg-gray-200']"
                class="w-full text-start text-sm group-hover:opacity-100 opacity-0 group-hover:translate-y-1 transition-all duration-300 cursor-pointer p-2 rounded"
                @click="addTask('todo')"
            >
              + Add task
            </button>
          </template>
        </Draggable>
      </div>

      <!-- PROGRESS Column -->
      <div
          :class="themeStore.theme === 'dark' ? 'bg-gray-700 text-gray-600' : 'bg-gray-100 text-gray-400'"
          class="w-1/4 p-3 group rounded"
      >
        <div class="flex items-center w-full h-[50px] gap-2 p-2">
          <h3 class="font-semibold flex items-center uppercase text-sm"
              :class="[themeStore.theme === 'dark' ? 'text-gray-400' : '']"
          >Jarayonda</h3>
          <span
              v-if="columns.progress.length > 0"
              :class="themeStore.theme === 'dark' ? 'text-gray-200 bg-gray-500' : 'bg-gray-200 text-gray-600'"
              class="flex rounded-md min-w-6 h-6 items-center justify-center"
          >
            {{columns.progress.length}}
          </span>
        </div>
        <Draggable
            v-model="columns.progress"
            group="tasks"
            :animation="200"
            item-key="id"
            ghost-class="ghost"
            class="h-full"
            @change="onDragChange('progress', $event)"
        >
          <template #item="{ element }">
            <TaskCard
                :task="element"
                @edit="updateTask('progress', $event)"
                @delete="deleteTask('progress', $event)"
            />
          </template>
          <template #footer>
            <button
                :class="[themeStore.theme === 'dark' ? 'text-gray-400 bg-gray-800 hover:bg-gray-600' : 'text-gray-600 bg-white hover:bg-gray-200']"
                class="w-full text-start group-hover:opacity-100 opacity-0 group-hover:translate-y-1 transition-all duration-300 mb-3 text-sm cursor-pointer p-2 rounded"
                @click="addTask('progress')"
            >
              + Add task
            </button>
          </template>
        </Draggable>
      </div>

      <!-- TESTING Column -->
      <div
          :class="themeStore.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100 text-gray-400'"
          class="w-1/4 p-3 group rounded"
      >
        <div class="flex items-center w-full h-[50px] gap-2 p-2">
          <h3 class="font-semibold flex items-center uppercase text-sm"
              :class="[themeStore.theme === 'dark' ? 'text-gray-400' : '']"
          >Testing</h3>
          <span
              v-if="columns.testing.length > 0"
              :class="themeStore.theme === 'dark' ? 'text-gray-200 bg-gray-500' : 'bg-gray-200 text-gray-600'"
              class="flex rounded-md min-w-6 h-6 items-center justify-center"
          >
            {{columns.testing.length}}
          </span>
        </div>
        <Draggable
            v-model="columns.testing"
            group="tasks"
            :animation="200"
            item-key="id"
            ghost-class="ghost"
            class="h-full"
            @change="onDragChange('testing', $event)"
        >
          <template #item="{ element }">
            <TaskCard
                :task="element"
                @edit="updateTask('testing', $event)"
                @delete="deleteTask('testing', $event)"
            />
          </template>
          <template #footer>
            <button
                :class="[themeStore.theme === 'dark' ? 'text-gray-400 bg-gray-800 hover:bg-gray-600' : 'text-gray-600 bg-white hover:bg-gray-200']"
                class="w-full text-start group-hover:opacity-100 opacity-0 group-hover:translate-y-1 transition-all duration-300 mb-3 text-sm cursor-pointer p-2 rounded"
                @click="addTask('testing')"
            >
              + Add task
            </button>
          </template>
        </Draggable>
      </div>

      <!-- DONE Column -->
      <div
          :class="themeStore.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100 text-gray-400'"
          class="w-1/4 p-3 group rounded"
      >
        <div class="flex items-center w-full h-[50px] gap-2 p-2">
          <h3 class="font-semibold flex items-center uppercase text-sm"
              :class="[themeStore.theme === 'dark' ? 'text-gray-400' : '']"
          >Bajarilgan</h3>
          <span
              v-if="columns.done.length > 0"
              :class="themeStore.theme === 'dark' ? 'text-gray-200 bg-gray-500' : 'bg-gray-200 text-gray-600'"
              class="flex rounded-md min-w-6 h-6 items-center justify-center"
          >
            {{columns.done.length}}
          </span>
        </div>
        <Draggable
            v-model="columns.done"
            group="tasks"
            item-key="id"
            :animation="200"
            ghost-class="ghost"
            class="h-full"
            @change="onDragChange('done', $event)"
        >
          <template #item="{ element }">
            <TaskCard
                :task="element"
                @edit="updateTask('done', $event)"
                @delete="deleteTask('done', $event)"
            />
          </template>
          <template #footer>
            <button
                :class="[themeStore.theme === 'dark' ? 'text-gray-400 bg-gray-800 hover:bg-gray-600' : 'text-gray-600 bg-white hover:bg-gray-200']"
                class="w-full text-start group-hover:opacity-100 opacity-0 group-hover:translate-y-1 transition-all duration-300 mb-3 text-sm cursor-pointer p-2 rounded"
                @click="addTask('done')"
            >
              + Add task
            </button>
          </template>
        </Draggable>
      </div>
    </div>

    <!-- Task Modal -->
    <CDialog
        :show="showTaskModal"
        has-close-icon
        @close="closeModal"
        bodyClass="rounded-lg p-6 bg-bg-primary w-[600px]"
    >
      <form @submit.prevent="submitTask" class="flex flex-col gap-4">
        <h2 class="text-2xl font-semibold">
          {{ editingTask?.id ? 'Edit form' : 'Add form' }}
        </h2>

        <!-- Title Input -->
        <AppInput
            label="Task Title"
            placeholder="Enter task title"
            v-model="editingTask!.title"
            required
        />
        <AppInput
            label="Ism"
            type="text"
            placeholder="Enter name"
            v-model="editingTask!.firstName"
        />
        <AppInput
            label="Familiya"
            type="text"
            placeholder="Enter firstname"
            v-model="editingTask!.lastName"
        />
        <!-- File Upload Section -->
        <AppInput
            type="file"
            label="File"
            placeholder="Enter task file"
            @change="imageChange($event)"
        />
        <!-- Buttons -->
        <div class="flex justify-end gap-3 mt-4">
          <CButton
              type="button"
              text="Cancel"
              variant="ghost-accent"
              @click="closeModal"
          />
          <CButton
              type="submit"
              text="Save Task"
              variant="primary"
          />
        </div>
      </form>
    </CDialog>
    <div
        class="flex flex-col gap-4 h-full pb-6"
    >
      <table
          v-if="dataStore.state.items.length > 0"
          class="w-full rounded-lg shadow-md"
          :class="themeStore.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200 text-gray-600'"
      >
        <colgroup>
          <col style="width: 2%">
          <col style="width: 15%">
          <col style="width: 15%">
          <col style="width: 15%">
          <col style="width: 15%">
          <col style="width: 15%">
        </colgroup>
        <thead
        >
        <tr>
          <th class="items-start px-1 py-2">№</th>
          <th class="text-start px-1 py-4">File</th>
          <th class="text-start px-1 py-2">Name</th>
          <th class="text-start px-1 py-2">Title</th>
          <th class="text-start px-1 py-2">Status</th>
          <th class="text-start px-1 py-2">Operations</th>
        </tr>
        </thead>
        <tbody>
        <tr
            class="border-b border-gray-400 rounded"
            :class="themeStore.theme === 'dark' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'"
            v-for="(item, index) in dataStore.state.items"
            :key="item.id"
        >
          <td class="text-center px-2 py-3">{{index + 1}}</td>
          <td class="px-2 py-3">
            <img v-if="item.files && item.files.length" class="w-16 h-16 text-white rounded-full" :src="item.files[0].url" alt="">
          </td>
          <td class="px-2 py-3">{{item.firstName}} {{item.lastName}}</td>
          <td class="px-2 py-3">{{item.title}}</td>
          <td class="px-2 py-3">{{item.status}}</td>
          <td class="px-2 py-3">
            <div
                class="flex items-center gap-2"
            >
              <button @click="editItem(item)" class="bg-gray-400 rounded px-2 py-1">Edit</button>
              <button @click="deleteItem(item.id)" class="bg-red-800 rounded px-2 py-1 cursor-pointer hover:bg-red-700">Delete</button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import CButton from "@/components/CButton.vue";
import { useStore } from "@/stores";
import {computed, onMounted, ref} from "vue";
import AppInput from "@/components/ui/AppInput.vue";
import CDialog from "@/components/CDialog.vue";
import TaskCard from "@/components/TaskCard.vue";
import Draggable from "vuedraggable";
import axios from "axios";
import { useToast } from "vue-toastification";
import DeleteConfirm from "@/components/DeleteConfirm.vue";

const Toast = useToast();
const themeStore = useStore();
const router = useRouter();
const dataStore = useStore();

const backButton = () => {
  router.back();
}

type ColumnKey = 'todo' | 'progress' | 'testing' | 'done';

interface TaskFile {
  name: string;
  url: string;
  type: string;
}

interface Task {
  id: string;
  lastName: string,
  firstName: string,
  title: string;
  status: string;
  files: TaskFile[];
}

const isShowDeleteConfirm = ref(false);
const selectedId = ref<string>('');
const showTaskModal = ref(false);
const editingTask = ref<Task | null>(null);
const editingColumn = ref<ColumnKey | null>(null);

const columns = computed<Record<ColumnKey, Task[]>>(() => ({
  todo: dataStore.state.items.filter(f => f.status === "todo" ),
  progress: dataStore.state.items.filter(f => f.status === "progress" ),
  testing: dataStore.state.items.filter(f => f.status === "testing" ),
  done: dataStore.state.items.filter(f => f.status === "done" ),
}));

const imageChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || !editingTask.value) return
  const file = input.files[0]
  const previewUrl = URL.createObjectURL(file) //  bunda rasm faqat brauzerda saqlanadi json-server esa shuni saqlaydi

  editingTask.value.files = [{
    name: file.name,
    type: file.type,
    url: previewUrl
  }]
}
  // const reader = new FileReader() // bu esa base64 qilib uzun tekst bilan saqlaydi
  // reader.onload = () => { editingTask.value!.files = [{
  //   name: file.name,
  //   type: file.type,
  //   url: reader.result as string
  // }]
  // }
  // reader.readAsDataURL(file)


const editItem = (item: Task) => {
  editingTask.value = {...item}
  showTaskModal.value = true

}
const deleteItem = async (id: string) => {
  try {
    await axios.delete(`http://localhost:3000/posts/${id}`)
    dataStore.state.items = dataStore.state.items.filter(f => f.id !== id)
    await dataStore.loadGetApi()
  }
  catch (error) {
    console.log(error);
  }
}

const addTask = (column: ColumnKey) => {
  editingTask.value = {
    id: '',
    lastName: '',
    firstName: '',
    title: '',
    status: column,
    files: []
  };
  editingColumn.value = column;
  showTaskModal.value = true;
};

const onDragChange = async (column: ColumnKey, evt: any) => {
  if (!evt.added) return;

  const task = evt.added.element;
  const oldStatus = task.status;
  task.status = column;

  try {
    await axios.put(`http://localhost:3000/posts/${task.id}`, task);

    // Store ni yangilash
    const index = dataStore.state.items.findIndex(t => t.id === task.id);
    if (index !== -1) {
      dataStore.state.items[index].status = column;
    }

    // Toast.success(`Moved to ${column}`);
  } catch (error) {
    console.error('Drag error:', error);
    task.status = oldStatus;
    Toast.error('Move failed!');
  }
};

const updateTask = (column: ColumnKey, updatedTask: Task) => {
  editingTask.value = { ...updatedTask};
  editingColumn.value = column;
  showTaskModal.value = true;
};

const handleConfirm = async () => {
  try {
    if (!selectedId.value || !editingColumn.value) return;

    const res = await axios.delete(`http://localhost:3000/posts/${selectedId.value}`);

    console.log('Delete item:',res.data);
    dataStore.state.items = dataStore.state.items.filter(item => item.id !== selectedId.value);
    columns.value[editingColumn.value] = columns.value[editingColumn.value].filter(item => item.id !== selectedId.value);

    Toast.info('Task deleted!')
    closeDeleteModal()
  }
  catch (error) {
    console.error(error);
  }
}

const deleteTask = async (column: ColumnKey, taskId: string) => {
  editingColumn.value = column;
  selectedId.value = taskId;
  isShowDeleteConfirm.value = true;

};

const closeDeleteModal = () => {
  isShowDeleteConfirm.value = false;
  selectedId.value = '';
  editingColumn.value = null;
};


const submitTask = async () => {
  if (!editingTask.value || !editingColumn.value) return;

  const task = editingTask.value; // 👈 TypeScript endi ishonadi

  // NEW
  if (!task.id) {
    task.id = Date.now().toString();

    const res = await axios.post('http://localhost:3000/posts', task);
    dataStore.state.items.push(res.data);
    Toast.success('Task created!');
  }
  // EDIT
  else {
    const res = await axios.put(
        `http://localhost:3000/posts/${task.id}`,
        task
    );

    const index = dataStore.state.items.findIndex(t => t.id === task.id);
    if (index !== -1) {
      dataStore.state.items[index] = res.data;
    }

    Toast.success('Task updated!');
  }

  closeModal();
};


const closeModal = () => {
  showTaskModal.value = false;
  editingTask.value = null;
  editingColumn.value = null;
};

onMounted(() => {
  dataStore.loadGetApi()
})
</script>

<style scoped>
</style>