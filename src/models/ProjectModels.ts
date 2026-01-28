export interface IForm {
    id?: number | null;
    image?: File | null;
    name: string;
    number: number | string;
    data: string;
}

export interface TaskFile {
    name: string;
    url: string;
    size: number;
    type: string;
}

export interface ApiItems {
    id: string,
    lastName: string,
    firstName: string,
    date: Date,
    title: string,
    status: string,
    files: TaskFile[],
}