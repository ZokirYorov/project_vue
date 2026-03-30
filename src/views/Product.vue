<template>
  <div class="p-6 bg-white rounded-md shadow-xl w-full">
    <h1 class="text-2xl font-bold mb-4">Salon CRM</h1>

    <div class="grid grid-cols-3 gap-4">
      <ClientForm />
      <ServiceForm />
      <AppointmentForm/>
    </div>
  </div>
</template>

<script setup lang="ts">

import ClientForm from "@/components/ClientForm.vue";
import ServiceForm from "@/components/ServiceForm.vue";
import AppointmentForm from "@/components/AppointmentForm.vue";
</script>