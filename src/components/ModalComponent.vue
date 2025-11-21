<template>
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
          @change="changeImage($event)"
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
            @click="$emit('resetForm')"
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
</template>


<script setup lang="ts">

import CButton from "@/components/CButton.vue";
import AppInput from "@/ui-C/AppInput.vue";
import {ref, watch} from "vue";
import { IForm } from '@/models/ProjectModels';
import { useStore } from "@/stores";

const themeStore = useStore();
const emit = defineEmits(["update:modelValue", 'changeImage', 'submitForm', 'resetForm']);
const props = defineProps<{
  modelValue: IForm;
  isEditing: boolean;
}>()
const form = ref({...props.modelValue});

const imageUrl = ref(null);


const submitForm = () => {
  emit("update:modelValue", form.value)
  emit("submitForm", form.value);
}


const changeImage = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    form.value.image = file;
    emit("update:modelValue", form.value);
  }
  emit("changeImage", file);
}

watch(
    () => props.modelValue,
    (val) => {
      form.value = { ...val };
    },
    { deep: true, immediate: true }
);

</script>

<style scoped>

</style>