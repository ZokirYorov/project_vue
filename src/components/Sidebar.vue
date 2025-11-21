<template>
  <div

      :class="['text-white py-6 px-6 gap-2 duration-300 transition-all h-full min-h-screen flex flex-col z-20',
      themeStore.theme === 'dark' ? 'border-r border-gray-700 text-white bg-gray-800' : 'border-r border-gray-200 bg-white',
      openMenuToggle ? 'w-[60px] items-center' : 'w-[300px]'
      ]">
    <div
        v-for="(item, index) in menuItems"
        :key="index"
        :class="[
            themeStore.theme === 'dark' ? '' : 'text-blue-900',
            index === menuItems.length - 2 ? 'mt-5' : '',
            index === menuItems.length - 1 ? 'hidden' : '',
        ]"
    >
      <div
          @click="routerClick(item.path)"
          :class="[
      'cursor-pointer flex hover:bg-gray-700 hover:text-white duration-200 gap-2 items-center transition-all rounded p-1',
      route.path === item.path ? 'bg-gray-700 text-white' : '',
      openMenuToggle? 'w-[30px] items-center justify-center' : 'w-full',

    ]"
      >
        <i v-if="item.meta" :class="[
            item.meta.icon,
            'duration-200 transition-all',
            openMenuToggle ? 'p-1' : ''
        ]"></i>
        <span
            v-if="!openMenuToggle"
            class="transition-all duration-100"
        >
          {{ item.name }}
        </span>
      </div>
    </div>

  </div>
</template>


<script setup lang="ts">
import {useRouter, useRoute} from "vue-router";
import {computed} from "vue";
import { useStore } from "@/stores";


const themeStore = useStore();


defineProps({
  openMenuToggle: {
    type: Boolean,
    required: true,
  }
})

const router = useRouter();
const route = useRoute();

const menuRoute = router.getRoutes().find(route => route.name === 'Main');

const menuItems = computed(() => {
  if (!menuRoute?.children) return [];
  return menuRoute.children;
})

const routerClick = (link: string) => {
  router.push(link);
}


</script>

<style scoped>

</style>