<template>
  <div
      :class="themeStore.theme === 'dark' ? 'bg-gray-800 bg-dark border-b border-gray-700' : 'border-b border-gray-200 bg-white text-red-800'"
      class="flex flex-col w-full h-[70px] text-white">
    <div class="flex items-center justify-between h-full px-6 w-full">
      <div class="flex items-center gap-5 justify-between">
        <span
            :class="themeStore.theme === 'dark' ? 'bg-gray-700 text-blue-500' : 'bg-gray-400 text-gray-800'"
            class="flex shadow rounded font-semibold p-2 ml-10">MY PRODUCT</span>
        <i
            @click="toggleIcon"
            title="Menu sidebar"
            :class="themeStore.theme === 'dark' ? 'text-white' : 'bg-gray-400 text-white'"
           class="fa-solid fa-bars ml-10 duration-200 hover:bg-gray-500 p-1 rounded text-gray-800 cursor-pointer transition-all text-xl"
        ></i>
      </div>
      <h2 class=" bg-[var(--bg)] text-[var(--text)] text-2xl font-semibold"
      >Header Component</h2>
      <router-link
          to="/task"
          class="px-2 py-1 hover:bg-gray-700 bg-gray-600 rounded-md"
      >
        Tasks
      </router-link>
      <div class="flex items-center gap-5 justify-between">
        <div class="flex pr-40 items-center justify-between">
          <span
            v-if="themeStore.theme === 'dark'"
            @click="toggleTheme($event)"
            title="Light mode"
            class="flex border border-gray-600 text-gray-300 hover:text-white items-center cursor-pointer justify-center rounded-full w-10 h-10 bg-gray-800 hover:bg-gray-700 transition-all duration-200 shadow-lg"
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
               stroke-linejoin="round" class="feather feather-sun">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          </span>
          <span
              v-else
              title="Dark mode"
              @click="toggleTheme($event)"
              class="flex items-center justify-center cursor-pointer w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100 transition-all duration-200"
          >
          <i class="fa-regular fa-moon text-gray-600 text-xl"></i>
        </span>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/stores";

const themeStore = useStore();

const emit =  defineEmits(["toggle-icon"]);
const toggleIcon = () => {
  emit("toggle-icon");
}

const toggleTheme = (e: MouseEvent) => {
  const x = e.clientX;
  const y = e.clientY;

  const circle = document.createElement("div");

  circle.style.position = "fixed";
  circle.style.left = x + "px";
  circle.style.top = y + "px";
  circle.style.width = "20px";
  circle.style.height = "20px";
  circle.style.borderRadius = "50%";

  // rang theme ga qarab
  circle.style.background =
      themeStore.theme === "dark" ? "#ffffff" : "#111127";

  circle.style.transform = "translate(-50%, -50%) scale(0)";
  circle.style.transition = "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)";
  circle.style.zIndex = "9999";
  circle.style.pointerEvents = "none";

  document.body.appendChild(circle);

  requestAnimationFrame(() => {
    circle.style.transform = "translate(-50%, -50%) scale(200)";
  });

  // theme change o‘rtada
  setTimeout(() => {
    themeStore.setTheme(
        themeStore.theme === "dark" ? "light" : "dark"
    );
  }, 300);

  // remove
  setTimeout(() => {
    circle.remove();
  }, 800);
};

</script>


<style scoped>
.theme-reveal {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;

  /* MUHIM: real theme rangini oladi */
  background: var(--bg);

  clip-path: circle(0px at var(--x) var(--y));
  transition: clip-path 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
