import MyFile from "../models/_file";

const key = 'PrecioFiles';

export const getAllFiles = (): MyFile[] => {
  const files = localStorage.getItem(key);
  if (files) {
    const parsedFiles = JSON.parse(files) as MyFile[];
    return parsedFiles;
  }
  return [];
}

export const getFileById = (id: number): MyFile | undefined => {
  const files = localStorage.getItem(key);
  if (files) {
    const parsedFiles = JSON.parse(files) as MyFile[];
    const selectedFile = parsedFiles.find(f => f.id === id);
    return selectedFile;
  }
  return undefined;
}

export const saveFile = (file: MyFile): void => {
  const files = localStorage.getItem(key);
  if (files) {
    const parsedFiles = JSON.parse(files) as MyFile[];
    parsedFiles.push(file);
    const fileStringify = JSON.stringify(parsedFiles);
    localStorage.setItem(key, fileStringify);
  }
  else {
    const stringifyFile = JSON.stringify([file]);
    localStorage.setItem(key, stringifyFile);
  }
}