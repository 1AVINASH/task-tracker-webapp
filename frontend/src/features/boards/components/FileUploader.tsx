import { useState } from 'react';
import {uploadFileApi} from '../api/fileUploader'
import { upload } from '@testing-library/user-event/dist/upload';
import useGlobalFileHandlerStore from '../../../store/fileHandler'

const FileUploader = () => {
  const setCurrentFile = useGlobalFileHandlerStore((state)=>state.setCurrentFile)
  const currentFile = useGlobalFileHandlerStore((state)=>state.currentFile)
  const setCurrentFileUrlFromFile = useGlobalFileHandlerStore((state)=>state.setCurrentFileUrlFromFile)
  const isFileUploaderOpen = useGlobalFileHandlerStore((state)=>state.isFileUploaderOpen)
  const setIsFileUploaderOpen = useGlobalFileHandlerStore((state)=>state.setIsFileUploaderOpen)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCurrentFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!currentFile) return;

    const formData = new FormData();
    formData.append('file', currentFile);

    await uploadFileApi(formData)
    setCurrentFileUrlFromFile(currentFile)
    setIsFileUploaderOpen(false)
  };

  if (!isFileUploaderOpen) { return null}

  return (
    <div className="p-4 border rounded shadow max-w-md">
      <input
        type="file"
        onChange={handleChange}
        className="mb-2 block w-full text-sm"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Upload
      </button>
    </div>
  );
};

export default FileUploader;
