import { defineStore} from "pinia";
import {ref, watch} from 'vue';
import {IForm} from "@/models/ProjectModels";

export const useStore = defineStore("item", () => {
    const loading = ref(false);
    const form = ref<IForm[]>([]);
    const page = ref([]);

    const theme = ref<'light' | 'dark'>('dark')

    const setTheme = (value: "light" | "dark") => {
        theme.value = value;
        localStorage.setItem("theme", value);
        if(value == "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }

    const loadTheme = () => {
        const savedTheme = localStorage.getItem("theme") as 'light' | 'dark' | null;
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            setTheme(theme.value);
        }
    }

    watch(theme, (value) => {
        localStorage.setItem("theme", value);
    });

    loadTheme();

    return {
        theme,
        setTheme,
        loading,
        form,
        page
    };
});
