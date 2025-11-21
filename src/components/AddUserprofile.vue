<template>
  <div class="w-full h-full flex items-center justify-center">
    <form
        @submit.prevent="saveForm"
        class="flex flex-col h-full p-4 gap-3"
    >
      <span class="flex font-medium text-xl">Edit profile information</span>
      <div class="flex items-center justify-between gap-2">
        <AppInput
          label="First Name"
          type="text"
          placeholder="Enter first name"
          v-model="form.firstName"
        />
        <AppInput
            label="Last Name"
            type="text"
            placeholder="Enter last name"
            v-model="form.lastName"
        />
      </div>
      <AppInput
          label="Email address"
          type="email"
          placeholder="Enter email address"
          v-model="form.email"
      />
      <AppInput
          label="Phone number"
          type="number"
          placeholder="Enter phone number"
          v-model="form.phoneNumber"
      />
      <AppInput
          label="Position"
          type="text"
          placeholder="Enter position"
          v-model="form.position"
      />
      <div class="flex items-center justify-end mt-5 gap-2">
        <CButton
            type="button"
            variant="ghost-accent"
            text="Close"
            @click="$emit('reset')"
        />
        <CButton
            type="submit"
            variant="primary"
            text="Submit"
        />
      </div>
    </form>
  </div>
</template>



<script setup lang="ts">

import AppInput from "@/ui-C/AppInput.vue";
import { ref } from "vue";
import CButton from "@/components/CButton.vue";

const emit = defineEmits(["update:modelValue", "reset", "saveForm"]);

const props = defineProps({
  modelValue: {
    required: true,
    type: Object,
  }
})

const form = ref({...props.modelValue});

const saveForm = () => {
  emit("update:modelValue", form.value);
  emit("saveForm", form.value);
}

</script>

<style scoped>

</style>