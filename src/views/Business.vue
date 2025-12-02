<template>
  <div
      :class="themeStore.theme === 'dark' ? 'bg-gray-800 text-white border border-gray-700' : 'border border-gray-200 bg-white text-gray-800'"
      class="flex  duration-300 transition-all w-full min-h-[400px] m-10 rounded-xl p-4">
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
              @click="visibleModal()"
          />
        </div>
      </div>
      <CDialog
          :show="confirmDelete"
          @close="confirmDelete = false"
          body-class="justify-center bg-blue-800 text-center px-4 pb-8"
      >
        <DeleteConfirm
            title="Ushbu elementni uchirmoqchimisiz!"
            v-model:show="confirmDelete"
            @confirm="deleteConfirm"
        />
      </CDialog>
      <CDialog
          :show="isShow"
          has-close-icon
          @close="closeDialog"
          bodyClass="rounded-lg p-4 bg-bg-primary"
      >
        <ModalComponent
            v-model="form"
            :is-editing="isEditing"
            @submitForm="saveForm($event)"
            @resetForm="resetForm"
        />
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
            <th class="text-start p-3">ID</th>
            <th class="text-start p-2">Image</th>
            <th class="text-start">F.I.O</th>
            <th class="text-start">Number</th>
            <th class="text-start">Data</th>
            <th class="text-start">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
              v-for="(item, index) in menuItems"
              :key="index"
              :class="themeStore.theme === 'dark' ? 'hover:bg-gray-600 border-b border-gray-700' : 'border-t border-gray-200 hover:bg-gray-100'"
              class="rounded-2xl items-center"
          >
            <td class="text-center">{{index + 1}}</td>
            <td class="text-start p-1">

              <Image
                  :src="item.imageUrl"
                  preview
                  alt="Image"
                  class="w-15 h-15 flex p-2 m-2  bg-white rounded-xl object-cover"
              >
                <template #preview="slotProps">
                  <img
                      alt="preview"
                      :src="item.imageUrl"
                      class="max-w-[900px]"
                      :style="slotProps.style"
                      @click="slotProps.onClick"
                  />
                </template>

              </Image>
<!--              <img-->
<!--                :src="item.imageUrl"-->
<!--                class="w-15 m-2 p-2 bg-white h-15 rounded-xl object-cover"-->
<!--             alt="Photo"/>-->
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

import ModalComponent from "@/components/ModalComponent.vue";
import CDialog from "@/components/CDialog.vue";
import {ref} from "vue";
import CButton from "@/components/CButton.vue";
import DeleteConfirm from "@/components/DeleteConfirm.vue";
import {useDownload} from "@/composable/useDownload.ts";
import { useToast } from "vue-toastification";
import { useStore } from "@/stores/index.ts";
import Image from "primevue/image"


const themeStore = useStore();
// const formStore = useStore();
const Toast = useToast();
const isShow = ref(false);
const isEditing = ref(false);
const confirmDelete = ref(false);
const selectedItems = ref([]);
const loading = ref(false);

const form = ref({
  id: '',
  image: null,
  name: '',
  number: '',
  data: '',
});

const visibleModal = () => {
  isShow.value = true
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

const saveToLocal = () => {
  localStorage.setItem("menuItems", JSON.stringify(menuItems.value));
}

const menuItems =ref( JSON.parse(localStorage.getItem("menuItems") || '[]') );

const saveForm = async () => {
  try {
    const newItem = {
      ...form.value,
      id: isEditing.value ? form.value.id : menuItems.value.length + 1,
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
    const index = menuItems.value.findIndex(item => item.id === form.value.id);
    if (index !== -1) {
      menuItems.value[index] = newItem;
      Toast.success("Successfully changed!")
    }
  } else {
    menuItems.value.push(newItem);
    Toast.success("Added successfully!");
  }

  saveToLocal()
  resetForm();
}


const editForm = (id) => {
  isEditing.value = true;
  isShow.value = true;

  const itemId = menuItems.value.find(item => item.id === id);
  if (itemId) {
    form.value = {
     ...itemId,
    }
  }
}

const deleteConfirm = () => {
 try {
   if (selectedItems.value === null) return;
   const index = menuItems.value.findIndex(item => item.id === selectedItems.value);
   if (index !== -1) {

     menuItems.value.splice(index, 1);
     saveToLocal()
     Toast.info('Successfully deleted!')
   }

   confirmDelete.value = false;
   selectedItems.value = null
 }
 catch (error) {
   console.log(error);
 }
}

const deleteItem = (id) => {
  selectedItems.value = id;
  confirmDelete.value = true;
}

const closeDialog = () => {
  resetForm()
  isShow.value = false;
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
  isShow.value = false;
}


</script>


<style scoped>

</style>