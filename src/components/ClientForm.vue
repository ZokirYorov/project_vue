<template>
  <div class="shadow-xl border border-gray-300 p-4 rounded-xl flex flex-col gap-2">
    <h2 class="font-semibold">Clients</h2>
    <input
        class="border border-gray-200 px-2 py-1 rounded-lg"
        v-model="form.name"
        placeholder="Name"
    />
    <input
        class="border border-gray-200 px-2 py-1 rounded-lg"
        v-model="form.phone"
        placeholder="Phone"
    />
    <button
        class="bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600 text-white font-semibold p-2"
        @click="save"
    >
      Add
    </button>

    <ul class="flex flex-col gap-2 mt-2">
      <li
          class="flex items-center justify-between border border-gray-200 px-4 py-2 text-sm font-semibold rounded-md shadow hover:shadow-lg"
          v-for="(c, i) in list"
          :key="c.id"
      >
        <span>{{i + 1}}</span>
        <span >{{ c.name }} - {{c.phone}}</span>
        <button
            class="bg-red-400 hover:bg-red-600 rounded-md cursor-pointer text-white font-semibold p-2"
            @click="remove(c.id)"
        >
          O'chirish
        </button>
      </li>
      <li v-if="list.length === 0" class="flex items-center justify-center">
        Hali mijoz yuq
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, computed} from 'vue'
// import axios from "axios";

// const salonId = 'demo'

interface List {
  id: string;
  name: string;
  phone: string;
}

const form = ref({
  name: "",
  phone: "",
})
const list = ref<List[]>(JSON.parse(localStorage.getItem('clients') || '[]'));

const saveToLocale = () => {
  localStorage.setItem("clients", JSON.stringify(list.value));
}

// const load = async () => {
//   const res = await axios.get(`/clients/${salonId}`)
//   list.value = res.data
// }

const save = async () => {
  if (!form.value.name || !form.value.phone) return;

  list.value.push({
    id: new Date().toString(),
    name: form.value.name,
    phone: form.value.phone,
  });

  form.value = {name: '', phone: ''};

  // await axios.post('/clients', { name: name.value, phone: phone.value, salonId })
  // await load();
  await saveToLocale()
}

const remove = async (id: string) => {
  const index = list.value.findIndex(e => e.id === id)
  list.value.splice(index, 1);
  saveToLocale()
}

// onMounted(load)
</script>