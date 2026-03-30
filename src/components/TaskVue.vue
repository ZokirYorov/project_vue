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
          :class="themeStore.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100 text-gray-600'"
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
          :class="themeStore.theme === 'dark' ? 'bg-gray-700 text-gray-600' : 'bg-gray-100 text-gray-600'"
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
          :class="themeStore.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100 text-gray-600'"
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
          :class="themeStore.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100 text-gray-600'"
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
          v-if="tasks.length > 0"
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
          <th class="text-start px-1 py-2">Data</th>
          <th class="text-start px-1 py-2">Uppercases</th>
        </tr>
        </thead>
        <tbody>
        <tr
            class="border-b border-gray-400 rounded"
            :class="themeStore.theme === 'dark' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'"
            v-for="(item, index) in tasks"
            :key="item.id"
        >
          <td class="text-center px-2 py-3">{{index + 1}}</td>
          <td class="px-2 py-3">
            <img v-if="item.files && item.files.length" class="w-16 h-16 text-white rounded-full" :src="item.files[0].url" alt="">
          </td>
          <td class="px-2 py-3">{{item.firstName}} {{item.lastName}}</td>
          <td class="px-2 py-3">{{item.title}}</td>
          <td class="px-2 py-3">{{item.status}}</td>
          <td class="px-2 py-3">{{formatDate(item.date)}}</td>
          <td class="px-2 py-3">
            <div
                class="flex items-center gap-2"
            >
              <span class="bg-emerald-500/30 p-2 font-semibold rounded-full">
              {{(item.lastName).charAt(0).toUpperCase()}} {{(item.firstName).charAt(0).toUpperCase()}}
              </span>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      <div
          class="flex flex-col w-full rounded-xl bg-gray"
          :class="themeStore.theme === 'dark' ? 'bg-gray-800' : 'bg-white'"
      >
        <CDialog
            :show="visibleCommentForm"
            @close="closeCommentModal"
            bodyClass="rounded-lg p-6 bg-bg-primary w-[600px]"
        >
          <form
              @submit.prevent="saveComment"
              class="flex flex-col gap-4 w-full rounded-lg"
          >
            <AppInput
                v-model="commentsForm.text"
                label="Comment Text"
                placeholder="Enter comment text"
                type="textarea"
            />
            <div
                class="flex items-center gap-2"
            >
              <CButton
                  type="button"
                  text="Cancel"
                  variant="ghost-accent"
                  @click="closeCommentModal"
              />
              <CButton
                  type="submit"
                  text="Save"
                  variant="primary"
              />
            </div>
          </form>
        </CDialog>
        <div class="flex items-center justify-between p-2"
        >
          <h2
              class="text-2xl p-2 font-semibold"
              :class="themeStore.theme === 'dark' ? 'text-gray-300' : 'text-gray-800'"
          >
            Comments title
          </h2>
          <CButton
              type="button"
              text="Add comment"
              variant="primary"
              @click="openCommentForm"
          />
        </div>
        <div
            class="flex items-center justify-between p-2"
            :class="dataStore.theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'"
        >
          <span>№</span>
          <span>Text</span>
          <span>Operations</span>
        </div>
        <div
            class="flex items-center justify-between p-2 border-b border-gray-400 gap-4 w-full"
            :class="themeStore.theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'"
            v-for="(item, index) in commentsList"
            :key="index"
        >
          <span class="p-2">{{index + 1}}</span>
          <span>{{item.text}}</span>
          <CButton
              type="button"
              text="Delete"
              variant="danger"
              @click="deleteComment(item.id)"
          />
         </div>
      </div>
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
  date: Date,
  title: string;
  status: string;
  files: TaskFile[];
}

interface Comment {
  text: string
}

const isShowDeleteConfirm = ref(false);
const selectedId = ref<string>('');
const showTaskModal = ref(false);
const editingTask = ref<Task | null>(null);
const visibleCommentForm = ref(false);
const editingColumn = ref<ColumnKey | null>(null);
const tasks = ref<Task[]>([]);
const comments = ref<any[]>([]);

// const commentsList = computed(() => dataStore.state.comment);
// const columns = computed<Record<ColumnKey, Task[]>>(() => ({
//   todo: dataStore.state.items.filter(f => f.status === "todo" ),
//   progress: dataStore.state.items.filter(f => f.status === "progress" ),
//   testing: dataStore.state.items.filter(f => f.status === "testing" ),
//   done: dataStore.state.items.filter(f => f.status === "done" ),
// }));

const commentsList = computed(() => comments.value);

