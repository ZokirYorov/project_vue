<template>
  <div
      :class="themeStore.theme === 'dark' ? 'bg-gray-800 text-white border border-gray-700' : 'border border-gray-200 bg-white text-gray-800'"
      class="flex flex-col gap-8 relative w-full overflow-x-auto duration-300 transition-all m-10 rounded-xl p-4"
  >
    <div class="flex items-center justify-between">
      <span class="text-xl font-bold">Table content</span>
      <div class="flex items-center gap-2">
        <div class="flex items-center border border-gray-600 rounded-md px-2">
          <i class="fa-solid fa-magnifying-glass text-sm border-r border-gray-400 pr-2 text-gray-400"></i>
          <input class="outline-none px-2 py-1" placeholder="Search..." v-model="searchItem" type="search">
        </div>
        <CButton
            type="button"
            text="Add"
            variant="primary"
            @click="addForm"
        />
      </div>
    </div>
    <CDialog
        :show="deleteRowItem"
        @close="deleteRowItem = false"
        bodyClass="rounded-lg !bg-bg-primary text-center px-4 py-6"
    >
      <DeleteConfirm title="Ushbu itemni uchirmoqchimisiz?"
                     v-model:show="deleteRowItem"
                     @confirm="handleDeleteItem"
      />
    </CDialog>
    <div
        class="shadow-xl flex flex-col justify-between overflow-x-auto rounded-xl p-4 border"
        :class="themeStore.theme === 'dark' ? 'border-gray-600' : 'border-gray-200'"
    >
      <DataTable
          :rowClass="rowClass"
          :value="filteredItems"
          tableStyle="w-100%"
          class="min-h-[100px] flex gap-4"
      >
        <Column
            v-for="(col, index) of columns" :key="index" :field="col.field" :header="col.header"
        >
          <template v-if="col.field === 'imageUrl'" #body="{ data }">
            <Image
                :src="getImage(data.imageUrl)"
                class="w-[50px] p-1 items-center flex object-cover h-15"
            >

            </Image>

          </template>
          <template v-if="col.field === 'price'" #body="{ data }">
            {{data.price}} so'm
          </template>
        </Column>
        <Column header="Actions" class="w-[100px]">
          <template #body="slotProps">
            <div class="flex gap-2">
              <button
                  @click="editRow(slotProps.data)"
                  class="bg-blue-500 cursor-pointer text-white m-2 px-3 rounded"
              >
                Edit
              </button>
              <button
                  @click="deleteRow(slotProps.data)"
                  class="bg-red-500 cursor-pointer text-white m-2 px-3 rounded"
              >
                Delete
              </button>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
    <CDialog
        v-model:show="visibleForm"
        has-close-icon
        @close="visibleForm = false"
        bodyClass="rounded-lg p-4 bg-bg-primary"
    >
      <div
          class="flex items-center justify-center p-4">
        <form
            :class="themeStore.theme === 'dark' ? 'text-white' : 'text-gray-800'"
            class="flex flex-col gap-4 w-full  rounded text-black"
            @submit.prevent="formSubmit"
        >
          <h2 class="text-2xl font-medium">Form title</h2>
          <AppInput label="Image"
                    type="file"
                    @change="fileChange($event)"
                    v-model="form.imageUrl"
          />
          <AppInput
              type="text"
              placeholder="Enter Product Name"
              v-model="form.name"
              label="Name"
              name="name"
          />
          <AppInput
              type="text"
              placeholder="Enter Product number"
              label="Product number"
              v-model="form.number"
          />
          <AppInput
              type="date"
              label="Date"
              v-model="form.date"
          />
          <AppInput
              type="text"
              placeholder="Enter price"
              label="Price"
              v-model="form.price"
          />

          <div class="flex w-full justify-end gap-2">
            <CButton
                type="button"
                text="Cancel"
                variant="ghost-accent"
                @click="formCancel()"
            />
            <CButton
                type="submit"
                text="Submit"
                variant="primary"
            />
          </div>
        </form>
      </div>
    </CDialog>
  </div>
