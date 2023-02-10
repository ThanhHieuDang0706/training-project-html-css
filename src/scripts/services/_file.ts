import MyFile from '../models/_file';
import Folder from '../models/_folder';
import { getAllFolders, getSelectedFolder, overwriteAllFolders } from './_folder';

const key = 'PrecioFiles';

export const getAllFiles = (): MyFile[] => {
  const files = localStorage.getItem(key);
  if (files) {
    const parsedFiles = JSON.parse(files) as MyFile[];
    return parsedFiles;
  }
  return [];
};

export const getFileById = (id: number): MyFile | undefined => {
  const files = localStorage.getItem(key);
  if (files) {
    const parsedFiles = JSON.parse(files) as MyFile[];
    const selectedFile = parsedFiles.find(f => f.id === id);
    return selectedFile;
  }
  return undefined;
};

export const saveFile = (file: MyFile): void => {
  const files = localStorage.getItem(key);
  if (files) {
    const parsedFiles = JSON.parse(files) as MyFile[];
    parsedFiles.push(file);
    const fileStringify = JSON.stringify(parsedFiles);
    localStorage.setItem(key, fileStringify);
  } else {
    const stringifyFile = JSON.stringify([file]);
    localStorage.setItem(key, stringifyFile);
  }
};

export const deleteFileFromFolder = (id: number, folderId: number): void => {
  const files = localStorage.getItem(key);
  if (files) {
    const parsedFiles = JSON.parse(files) as MyFile[];
    const filesAfterDelete = parsedFiles.filter(f => f.id !== id);
    const fileStringify = JSON.stringify(filesAfterDelete);
    localStorage.setItem(key, fileStringify);

    // process that file in folders
    const allFolders = getAllFolders();
    const folderIndex = allFolders.findIndex(f => f.id === folderId);
    const selectedFolder = allFolders[folderIndex];
    const { items } = selectedFolder;
    const fileIndex = items.findIndex(f => f.isFile && f.id === id);
    items.splice(fileIndex, 1);
    selectedFolder.items = items;
    allFolders[folderIndex] = selectedFolder;
    overwriteAllFolders(allFolders);
  }
  return;
};
