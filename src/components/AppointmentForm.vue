<template>
  <div class="shadow-xl border border-gray-300 p-4 rounded-xl flex flex-col gap-2">
    <h2 class="font-semibold">Appointments</h2>
    <input
        class="border border-gray-200 px-2 py-1 rounded-lg"
        v-model="form.clientId"
        placeholder="ClientId"
    />
    <input
        type="date"
        class="border border-gray-200 px-2 py-1 rounded-lg"
        v-model="form.date"
    />
    <input
        type="time"
        class="border border-gray-200 px-2 py-1 rounded-lg"
        v-model="form.startTime"
    />
    <input
        type="time"
        class="border border-gray-200 px-2 py-1 rounded-lg"
        v-model="form.endTime"
    />
    <button @click="save" class="bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600 text-white font-semibold p-2">Book</button>

    <ul class="flex flex-col gap-2 mt-2">
      <li
          class="flex items-center justify-between border border-gray-200 px-4 py-2 text-sm font-semibold rounded-md shadow hover:shadow-lg"
          v-for="(a, i) in list"
          :key="a.id"
      >
        <span>{{ i + 1 }}</span>
        <span>{{a.clientId}}</span>
        <span>
        {{ a.date }} {{ a.startTime }}
        </span>
        <span>{{a.endTime}}</span>
        <button
            @click="removeItem(a.id)"
            type="button"
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

// const salonId = 'demo'

interface List {
  id: string;
  clientId: string;
  date: string;
  startTime: string;
  endTime: string;
}

const form = ref({
  clientId: '',
  date: '',
  startTime: '',
  endTime: '',
})

const list = ref<List[]>(JSON.parse(localStorage.getItem('booking') || '[]'));

const saveToLocale = () => {
  localStorage.setItem('booking', JSON.stringify(list.value));
}
// const load = async () => {
//   const res = await axios.get(`/appointments/${salonId}`)
//   list.value = res.data
// }

const save = async () => {

  if (!form.value.clientId || !form.value.date  || !form.value.startTime || !form.value.endTime) return

  list.value.push({
    id: new Date().toString(),
    clientId: form.value.clientId,
    date: form.value.date,
    startTime: form.value.startTime,
    endTime: form.value.endTime,
  })
  form.value = {
    clientId: '',
    date: '',
    startTime: '',
    endTime: '',
  }

  saveToLocale()
  // await axios.post('/appointments', {
  //   salonId,
  //   clientId: clientId.value,
  //   date: date.value,
  //   startTime: startTime.value,
  //   endTime: endTime.value,
  //   status: 'pending',
  //   isPaid: false
  // })
  // await load()
}

const removeItem = (id: string) => {
  const index = list.value.findIndex((i) => i.id === id)
  list.value.splice(index, 1)
  saveToLocale()
}
// onMounted(load)
</script>