const columns = computed<Record<ColumnKey, Task[]>>(() => ({
  todo: tasks.value.filter(task => task.status === 'todo'),
  progress: tasks.value.filter(task => task.status === 'progress'),
  testing: tasks.value.filter(task => task.status === 'testing'),
  done: tasks.value.filter(task => task.status === 'done'),
}))

const TASK_KEY = "tasks";
const COMMENT_KEY = "comments";

const saveTasks = () => {
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks.value));
};

const loadTasks = () => {
  const data = localStorage.getItem(TASK_KEY);
  tasks.value = data ? JSON.parse(data) : [];
};

const saveComments = () => {
  localStorage.setItem(COMMENT_KEY, JSON.stringify(comments.value));
};

const loadComments = () => {
  const data = localStorage.getItem(COMMENT_KEY);
  comments.value = data ? JSON.parse(data) : [];
};

const commentsForm = ref<Comment>({
  text: '',
});

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

const formatDate = (date: Date) => {
  if (!date) return
  const data = new Date(date);
  const day = data.getFullYear().toString();
  const month = data.getMonth().toString().slice(-2);
  const year = data.getDay().toString().slice(-2);
  return `${year}.${month + 1}.${day}`;
}

const addTask = (column: ColumnKey) => {
  editingTask.value = {
    id: '',
    lastName: '',
    firstName: '',
    date: new Date(),
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
    // await axios.put(`http://localhost:3000/posts/${task.id}`, task);

    // Store ni yangilash
    const index = tasks.value.findIndex(t => t.id === task.id);
    if (index !== -1) {
      tasks.value[index].status = column;
    }

    saveTasks()
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
  // try {
    // if (!selectedId.value || !editingColumn.value) return;

    // const res = await axios.delete(`http://localhost:3000/posts/${selectedId.value}`);
    // console.log('Delete item:',res.data);

  tasks.value = tasks.value.filter(item => item.id !== selectedId.value);
    // columns.value[editingColumn.value] = columns.value[editingColumn.value].filter(item => item.id !== selectedId.value);

    saveTasks();
    Toast.info('Task deleted!')
    closeDeleteModal()
  // }
  // catch (error) {
  //   console.error(error);
  // }
}

const deleteTask = async (column: ColumnKey, taskId: string) => {
  editingColumn.value = column;
  selectedId.value = taskId;
  isShowDeleteConfirm.value = true;

};

const deleteComment = async (id: string) => {
  console.log('Delete comment:', id);
  try {
    // await axios.delete(`http://localhost:3000/comments/${id}`);
    // await dataStore.loadGetPosts()
    comments.value = comments.value.filter(c => c.id !== id);
    saveComments();
  }
  catch (error) {
    console.log(error);
  }
}

const closeDeleteModal = () => {
  isShowDeleteConfirm.value = false;
  selectedId.value = '';
  editingColumn.value = null;
};


const submitTask = async () => {
  if (!editingTask.value || !editingColumn.value) return;

  const task = editingTask.value;

  if (!task.id) {
    task.id = Date.now().toString();
    task.date = new Date();

    // const res = await axios.post('http://localhost:3000/posts', task);
    tasks.value.push(task);
    Toast.success('Task created!');
  }
  // EDIT
  else {
    // const res = await axios.put(
    //     `http://localhost:3000/posts/${task.id}`,
    //     task
    // );
    const index = tasks.value.findIndex(t => t.id === task.id);
    if (index !== -1) {
      tasks.value[index] = task;
    }

    Toast.success('Task updated!');
  }
  saveTasks()
  closeModal();
};


const closeModal = () => {
  showTaskModal.value = false;
  editingTask.value = null;
  editingColumn.value = null;
};


const saveComment = async () => {
  try {
    // const res = await axios.post(`http://localhost:3000/comments`,
    //     {
    //       text: commentsForm.value.text,
    //     })
    comments.value.push({
      id: Date.now().toString(),
      text: commentsForm.value.text
    });
    // console.log('Response',res.data);
    saveComments();
    visibleCommentForm.value = false;
  }
  catch (error) {
    console.log(error);
  }
}


const openCommentForm = () => {
  visibleCommentForm.value = true;
  commentsForm.value = {
    text: '',
  }
}

const closeCommentModal = () => {
  visibleCommentForm.value = false;
  commentsForm.value = {
    text: '',
  }
}

onMounted(() => {
  loadTasks();
  loadComments();
  // dataStore.loadGetApi()
  // dataStore.loadGetPosts()
})
</script>

<style scoped>
</style>