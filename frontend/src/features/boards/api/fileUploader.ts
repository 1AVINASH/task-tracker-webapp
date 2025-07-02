type UploadFilePathData = {
    file_path: string
}

type UploadFileRes = {
    data: UploadFilePathData
    message: string
}

const BASE_URL = 'http://localhost:8000/api';

export const uploadFileApi = async (formData: FormData) => {
    const res = await fetch(`${BASE_URL}/files`, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) throw new Error("Failed to update board");
    const json: UploadFileRes = await res.json();
    
    return json.data.file_path;
}

export const getFileApi = async (fileUrl: string) => {
    const res = await fetch(`${BASE_URL}/files/${fileUrl}`, {
        method: 'GET',
    });

    if (!res.ok) throw new Error("Failed to update board");
    const blob: Blob = await res.blob();
    
    return blob;
}