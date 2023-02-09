import MyFile from '../models/_file';
import Folder from '../models/_folder';

const key = 'PrecioFolders';

const getTopLevelFolder = (): Folder | undefined | null => {
  const folders = localStorage.getItem(key);
  if (folders) {
    const parsedFolders = JSON.parse(folders) as Folder[];
    const topLevelFolder = parsedFolders.find(f => f.parentFolder === null);
    return topLevelFolder;
  } else return null;
};

const addTopFolder = (): void => {
  const folderStringify = JSON.stringify([Folder.initialFolder]);
  return localStorage.setItem(key, folderStringify);
};

const getSelectedFolder = (id: number): Folder | undefined => {
  // load folder with id = id
  const folders = localStorage.getItem(key);
  if (folders) {
    const parsedFolders = JSON.parse(folders) as Folder[];
    const selectedFolder = parsedFolders.find(f => f.id === id);
    return selectedFolder;
  }
  return undefined;
};

const getAllFolders = (): Folder[] => {
  const folders = localStorage.getItem(key);
  if (folders) {
    const parsedFolders = JSON.parse(folders) as Folder[];
    return parsedFolders;
  }
  return [];
};

const saveFileToFolder = (file: MyFile, currentFolderId: number): void => {
  // save file to currentFolder in local storage
  const folders = localStorage.getItem(key);
  if (folders) {
    const parsedFolders = JSON.parse(folders) as Folder[];
    const selectedFolder = parsedFolders.find(f => f.id === currentFolderId);
    if (selectedFolder) {
      // add file to selected folder
      selectedFolder.items.push(file);

      // edit in parsed folder
      const folderIndex = parsedFolders.findIndex(f => f.id === currentFolderId);
      parsedFolders[folderIndex] = selectedFolder;

      // save back to local storage
      const folderStringify = JSON.stringify(parsedFolders);
      return localStorage.setItem(key, folderStringify);
    }
  }
};

const overwriteAllFolders = (allFolders: Folder[]): void => {
  const folderStringify = JSON.stringify(allFolders);
  return localStorage.setItem(key, folderStringify);
};

export { getTopLevelFolder, addTopFolder, getSelectedFolder, getAllFolders, saveFileToFolder, overwriteAllFolders };
