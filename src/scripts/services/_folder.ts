import MyFile from '../models/_file';
import Folder from '../models/_folder';
import { deleteFileFromFolder } from './_file';

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
  // load folder with by id
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

const deleteFolderFromLocalStorage = (id: number): void => {
  const folders = getAllFolders();
  const folderIndex = folders.findIndex(f => f.id === id);

  if (folderIndex === -1) return;
  const folderToDelete = folders[folderIndex];
  const { items } = folderToDelete;

  // delete all files and folders
  items.forEach(item => {
    if (item.isFile) {
      deleteFileFromFolder(item.id, id);
    } else {
      deleteFolderFromLocalStorage(item.id);
    }
  });

  const foldersAfterDelete = getAllFolders();
  foldersAfterDelete.splice(folderIndex, 1);  
  const parentIndex = foldersAfterDelete.findIndex(f => f.id === folderToDelete.parentFolder);
  const parentFolder = foldersAfterDelete[parentIndex];
  parentFolder.items = parentFolder.items.filter(f => f.isFile || (!f.isFile && f.id !== folderToDelete.id));
  overwriteAllFolders(foldersAfterDelete);
  
};

const updateFolderAndSubFolder = (folderId: number, folderName: string, modified: number, modifiedBy: string, currentFolderId: number) => {
  // update folder list
  const allFolders = Folder.loadAllFolders();
  const index = allFolders.findIndex(folder => folder.id === folderId);
  allFolders[index].folderName = folderName;
  allFolders[index].modified = modified;
  allFolders[index].modifiedBy = modifiedBy;

  // update current folder
  const currentFolderIndex = allFolders.findIndex(folder => folder.id === currentFolderId);
  const subFolderIndex = allFolders[currentFolderIndex].items.findIndex(folder => !folder.isFile && folder.id === folderId);

  const subFolder = allFolders[currentFolderIndex].items[subFolderIndex] as Folder;
  subFolder.folderName = folderName;
  subFolder.modified = modified;
  subFolder.modifiedBy = modifiedBy;

  overwriteAllFolders(allFolders);
}

export {
  getTopLevelFolder,
  addTopFolder,
  getSelectedFolder,
  getAllFolders,
  saveFileToFolder,
  overwriteAllFolders,
  deleteFolderFromLocalStorage,
  updateFolderAndSubFolder
};
