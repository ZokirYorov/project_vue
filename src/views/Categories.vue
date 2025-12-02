<template>
  <div
      :class="themeStore.theme === 'dark' ? 'bg-gray-800 text-white border border-gray-700' : 'border border-gray-200 bg-white text-gray-800'"
      class="flex duration-300 transition-all w-full min-h-[400px] m-10 rounded-xl p-4"
  >
    <div
        class="flex gap-8 flex-col overflow-x-auto w-full">
      <div class="w-full flex justify-between">
        <h2 class="text-2xl font-semibold">Table component</h2>
        <div class="flex gap-5 mr-10">
          <CButton
              type="button"
              text="EXCEL"
              is-has-fa-icon
              class="bg-primary text-white px-4 py-2"
              fa-Class="fa-solid fa-download"
              @click.prevent="downloadFile()"
          />
          <CButton
              type="button"
              text="Added"
              class="bg-blue-800 text-white w-[80px]"
              @click="modalVisible()"
          />
        </div>
      </div>
      <CDialog
          :show="deleteConfirmItem"
          @close="deleteConfirmItem = false"
          body-class="justify-center bg-blue-800 text-center px-4 pb-8"
      >
        <DeleteConfirm
            title="Ushbu elementni uchirmoqchimisiz!"
            v-model:show="deleteConfirmItem"
            @confirm="deleteConfirm"
        />
      </CDialog>
      <CDialog
          :show="isShowItem"
          has-close-icon
          @close="closeDialog"
          bodyClass="rounded-lg p-4 bg-bg-primary"
      >
        <div class="w-full justify-center items-center flex">
          <form
              @submit.prevent="submitForm"
              class="gap-2 w-[350px] min-h-[400px] rounded-md flex flex-col p-4">
            <h2 class="flex text-xl font">
              {{isEditing ? "Formani o'zgartirish" : 'Add Product' }}
            </h2>
            <AppInput
                label="Image"
                type="file"
                @change="imageChange({event : $event})"
            />
            <AppInput
                type="text"
                label="Name"
                v-model="form.name"
                placeholder="Enter your name"
            />
            <AppInput
                label="Number"
                type="text"
                v-model="form.number"
                placeholder="Enter your phone number"
            />
            <AppInput
                label="Data"
                type="date"
                placeholder="Enter your birth date"
                v-model="form.data"
            />

            <div class="flex gap-5 h-2 justify-center m-5">
              <CButton
                  text="Cancel"
                  @click="closeDialog()"
                  variant="ghost-accent"
              />
              <CButton
                  text="Submit"
                  type="submit"
                  variant="primary"
              />
            </div>
          </form>
        </div>
      </CDialog>

      <table
          class="w-full overflow-x-auto text-sm rounded-2xl">
        <colgroup>
          <col style="width: 2%">
          <col style="width: 20%">
          <col style="width: 20%">
          <col style="width: 20%">
          <col style="width: 20%">
          <col style="width: 20%">
        </colgroup>
        <thead
            :class="themeStore.theme === 'dark' ? 'border-t border-b border-gray-700' : 'border-t border-b border-gray-200'"
            class="tracking-wider">
        <tr>
          <th class="text-start p-2">ID</th>
          <th class="text-start p-2">Image</th>
          <th class="text-start">F.I.O</th>
          <th class="text-start">Number</th>
          <th class="text-start">Data</th>
          <th class="text-start">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(item, index) in listItems"
            :key="index"
            :class="themeStore.theme === 'dark' ? 'hover:bg-gray-600 border-b border-gray-700' : 'border-t border-gray-200 hover:bg-gray-100'"
            class="rounded-2xl items-center"
        >
          <td class="text-center p-2">{{index + 1}}</td>
          <td class="text-start p-2">
            <Image
                :src="item.imageUrl"
                preview
                class="w-15 h-15 rounded-xl p-2 m-2 bg-white object-cover"
            >
              <template #preview="slotProps">
                <img
                    :src="item.imageUrl"
                    alt="preview"
                    class="object-cover w-300 rounded-2xl"
                    :style="slotProps.style"
                    @click="slotProps.onClick"
                />
              </template>
            </Image>
          </td>
          <td>{{item.name}}</td>
          <td>{{item.number}}</td>
          <td>{{item.data}}</td>
          <td class="items-center flex">
            <div class="items-center h-18 flex gap-2">
              <CButton
                  text="Edit"
                  variant="ghost-accent"
                  @click="editForm(item.id)"
              />
              <CButton
                  text="Delete"
                  variant="danger"
                  @click="deleteItem(item.id)"
              />
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import CDialog from "@/components/CDialog.vue";
import {ref} from "vue";
import CButton from "@/components/CButton.vue";
import DeleteConfirm from "@/components/DeleteConfirm.vue";
import {useDownload} from "@/composable/useDownload.ts";
import { useToast } from "vue-toastification";
import { useStore } from "@/stores/index.ts";
import AppInput from "@/components/ui/AppInput.vue";
import Image from "primevue/image"


