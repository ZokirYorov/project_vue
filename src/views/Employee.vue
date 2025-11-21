<template>
  <div class="flex h-full w-full bg-[#0f172a] text-white">

    <!-- Sidebar -->
    <div class="w-80 border-r border-gray-700 p-4 flex flex-col">
      <h2 class="text-2xl font-semibold mb-4">Chats</h2>

      <!-- Search -->
      <div class="relative mb-4">
        <input
            v-model="search"
            type="text"
            placeholder="Search..."
            class="w-full rounded-lg bg-gray-800 px-4 py-2 focus:outline-none"
        />
      </div>

      <!-- Contacts list -->
      <div class="flex-1 overflow-y-auto space-y-2 pr-1">
        <div
            v-for="user in filteredUsers"
            :key="user.id"
            @click="selectUser(user)"
            class="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-800"
            :class="selectedUser?.id === user.id ? 'bg-gray-800' : ''"
        >
          <img :src="user.avatar" class="w-10 h-10 rounded-full" />
          <div>
            <p class="font-medium">{{ user.name }}</p>
            <p class="text-xs text-gray-400">{{ user.time }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Window -->
    <div class="flex-1 flex flex-col">

      <!-- Top Bar -->
      <div class="p-4 border-b border-gray-700 flex items-center gap-3">
        <img :src="selectedUser.avatar" class="w-10 h-10 rounded-full" />
        <div>
          <p class="font-medium text-lg">{{ selectedUser.name }}</p>
          <p class="text-xs text-gray-400">Online</p>
        </div>
      </div>

      <!-- Messages -->
      <div ref="msgArea" class="flex-1 overflow-y-auto p-4 space-y-4">
        <div
            v-for="msg in messages[selectedUser.id]"
            :key="msg.id"
            class="flex"
            :class="msg.from === 'me' ? 'justify-end' : 'justify-start'"
        >
          <div
              class="max-w-[60%] px-4 py-2 rounded-xl"
              :class="msg.from === 'me'
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-gray-800 text-gray-200 rounded-bl-none'"
          >
            {{ msg.text }}
            <span class="block text-xs text-gray-300 mt-1 text-right">
    {{ formatMessageTime(msg.time) }}
  </span>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="p-4 border-t border-gray-700 flex gap-3">
        <input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Type a message..."
            class="flex-1 rounded-lg bg-gray-800 px-4 py-2 focus:outline-none"
        />
        <button
            @click="sendMessage"
            class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";

const search = ref("");

const users = ref([
  {
    id: 1,
    name: "Kaiya George",
    time: "15 mins",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Lindsey Curtis",
    time: "30 mins",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Zain Geidt",
    time: "45 mins",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
]);

const selectedUser = ref(users.value[1]); // default open

const filteredUsers = computed(() =>
    users.value.filter((u) =>
        u.name.toLowerCase().includes(search.value.toLowerCase())
    )
);

function formatMessageTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);          // minutes
  const diffHour = Math.floor(diffMin / 60);           // hours
  const diffDay = Math.floor(diffHour / 24);           // days

  // If today → show "minutes ago" or "hours ago"
  const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

  if (isToday) {
    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin} minutes ago`;
    return `${diffHour} hours ago`;
  }

  // If yesterday
  if (diffDay === 1) {
    return `yesterday ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }

  // Otherwise → dd.mm.yyyy hh:mm
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return `${d}.${m}.${y} ${time}`;
}


// Chat messages storage
const messages = ref({
  1: [
    { id: 1, from: "them", text: "Hello!", time: new Date().toISOString() },
  ],
  2: [
    { id: 1, from: "them", text: "I want to make an appointment tomorrow.", time: new Date().toISOString() },
    { id: 2, from: "me", text: "Sure! What time?", time: new Date().toISOString() },
  ],
  3: [{ id: 1, from: "them", text: "Can you send me details?", time: new Date().toISOString() }],
});


const newMessage = ref("");
const msgArea = ref(null);
messages.value[selectedUser.value.id].push({
  id: Date.now(),
  from: "me",
  text: newMessage.value,
  time: new Date().toISOString()   // ⬅ vaqt
});

function selectUser(user) {
  selectedUser.value = user;
  scrollDown();
}

function sendMessage() {
  if (!newMessage.value.trim()) return;

  messages.value[selectedUser.value.id].push({
    id: Date.now(),
    from: "me",
    text: newMessage.value,
    time: new Date().toISOString(),  // ⬅ aniq vaqt
  });

  newMessage.value = "";
  scrollDown();
}


function scrollDown() {
  nextTick(() => {
    if (msgArea.value) msgArea.value.scrollTop = msgArea.value.scrollHeight;
  });
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 10px;
}
</style>
