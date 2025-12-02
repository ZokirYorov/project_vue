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
    <div
        :class="themeStore.theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'"
        class="flex flex-col w-full gap-5 p-6 rounded-md"
    >
      <div class="flex gap-5 flex-col">
        <div class="flex items-center justify-between h-full w-full">
          <div class="flex items-center justify-between gap-10">
           <div class="relative flex items-center text-md font-semibold">
             <span
                 class="px-2 py-1 rounded-md"
                 :class="[themeStore.theme === 'dark' ? statusColors[1] : statusColor[1]]"
             >
               To Do
             </span>
             <span
                 :class="[themeStore.theme === 'dark' ? statusColors[1] : statusColor[1]]"
                 class="absolute rounded-full w-5 h-5 text-xs flex items-center justify-center -top-4 -right-3"
             >
               {{todoCount}}
             </span>
           </div>
            <div class="flex items-center relative text-md font-semibold">
              <span class="px-2 py-1 rounded-md"
                    :class="[themeStore.theme === 'dark' ? statusColors[2] : statusColor[2]]"
              >
                In Progress
              </span>
              <span class="absolute rounded-full w-5 h-5 text-xs flex items-center justify-center -top-4 -right-3"
                    :class="[themeStore.theme === 'dark' ? statusColors[2] : statusColor[2]]"
              >
                {{inProgressCount}}
              </span>
            </div>
            <div class="flex items-center relative text-md font-semibold">
              <span class="px-2 py-1 rounded-md"
                    :class="[themeStore.theme === 'dark' ? statusColors[3] : statusColor[3]]"
              >
                Completed
              </span>
              <span class="absolute rounded-full w-5 h-5 text-xs flex items-center justify-center -top-4 -right-3"
                    :class="[themeStore.theme === 'dark' ? statusColors[3] : statusColor[3]]"
              >
                {{completedCount}}
              </span>
            </div>
          </div>
          <CButton
              @click="clickFormVisible"
              text="Add new task"
              type="button"
              faClass="fa-solid fa-plus"
              isHasFaIcon
          />
          <CDialog
              :show="visibleForm"
              has-close-icon
              @close="closeVisibleForm"
              bodyClass="rounded-lg p-4 bg-bg-primary"
          >
            <div
                @close="visibleForm = false"
                class="w-full gap-5 flex items-center">
              <form
                  class="w-full gap-5 flex flex-col"
                  @submit.prevent="submitForm"
              >
                <span class="text-2xl font-semibold">Form title</span>
                <AppInput
                    label="Task title"
                    type="text"
                    placeholder="Inter task"
                    v-model="form.title"
                />
                <AppInput
                    label="Data"
                    type="date"
                    v-model:number="form.data"
                />
                <AppSelect
                    :options="optionStatuses"
                    text-field="status"
                    value-field="id"
                    disabledValue="Statusni tanlang"
                    v-model="form.status"
                />
                <div class="flex w-full justify-end items-center gap-5">
                  <CButton
                      type="button"
                      text="Cancel"
                      variant="ghost-accent"
                  />
                  <CButton
                      type="submit"
                      text="Save"
                      variant="primary"
                  />
                </div>
              </form>
            </div>

          </CDialog>
        </div>
        <div
            :class="themeStore.theme === 'dark' ? 'bg-gray-700 border border-gray-800' : 'bg-white border border-gray-200 text-gray-900'"
            class="flex justify-between transition-all duration-200 items-center w-full rounded-2xl shadow-lg"
            v-for="(item, index) in items"
            :key="index"
        >
          <div class="flex w-full items-center p-6 gap-4">
            <i class="fa-solid fa-bars text-gray-400"></i>
            <input
                type="checkbox"
                class="w-4 h-4"
                v-model="item.checked"
            />
            <span
                  class="font-sans"
                  :class="{textItem: item.checked}"
            >
              {{item.title}}
            </span>
          </div>
          <div class="flex items-center text-sm duration-200 transition-all gap-2">
            <span
                :class="[
                 themeStore.theme === 'dark'
                 ? statusColors[item.status]
                 : statusColor[item.status],
                    ]"
                class="rounded-2xl p-1 px-1 flex min-w-[80px] transition-all duration-200 font-semibold flex justify-center text-[12px]"
            >
              {{ getStatusText(item.status) }}
            </span>

            <span class="flex w-[130px] transition-all duration-200 items-center gap-1">
              <i class="fa-regular fa-calendar"></i>
              {{dataItem(item.data)}}
            </span>
            <div class="flex items-center gap-2 px-2">
              <CButton
                  type="button"
                  text="Edit"
                  variant="ghost-accent"
                  @click="editForm(item)"
              />
              <CButton
                  type="button"
                  text="Delete"
                  variant="danger"
                  @click="deleteItem(item.id)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup lang="ts">
