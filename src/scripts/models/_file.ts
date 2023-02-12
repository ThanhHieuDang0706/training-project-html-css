import { isValidFileName } from '../utilities/_file';
import IFile, { FileUpdate } from '../types/_file';
import { getAllFiles, saveFile, deleteFileFromFolder, saveFiles, saveUpdatedFileToFolder } from '../services/_file';
import { ItemType } from '../types/_item';

export default class MyFile implements IFile {
  id: number;

  name: string;

  fileExtension: string;

  modified: number;

  modifiedBy: string;

  itemType: ItemType = ItemType.File;

  constructor(id: number, name: string, fileExtension: string, modified: number, modifiedBy: string) {
    this.id = id;
    this.name = name;
    this.fileExtension = fileExtension;
    this.modified = modified;
    this.modifiedBy = modifiedBy;
  }

  static loadAllFiles = (): MyFile[] => {
    return getAllFiles();
  };

  static createNewFile = (name: string, fileExtension: string, modified: number, modifiedBy: string) => {
    const maxFileId = Math.max(0, ...MyFile.loadAllFiles().map((file: MyFile) => file.id)); // simulate auto increment id by adding the largest id to 1
    const newFile = new MyFile(maxFileId + 1, name, fileExtension, modified, modifiedBy);
    return newFile;
  };

  static validateFileInput = (nameWithExtension: string, modified: number): boolean => {
    if (!isValidFileName(nameWithExtension)) {
      return false;
    }
    if (modified === 0 || Number.isNaN(modified)) {
      return false;
    }
    return true;
  };

  static getFileById = (id: number): MyFile => {
    return MyFile.loadAllFiles().find((file: MyFile) => file.id === id) as MyFile;
  };

  static deleteFile = (id: number, folderId: number) => {
    deleteFileFromFolder(id, folderId);
  };

  static updateFile = (id: number, changes: FileUpdate, folderId: number) => {
    // save the file to file list
    const allFiles = getAllFiles();
    const fileIndex = allFiles.findIndex((file: MyFile) => file.id === id);
    const newFile = new MyFile(id, changes.name, changes.fileExtension, changes.modified, changes.modifiedBy);
    allFiles[fileIndex] = newFile;
    saveFiles(allFiles);

    // update the file in the folder
    saveUpdatedFileToFolder(newFile, folderId);
  };

  saveFile = (): void => {
    return saveFile(this);
  };
}
