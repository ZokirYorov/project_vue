import axios from "axios";
import router from "@/router";
// import {useLocalStorage} from "@/composables/useLocalStorage";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
})
// const local = useLocalStorage()

// axiosInstance.interceptors.request.use((config) => {
    // const token = local.getItem("token");
    // if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    // }
    // return config;
// })

// axiosInstance.interceptors.response.use(
//     response => response,
//     error => {
//         if (error.response && (error.response.status === 403 || error.response.status === 401)) {
            // local.removeItem("token");
            // router.push({name: "Login"}).then(r => r);
        // }
        // return Promise.reject(error);
    // }
// );

export default axiosInstance;
