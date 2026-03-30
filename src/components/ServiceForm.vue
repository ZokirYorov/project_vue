<template>
  <div class="shadow-xl border border-gray-300 p-4 rounded-xl flex flex-col gap-2">
    <h2 class="font-semibold">Services</h2>
    <input
        class="border border-gray-200 px-2 py-1 rounded-lg"
        v-model="form.name"
        placeholder="Service"
    />
    <input
        class="border border-gray-200 px-2 py-1 rounded-lg"
        v-model="form.price"
        placeholder="Price"
    />
    <button
        type="submit"
        @click="save"
        class="bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600 text-white font-semibold p-2"
    >
      Add
    </button>

    <ul class="flex flex-col gap-2 mt-2">
      <li
          class="flex items-center justify-between border border-gray-200 px-4 py-2 text-sm font-semibold rounded-md shadow hover:shadow-lg"
          v-for="(s, i) in list"
          :key="s.id"
      >
        <span>{{i + 1}}</span>
        <span>
        {{ s.name }} - {{ s.price }}
        </span>
        <button
            @click="removeItem(s.id)"
            class="bg-red-400 hover:bg-red-600 rounded-md cursor-pointer text-white font-semibold p-2"
        >
          O'chirish
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import axios from "axios";

// const salonId = 'demo'

interface List {
  id: string;
  name: string;
  price: number;
}

const form = ref({
  name: '',
  price: '',
})

const list = ref<List[]>(JSON.parse(localStorage.getItem('service') || '[]'))

const saveToLocale = () => {
  localStorage.setItem('service', JSON.stringify(list.value));
}

// const load = async () => {
//   const res = await axios.get(`/services/${salonId}`)
//   list.value = res.data
// }

const save = async () => {
  if (!form.value.name || !form.value.price) return;

  list.value.push({
    id: new Date().toString(),
    name: form.value.name,
    price: form.value.price,
  })

  form.value = {name: '', price: ''};
  saveToLocale()
  // await axios.post('/services', { name: name.value, price: price.value, salonId })
  // await load()
}

const removeItem = (id: string) => {
  const index = list.value.findIndex((i) => i.id === id)
  list.value.splice(index, 1)
  saveToLocale()
}

// onMounted(load)
</script>