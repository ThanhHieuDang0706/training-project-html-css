import IFolder from '../types/_folder';
import {
  addTopFolder,
  getTopLevelFolder,
  getSelectedFolder,
  getAllFolders,
  saveFileToFolder,
  overwriteAllFolders,
  deleteFolderFromLocalStorage,
  updateFolderAndSubFolder,
} from '../services/_folder';
import MyFile from './_file';

export default class Folder implements IFolder {
  id: number;
  folderName: string;
  parentFolder: number | null;
  items: Array<MyFile | Folder>;
  modified: number;
  modifiedBy: string;
  isFile: boolean = false;

  public static initialFolder = new Folder(0, 'top', [], null, Date.now(), '');

  constructor(id: number, folderName: string, items: Array<MyFile | Folder>, parentFolder: number | null, modified: number, modifiedBy: string) {
    this.id = id;
    this.folderName = folderName;
    this.items = items;
    this.parentFolder = parentFolder;
    this.modified = modified;
    this.modifiedBy = modifiedBy;
  }

  static loadTopFolder = (): Folder => {
    // load folder with parentFolder = null, if not existed in local storage then create and return it
    const topLevelFolder = getTopLevelFolder();
    if (topLevelFolder) {
      return topLevelFolder as Folder;
    } else {
      addTopFolder();
      const topLevelFolder = getTopLevelFolder();
      return topLevelFolder as Folder;
    }
  };

  static loadAllFolders = (): Folder[] => {
    return getAllFolders();
  };

  static loadSelectedFolder = (id: number): Folder => {
    // load folder with id = id
    const selectedFolder = getSelectedFolder(id) as Folder;
    return selectedFolder;
  };

  static createNewFolder = (folderName: string, modified: number, modifiedBy: string, parentFolderId: number): Folder => {
    // create new folder with folderName and parentFolderId
    const largestId = Math.max(...Folder.loadAllFolders().map(folder => folder.id)); // gen new id by adding the largest id to 1
    const newFolder = new Folder(largestId + 1, folderName, [], parentFolderId, modified, modifiedBy);
    return newFolder;
  };

  static saveFile(file: MyFile, currentFolderId: number): void {
    // save file to currentFolder in local storage
    file.saveFile();
    return saveFileToFolder(file, currentFolderId);
  }

  static addNewFile(newFile: MyFile, currentFolderId: number): void {
    // add new file to currentFolder in local storage
  }

  save = (currentFolderId: number): void => {
    // save this folder to local storage
    const allFolders = Folder.loadAllFolders();
    const currentFolderIndex = allFolders.findIndex(folder => folder.id === currentFolderId);
    const index = allFolders.findIndex(folder => folder.id === this.id);

    if (index === -1) {
      // create
      allFolders.push(this);
      allFolders[currentFolderIndex].items.push(this);
      overwriteAllFolders(allFolders);
    } else {
      // update
      allFolders[index] = this;

      const subFolderIndex = allFolders[currentFolderIndex].items.findIndex(folder => folder instanceof Folder && folder.id === this.id);

      if (subFolderIndex !== -1) {
        allFolders[currentFolderIndex].items[subFolderIndex] = this;
      } else {
        allFolders[currentFolderIndex].items.push(this);
      }

      overwriteAllFolders(allFolders);
    }
  };

  static updateFolder(folderId: number, folderName: string, modified: number, modifiedBy: string, currentFolderId: number): void {
    updateFolderAndSubFolder(folderId, folderName, modified, modifiedBy, currentFolderId);
  }

  static deleteFolder = (folderId: number): void => {
    // delete the sub folders and filees and that folder from local storage
    deleteFolderFromLocalStorage(folderId);
  };

  static validateFolderInput = (folderName: string, modified: number, modifiedBy: string): boolean => {
    if (folderName.length === 0) {
      return false;
    } else if (isNaN(modified)) {
      return false;
    } else if (modifiedBy.length === 0) {
      return false;
    }
    return true;
  };
}
