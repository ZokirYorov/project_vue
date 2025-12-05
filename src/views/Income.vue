<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold mb-4">Admin Dashboard</h1>

    <div class="bg-white shadow rounded p-4">
      <h2 class="text-xl font-semibold mb-2">Users Table</h2>
      <input v-model="search" placeholder="Search..." class="mb-2 p-2 border rounded w-full"/>
      <table class="w-full table-auto border-collapse">
        <thead>
        <tr class="bg-gray-200">
          <th class="border p-2">ID</th>
          <th class="border p-2">Name</th>
          <th class="border p-2">Email</th>
          <th class="border p-2">Status</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in filteredUsers" :key="user.id">
          <td class="border p-2">{{ user.id }}</td>
          <td class="border p-2">{{ user.name }}</td>
          <td class="border p-2">{{ user.email }}</td>
          <td class="border p-2">
              <span :class="user.status === 'active' ? 'text-green-600' : 'text-red-600'">
                {{ user.status }}
              </span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const search = ref('');
const users = ref([
  { id: 1, name: 'Alice', email: 'alice@example.com', status: 'active' },
  { id: 2, name: 'Bob', email: 'bob@example.com', status: 'inactive' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', status: 'active' },
]);

const filteredUsers = computed(() => {
  if (!search.value) return users.value;
  return users.value.filter(user =>
      user.name.toLowerCase().includes(search.value.toLowerCase()) ||
      user.email.toLowerCase().includes(search.value.toLowerCase()) ||
      user.status.toLowerCase().includes(search.value.toLowerCase())

  );
});
</script>
