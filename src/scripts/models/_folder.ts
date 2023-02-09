import IFolder from '../interface/_folder';
import { addTopFolder, getTopLevelFolder, getSelectedFolder, getAllFolders, saveFileToFolder } from '../services/_folder';
import MyFile from './_file';

export default class Folder implements IFolder { 
  id: number;
  folderName: string;
  parentFolder: number | null;
  items: Array<MyFile | Folder>;
  modified: number;
  modifiedBy: string;

  public static initialFolder = new Folder(0, "top", [], null, Date.now(), "");

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
    }
    else {
      addTopFolder();
      const topLevelFolder = getTopLevelFolder();
      return topLevelFolder as Folder;
    }
  }

  static loadAllFolders = (): Folder[] => {
    return getAllFolders();
  }

  static loadSelectedFolder = (id: number): Folder => {
    // load folder with id = id
    const selectedFolder = getSelectedFolder(id) as Folder;
    return selectedFolder;
  }

  static saveFile (file: MyFile, currentFolderId: number): void {
    // save file to currentFolder in local storage
    return saveFileToFolder(file, currentFolderId);
  }

  static addNewFile (newFile: MyFile, currentFolderId: number): void {
    // add new file to currentFolder in local storage
  }

  static addNewFolder = (folderName: string, parentFolderId: number): void => {
    // add new folder to local storage
  }

  static deleteFolder = (folderId: number): void => {
    // delete the sub folders and that folder from local storage
  }



}