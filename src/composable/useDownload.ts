import axiosInstance from "@/api/axios"

export const useDownload = async (url: string) => {
    try {
        const response = await axiosInstance.get(url, {
            responseType: 'blob',
        });

        const disposition = response.headers['content-disposition'];

        let filename = "download.xlsx";
        if (disposition && disposition.includes("filename=")) {
            filename = disposition
                .split("filename=")[1]
                .replace(/["']/g, "")
                .trim();
        }

        const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = urlBlob;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
        console.error('Faylni yuklab olishda xatolik:', error);
    }
}