const themeStore = useStore();
const Toast = useToast();
const isShowItem = ref(false);
const isEditing = ref(false);
const deleteConfirmItem = ref(false);
const itemsSelected = ref([]);
const loading = ref(false);

const form = ref({
  id: '',
  image: null,
  name: '',
  number: '',
  data: '',
});

const modalVisible = () => {
  isShowItem.value = true
}

const downloadFile = async () => {
  loading.value = true;
  try {
    await useDownload('Url manzilini kiritish kerak');
    setTimeout( () => {
      loading.value = false;
    }, 800);
  }
  catch (error) {
    console.log(error);
  }
}

const saveLocal = () => {
  localStorage.setItem("listItems", JSON.stringify(listItems.value));
}

const listItems =ref( JSON.parse(localStorage.getItem("listItems") || '[]') );

const submitForm = async () => {
  try {
    const newItem = {
      ...form.value,
      id: isEditing.value ? form.value.id : listItems.value.length + 1,
    };

    if (newItem.image instanceof File) {
      const reader = new FileReader();
      reader.onload = () => {
        newItem.imageUrl = reader.result;
        pushItem(newItem);
      };
      reader.readAsDataURL(newItem.image);
    } else {
      pushItem(newItem);
    }
  }
  catch (error) {
    console.log(error);
  }
};

const pushItem = (newItem) => {
  if (isEditing.value) {
    const index = listItems.value.findIndex(item => item.id === newItem.id);
    if (index !== -1) {
      listItems.value[index] = newItem;
      Toast.success("Successfully changed!")
    }
  } else {
    listItems.value.push(newItem);
    Toast.success("Added successfully!");
  }

  saveLocal()
  resetForm();
}


const editForm = (id) => {
  isEditing.value = true;
  isShowItem.value = true;

  const itemId = listItems.value.find(item => item.id === id);
  if (itemId) {
    form.value = {
      ...itemId,
    }
  }
}

const deleteConfirm = () => {
  try {
    if (itemsSelected.value === null) return;
    const index = listItems.value.findIndex(item => item.id === itemsSelected.value);
    if (index !== -1) {

      listItems.value.splice(index, 1);
      saveLocal()
      Toast.info('Successfully deleted!')
    }

    deleteConfirmItem.value = false;
    itemsSelected.value = null
  }
  catch (error) {
    console.log(error);
  }
}

const deleteItem = (id) => {
  itemsSelected.value = id;
  deleteConfirmItem.value = true;
}

const closeDialog = () => {
  resetForm()
  isShowItem.value = false;
  isEditing.value = false;
}


const resetForm = () => {
  form.value = {
    id: null,
    image: null,
    name: '',
    number: '',
    data: '',
  }
  isEditing.value = false;
  isShowItem.value = false;
}

const imageChange = ({event}) => {
  const file = event.target.files[0];
  if (file) {
    form.value.image = file;
    form.value.imageUrl = URL.createObjectURL(file);
  }
}

</script>


<style scoped>

</style>