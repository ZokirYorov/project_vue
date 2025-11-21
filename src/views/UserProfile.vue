<template>
  <div class="flex flex-col h-screen w-full p-4 gap-5">
    <div class="w-full flex items-center justify-between">
      <span class="font-semibold text-xl">Profile</span>
      <CButton
          isHasFaIcon
          faClass="fa-solid fa-reply"
          variant="primary"
          @click="clickLogOut"
      />
    </div>
    <CDialog
        has-close-icon
        v-model:show="profileVisible"
        @close="closeProfile"
        bodyClass="rounded-lg p-4 bg-bg-primary"
    >
      <AddUserprofile
          v-model="form"
          @saveForm="formSubmit"
          @reset="closeProfile"
      />
    </CDialog>
    <div
        :class="themeStore.theme === 'dark' ? 'bg-gray-800 border border-gray-700 text-white' : 'bg-white border border-gray-200 text-gray-900'"
        class="w-full rounded-2xl p-5 gap-6 flex flex-col">
      <span class="font-semibold text-lg">Profile</span>
      <div
          :class="themeStore.theme === 'dark' ? 'border border-gray-700' : 'border border-gray-200'"
          class="flex items-center justify-between border p-5 rounded-2xl">
        <div class="flex items-center justify-between gap-5">
          <div
              :class="themeStore.theme === 'dark' ? 'bg-gray-600 border border-gray-500' : 'border border-gray-200'"
              class="w-20 font-semibold h-20 flex items-center justify-center rounded-full">
            User img
          </div>
          <div class="flex flex-col ">
            <div class="font-semibold text-lg">User full name</div>
            <div class="flex items-center py-2 text-gray-400 text-sm">
              <span
                  :class="themeStore.theme === 'dark' ? 'border-r border-gray-600' : 'border-r border-gray-300'"
                  class="h-4 font-semibold items-center flex pr-4">User position</span>
              <span class="pl-4">User city</span>
            </div>
          </div>
        </div>
        <button
            @click="visibleProfile"
            type="button"
            :class="themeStore.theme === 'dark' ? 'bg-gray-700 border text-gray-400 border-gray-600' : 'text-gray-600 border border-gray-200'"
            class="gap-2 flex items-center justify-center p-3 rounded-full cursor-pointer hover:text-white text-sm  w-[80px]"
        >
          <i class="fa-solid fa-pencil"></i>
          <span>Edit</span>
        </button>
      </div>
      <div
          :class="themeStore.theme === 'dark' ? 'border border-gray-700' : 'border border-gray-200'"
          class="w-full flex flex-col p-5 gap-6 rounded-2xl"
          v-for="(item, index) in userItems"
          :key="index"
      >
        <div class="flex items-center justify-between">
          <span class="font-semibold text-lg">Personal information</span>
          <button
              @click="visibleProfile"
              type="button"
              :class="themeStore.theme === 'dark' ? 'bg-gray-700 border text-gray-400 border-gray-600' : 'text-gray-600 border border-gray-200'"
              class="gap-2 flex items-center justify-center p-3 rounded-full cursor-pointer font-semibold hover:text-white text-sm  w-[80px]"
          >
            <i class="fa-solid fa-pencil"></i>
            <span>Edit</span>
          </button>
        </div>
        <div class="flex flex-col gap-5">
          <div class="flex items-center justify-between w-[400px]">
            <div class="flex flex-col gap-2">
              <p class="flex text-gray-400 text-sm">First name</p>
              <span>{{item.firstName}}</span>
            </div>
            <div class="flex flex-col gap-2">
              <p class="flex text-gray-400 text-sm">Last name</p>
              <span>{{item.lastName}}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-5">
          <div class="flex items-center justify-between w-[400px]">
            <div class="flex flex-col gap-2">
              <p class="flex text-gray-400 text-sm">Email address</p>
              <span>{{item.email}}</span>
            </div>
            <div class="flex flex-col gap-2">
              <p class="flex text-gray-400 text-sm">Phone</p>
              <span>{{item.phoneNumber}}</span>
            </div>
          </div>
        </div>
        <div class="flex">
          <div class="flex items-center justify-between w-[400px]">
            <div class="flex flex-col gap-2">
              <p class="flex text-gray-400 text-sm">User position</p>
              <span>{{item.position}}</span>
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
import {ref} from "vue";
import AddUserprofile from "@/components/AddUserprofile.vue";
import CDialog from "@/components/CDialog.vue";
import { useToast } from "vue-toastification";

const Toast = useToast();
const themeStore = useStore();
const router = useRouter();

const isEditing = ref(false);
const profileVisible = ref(false);

const form = ref({
  id: null,
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  position: "",
})

const userItems = ref([
  {
    id: null,
    firstName: "Jon",
    lastName: "Doe",
    email: "random@mail.com",
    phoneNumber: "+99897 2589877",
    position: "Team manager"
  }
  ]);


const formSubmit = () => {
  if (isEditing.value) {
    const index = userItems.value.findIndex(item => item.id === form.value.id);
    if (index > -1) {
      userItems.value[index] = form.value;

    }
    Toast.success("Muvoffaqiyatli uzgartirildi!");
  } else {
    userItems.value.push(form.value);
    console.log('User itemlari', userItems.value);
    Toast.success("Muvoffaqiyatli qo'shildi!");
  }
  resetForm();
  profileVisible.value = false;
}


const visibleProfile = () => {
  profileVisible.value = true;
}

const closeProfile = () => {
  profileVisible.value = false;
  resetForm()
}

const resetForm = () => {
  form.value = {
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    position: '',
  };
}
const clickLogOut = () => {
  router.back();
}
</script>

<style scoped>

</style>