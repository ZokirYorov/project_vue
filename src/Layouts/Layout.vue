<template>
  <div class="cursor-dot" ref="dot"></div>
  <div class="cursor-circle" ref="circle"></div>
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
import {onMounted, onUnmounted, ref} from "vue";
import { useStore } from "@/stores";

const themeStore = useStore();
const openMenu = ref(false);

const clickIconMenu = () => {
  openMenu.value = !openMenu.value;
};

const dot = ref<HTMLElement | null>(null)
const circle = ref<HTMLElement | null>(null)

const moveCursor = (e: MouseEvent) => {
  if (!dot.value || !circle.value) return

  const { clientX, clientY } = e

  dot.value.style.left = `${clientX}px`
  dot.value.style.top = `${clientY}px`

  circle.value.style.left = `${clientX}px`
  circle.value.style.top = `${clientY}px`
}

onMounted(() => {
  window.addEventListener('mousemove', moveCursor)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', moveCursor)
})

const scaleUp = () => {
  if (circle.value)
    circle.value.style.transform = 'translate(-50%, -50%) scale(1.6)'
}

const scaleDown = () => {
  if (circle.value)
    circle.value.style.transform = 'translate(-50%, -50%) scale(1)'
}

onMounted(() => {
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', scaleUp)
    el.addEventListener('mouseleave', scaleDown)
  })
})
</script>
<style>
body{
  cursor: none;
}
.cursor-dot {
  position: fixed;
  top: 0;
  left: 0;
  width: 6px;
  height: 6px;
  background: #3b82f6; /* blue */
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
}
.cursor-circle {
  position: fixed;
  top: 0;
  left: 0;
  width: 36px;
  height: 36px;
  border: 2px solid rgba(59, 130, 246, 0.5);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  transition: transform 0.15s ease-out;
}
</style>