</template>


<script setup>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import {computed, ref} from "vue";
import { useStore } from "@/stores/index.ts";
import { useToast } from "vue-toastification";
import AppInput from "@/components/ui/AppInput.vue";
import CButton from "@/components/CButton.vue";
import CDialog from "@/components/CDialog.vue";
import DeleteConfirm from "@/components/DeleteConfirm.vue";
import Image from 'primevue/image'

const Toast = useToast();
const themeStore = useStore();
const visibleForm = ref(false);
const selectedForm = ref('');
const deleteRowItem = ref(false);
const deleteId = ref(null);

const searchItem = ref('');

const filteredItems = computed(() => {
  const term = searchItem.value.toLowerCase();
  return products.value.filter(item =>
      item.name.toLowerCase().includes(term) ||
      String(item.number).toLowerCase().includes(term) ||
      item.date.toLowerCase().includes(term) ||
      String(item.price).toLowerCase().includes(term)
  );
})


const addForm = () => {
  visibleForm.value = true;
  resetForm()
}

const rowClass = () => {
  return themeStore.theme === 'dark' ? 'border-b border-gray-600' : 'border-b border-gray-200',
      'table-row-hover';
};

const editRow = (data) => {
  selectedForm.value = data;
  form.value = selectedForm.value;
  visibleForm.value = true;
}
const formSubmit = () => {
  const index = products.value.findIndex(p => p.id === form.value.id);
  if (selectedForm.value) {
    products.value[index] = {
      ...form.value,
    };
    Toast.success("Successfully changed!");
  } else {
    const idLength = products.value.length ? Math.max(...products.value.map(item => item.id)) : 0;
    form.value.id = idLength + 1;
    products.value.push(form.value);
    Toast.success("Added successfully!");
  }
  visibleForm.value = false;
  selectedForm.value = null;
  resetForm();
}
const formCancel = () => {
  visibleForm.value = false;
  resetForm();
}

const handleDeleteItem = () => {
  const index = products.value.findIndex(p => p.id === deleteId.value);
  products.value.splice(index, 1);
  Toast.info("Successfully deleted!");
  deleteRowItem.value = false;
}

const deleteRow = (data) => {
  deleteRowItem.value = true;
  deleteId.value = data.id;
}

const getImage = (file) => {
  if (!file) return "";
  if (typeof file === "string") return file; // oldin saqlangan bo‘lsa
  return URL.createObjectURL(file); // File → blob url
};

const fileChange = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    form.value.imageUrl = file;
  }
}

const resetForm = () => {
  form.value = {
    id: null,
    imageUrl: null,
    name: "",
    number: "",
    date: "",
    price: "",
  };
}
const form = ref({
  id: null,
  imageUrl: null,
  name: "",
  number: "",
  date: "",
  price: "",
})

const columns = ref([
  {
    field: "id",
    header: "ID",
  },
  {
    field: "imageUrl",
    header: "Image",
  },
  {
    field: "name",
    header: "Name",
  },
  {
    field: "number",
    header: "Number",
  },
  {
    field: "date",
    header: "Date",
  },
  {
    field: "price",
    header: "Price",
  }
])

const products = ref([
  {
    id: 1,
    imageUrl: "",
    name: "Product 1",
    number: 11,
    date: "2.12.2025",
    price: "4000"
  },
  {
    id: 2,
    imageUrl: "",
    name: "Product 2",
    number: 22,
    date: "4.12.2025",
    price: "2000"
  },
  {
    id: 3,
    imageUrl: "",
    name: "Product 3",
    number: 32,
    date: "3.11.2025",
    price: "5000"
  },
  {
    id: 4,
    imageUrl: "",
    name: "Product 4",
    number: 42,
    date: "1.12.2025",
    price: "5500"
  },
  {
    id: 5,
    imageUrl: "",
    name: "Product 5",
    number: 55,
    date: "2.12.2025",
    price: "2000"
  }
])
</script>


<style>
.table-row-hover:hover {
  background-color: #3e3a3a !important;
}
</style>