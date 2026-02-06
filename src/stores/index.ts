import { defineStore} from "pinia";
import {ref, watch} from 'vue';
import {Comments, IForm} from "@/models/ProjectModels";
import axios from "axios";
import type { ApiItems } from "@/models/ProjectModels";

export const useStore = defineStore("items", () => {
    const loading = ref(false);
    const form = ref<IForm[]>([]);
    const page = ref([]);

    const state = ref({
        items: [] as ApiItems[],
        comment: [] as Comments[]
    })

    const loadGetApi = async () => {
        loading.value = true;

        try {
            const response = await axios.get("http://localhost:3000/posts")
            state.value.items = response.data;
            loading.value = false;
        }
        catch (error) {
            console.log(error);
        }
    }

    const loadGetPosts = async () => {
        try {
            const response = await axios.get("http://localhost:3000/comments");
            state.value.comment = response.data;
        }
        catch (error) {
            console.log(error);
        }
    }
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
        state,
        theme,
        setTheme,
        loading,
        loadGetApi,
        loadGetPosts,
        form,
        page
    };
});
