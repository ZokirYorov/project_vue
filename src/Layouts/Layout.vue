<template>
  <div
      class="flex flex-col h-screen transition-all duration-200 overflow-y-auto"
      :class="themeStore.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'"
  >
    <Header
        class="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
        @toggle-icon="clickIconMenu"
    />
    <div class="flex h-full pt-[60px]">
      <Sidebar
          :openMenuToggle="openMenu"
          class="fixed top-[70px] left-0 h-[calc(100vh-60px)] z-50 transition-all duration-300"
      />
      <main
          class="flex w-full transition-all duration-300 overflow-x-auto p-6"
          :class="openMenu ? 'ml-[60px]' : 'ml-[300px]'"
      >
        <router-view />
        <div class="h-[1500px]"></div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/Header.vue";
import Sidebar from "@/components/Sidebar.vue";
import { ref } from "vue";
import { useStore } from "@/stores";

const themeStore = useStore();
const openMenu = ref(false);

const clickIconMenu = () => {
  openMenu.value = !openMenu.value;
};
</script>
