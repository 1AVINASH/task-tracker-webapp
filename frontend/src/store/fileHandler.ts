import { create } from 'zustand';

type GlobalFileHandlerStore = {
  objectUrls: string[];
  setObjectUrls: (objectUrls: string[]) => void;
  currentFile: File | undefined;
  setCurrentFile: (currentFile: File) => void;
  currentFileUrl: string | undefined;
  setCurrentFileUrl: (currentFileUrl: string) => void;
  setCurrentFileUrlFromFile: (currentFileUrl: File) => void;
  isFileUploaderOpen: boolean;
  setIsFileUploaderOpen: (isFileUploaderOpen: boolean) => void;
};

const useGlobalFileHandlerStore = create<GlobalFileHandlerStore>((set) => ({
  objectUrls: [],
  setObjectUrls: (objectUrls: string[]) => set(()=>({ objectUrls })),
  currentFile: undefined,
  setCurrentFile: (currentFile: File) => set(()=>({ currentFile })),
  currentFileUrl: "",
  setCurrentFileUrl: (currentFileUrl: string) => set(()=>({ currentFileUrl })),
  setCurrentFileUrlFromFile: (currentFile: File) => set(()=>({ currentFileUrl: URL.createObjectURL(currentFile) })),
  isFileUploaderOpen: false,
  setIsFileUploaderOpen: (isFileUploaderOpen: boolean) => set(()=>({ isFileUploaderOpen }))
}));

export default useGlobalFileHandlerStore;