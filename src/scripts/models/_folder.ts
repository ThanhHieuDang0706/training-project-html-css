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
import Item, { ItemType } from '../types/_item';

export default class Folder implements IFolder {
  id: number;

  name: string;

  parentFolder: number | null;

  items: Array<Item>;

  modified: number;

  modifiedBy: string;

  itemType: ItemType = ItemType.Folder;

  public static initialFolder = new Folder(0, 'top', [], null, Date.now(), '');

  constructor(id: number, name: string, items: Array<Item>, parentFolder: number | null, modified: number, modifiedBy: string) {
    this.id = id;
    this.name = name;
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
    }
    addTopFolder();
    const newTopLevelFolder = getTopLevelFolder();
    return newTopLevelFolder as Folder;
  };

  static loadAllFolders = (): Folder[] => {
    return getAllFolders();
  };

  static loadSelectedFolder = (id: number): Folder => {
    // load folder with id = id
    const selectedFolder = getSelectedFolder(id) as Folder;
    return selectedFolder;
  };

  static createNewFolder = (name: string, modified: number, modifiedBy: string, parentFolderId: number): Folder => {
    // create new folder with name and parentFolderId
    const largestId = Math.max(...Folder.loadAllFolders().map(folder => folder.id)); // gen new id by adding the largest id to 1
    const newFolder = new Folder(largestId + 1, name, [], parentFolderId, modified, modifiedBy);
    return newFolder;
  };

  static saveFile(file: MyFile, currentFolderId: number): void {
    // save file to currentFolder in local storage
    file.saveFile();
    return saveFileToFolder(file, currentFolderId);
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

  static updateFolder(folderId: number, name: string, modified: number, modifiedBy: string, currentFolderId: number): void {
    updateFolderAndSubFolder(folderId, name, modified, modifiedBy, currentFolderId);
  }

  static deleteFolder = (folderId: number): void => {
    // delete the sub folders and filees and that folder from local storage
    deleteFolderFromLocalStorage(folderId);
  };

  static validateFolderInput = (name: string, modified: number, modifiedBy: string): boolean => {
    if (name.length === 0) {
      return false;
    }
    if (Number.isNaN(modified)) {
      return false;
    }
    if (modifiedBy.length === 0) {
      return false;
    }
    return true;
  };
}
