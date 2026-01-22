<template>
  <Teleport to="body">
    <div
        :class="[wrapperClass, { '!opacity-100 !visible': show }]"
        data-modal="wrapper"
        class="items-center p-3 fixed w-full h-full bg-[#060a2d99] flex justify-center z-50 top-0 left-0 invisible opacity-0 transition-all duration-300"
        @mousedown="handleOuterClick($event)"
    >
      <Transition name="modal" mode="out-in">
        <div
            v-if="show"
            class="w-full flex justify-center"
            :class="customClass ? customClass : 'lg:max-w-md'"
        >
          <div
              class="bg-gray-200 min-w-[400px] shadow-xl relative pt-2 max-h-[90vh] my-4 rounded-xl"
              :class="[
                  themeStore.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700',
              bodyClass,
              { animated: animationIn },
              { 'overflow-y-auto': !isFlow },
            ]"
          >
            <div
                v-if="!noHeader"
                class="flex items-center px-6 pb-6 pt-4  rounded-t-xl"
                :class="[headerStyle, themeStore.theme === 'dark' ? 'text-white' : '']"
            >
              <slot name="header">
                <h3
                    class="w-full text-xl text-dark font-semibold"
                    :class="titleStyle"
                >
                  {{ title }}
                </h3>
                <button
                    class="w-7 h-7 border cursor-pointer border-field-stroke-secondary flex items-center justify-center absolute top-4 right-5 rounded-full shrink-0 flex-center transition-300 group active:scale-95 z-40"
                    :class="closeIconClass"
                    @click="$emit('close')"
                >
                  <Icon
                      :class="themeStore.theme === 'dark' ? 'text-white' : 'text-black'"
                      class="group-hover:text-icon-brand-secondary"
                      icon-name="close"
                  />
                </button>
              </slot>
            </div>
            <button
                v-if="noHeader && hasCloseIcon"
                class="w-8 h-8 border border-field-stroke-secondary cursor-pointer flex items-center justify-center absolute top-3 right-4 rounded-full shrink-0 flex-center transition-300 group active:scale-95 z-40"
                :class="closeIconClass"
                @click="$emit('close')"
            >
              <Icon
                  class="text-black group-hover:text-icon-brand-secondary"
                  icon-name="close"
              />
            </button>
            <slot />
            <slot name="footer" />
          </div>
          <slot name="afterBody" />
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import Icon from "@/components/Icon.vue";
import { useStore } from "@/stores";

const themeStore = useStore();

interface Props {
  show?: boolean;
  isFlow?: boolean;
  title?: string;
  wrapperClass?: string | string[];
  modalClass?: string | string[];
  noHeader?: boolean;
  disableOuterClose?: boolean;
  bodyClass?: string | string[];
  hasCloseIcon?: boolean;
  titleStyle?: string;
  headerStyle?: string;
  customClass?: string;
  closeIconClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  titleStyle: "",
  headerStyle: "",
  wrapperClass: "",
  bodyClass: "",
  modalClass: "",
});

interface Emits {
  (e: "close"): void;

  (e: "outer-click"): void;
}

const emit = defineEmits<Emits>();
const animationIn = ref(false);

function handleOuterClick(e: Event) {
  const target = e.target as HTMLElement;
  if (target.dataset?.modal == "wrapper") {
    emit("outer-click");
    if (!props.disableOuterClose) {
      emit("close");
    } else {
      animationIn.value = true;
      setTimeout(() => {
        animationIn.value = false;
      }, 500);
    }
  }
}

watch(
    () => props.show,
    (val) => {
      if (val) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }
);
onMounted(() => {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !props.disableOuterClose) {
      emit("close");
    }
  });
});
</script>

<style scoped>
@keyframes modal {
  from {
    opacity: 0;
    transform: translateY(-40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-enter-active {
  animation: modal 0.3s ease-in-out;
}

.modal-leave-active {
  animation: modal 0.3s ease-in-out reverse;
}

@keyframes mobile-modal {
  from {
    opacity: 0;
    transform: translateY(50%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mobile-modal-enter-active {
  animation: mobile-modal 0.5s ease-in-out;
}

.mobile-modal-leave-active {
  animation: mobile-modal 0.5s ease-in-out reverse;
}

.animated {
  animation: horizontal-shaking 0.4s ease-in-out;
}
</style>