import { useRouter } from "vue-router";
import CButton from "@/components/CButton.vue";
import { useStore } from "@/stores";
import {computed, ref} from "vue";
import AppInput from "@/components/ui/AppInput.vue";
import CDialog from "@/components/CDialog.vue";
import AppSelect from "@/components/ui/AppSelect.vue";
import { useToast } from "vue-toastification";
import OverlayBadge from "primevue/overlaybadge";


const Toast = useToast();
const themeStore = useStore();
const router = useRouter();

const backButton = () => {
  router.back();
}

const visibleForm = ref(false);
const selectedForm = ref<number | null>(null);

const form = ref<Task>({
  id: null,
  checked: false,
  title: "",
  data: null,
  status: "",
})

interface Task {
  id: number | null;
  title: string;
  data: Date | null;
  status: string | number;
  checked: boolean;
}

const items = ref<Task[]>([
  {
    id: 1,
    status: 1,
    checked: false,
    title: 'My new task',
    data: new Date()
  },
  {
    id: 2,
    status: 2,
    checked: false,
    title: 'Task',
    data: new Date()
  },
  {
    id: 3,
    status: 3,
    checked: false,
    title: 'Task completed',
    data: new Date()
  }
])

const todoCount = computed(() => items.value.filter(item => item.status === 1).length);
const inProgressCount = computed(() => items.value.filter(item => item.status === 2).length);
const completedCount = computed(() => items.value.filter(item => item.status === 3).length);


const submitForm = () => {
  if (selectedForm.value !== null) {
    const index = items.value.findIndex(item => item.id === form.value.id);
   if (index !== -1) {
     items.value[index] = {
       ... form.value
     };
   }
   Toast.success("Successfully changed!");
  } else {
    form.value.id = items.value.length + 1;
    items.value.push({... form.value});
    Toast.success("Added successfully!");
  }
  console.log('Itemlar', items.value);
visibleForm.value = false;
selectedForm.value = null;
  resetForm()
}

const editForm = (item: any) => {
  selectedForm.value = item.id;
  visibleForm.value = true;
  form.value = {...item};
}

const deleteItem = (id: number | null) => {
  if (id === null ) return Toast.error('An error occurred!');
  const itemCheck = items.value.find(item => item.id === id);
  if (itemCheck?.checked === true)
    return Toast.info("This information is marked!");
  const index = items.value.findIndex(i => i.id === id);
  if (index !== -1) {
    items.value.splice(index, 1);
  }
  Toast.info("Successfully deleted!");
}

const resetForm = () => {
  form.value = {
    id: null,
    title: '',
    checked: false,
    status: '',
    data: null,
  };
  selectedForm.value = null;
}

const statusColors: Record<string, string> = {
  1: "text-blue-300 bg-blue-950",
  2: "bg-[#213F40FF] text-green-400",
  3: "bg-[#38333AFF] text-[#FB6F3AFF]",
}

const statusColor: Record<string, string> = {
  1: "text-blue-600 bg-blue-100",
  2: "bg-[#EAFBF1FF] text-[#027984FF]",
  3: "bg-[#FCF0E9FF] text-[#FB8644FF]",
}

const optionStatuses = [
  {
    id: 1,
    status: "To Do",
  },
  {
    id: 2,
    status: "In Progress",
  },
  {
    id: 3,
    status: "Completed",
  }
]

const getStatusText = (id: number | string) => {
  return optionStatuses.find(s => s.id === id)?.status || 'Unknown';
};


const closeVisibleForm = () => {
  visibleForm.value = false;
}

const clickFormVisible = () => {
  visibleForm.value = true;
}
const dataItem = (inputDate: string | number | Date | undefined | null) => {
  if (!inputDate) return '';

  const data = new Date(inputDate);
  if (Number.isNaN(data.getTime())) return String(inputDate);
  const monthName = [
    "Yan", "Fev", "Mar", "Apr", "May", "Iyn",
    "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"
  ];

  const day = data.getDate().toString().padStart(2, "0");
  const year = data.getFullYear();
  const month = monthName[data.getMonth()];

  return `${day} ${month} ${year}`;
};

</script>

<style scoped>
.textItem{
  color: #989696;
  text-decoration-line: line-through;
}
</style>