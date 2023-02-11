import { isValidFileName } from '../utilities/_file';
import IFile, { FileUpdate } from '../types/_file';
import { getAllFiles, saveFile, deleteFileFromFolder, saveFiles, saveUpdatedFileToFolder } from '../services/_file';

export default class MyFile implements IFile {
  id: number;

  fileName: string;

  fileExtension: string;

  modified: number;

  modifiedBy: string;

  isFile = true;

  constructor(id: number, fileName: string, fileExtension: string, modified: number, modifiedBy: string) {
    this.id = id;
    this.fileName = fileName;
    this.fileExtension = fileExtension;
    this.modified = modified;
    this.modifiedBy = modifiedBy;
  }

  static loadAllFiles = (): MyFile[] => {
    return getAllFiles();
  };

  static createNewFile = (fileName: string, fileExtension: string, modified: number, modifiedBy: string) => {
    const maxFileId = Math.max(0, ...MyFile.loadAllFiles().map((file: MyFile) => file.id)); // simulate auto increment id by adding the largest id to 1
    const newFile = new MyFile(maxFileId + 1, fileName, fileExtension, modified, modifiedBy);
    return newFile;
  };

  static validateFileInput = (fileNameWithExtension: string, modified: number): boolean => {
    if (!isValidFileName(fileNameWithExtension)) {
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
    const newFile = new MyFile(id, changes.fileName, changes.fileExtension, changes.modified, changes.modifiedBy);
    allFiles[fileIndex] = newFile;
    saveFiles(allFiles);

    // update the file in the folder
    saveUpdatedFileToFolder(newFile, folderId);
  };

  saveFile = (): void => {
    return saveFile(this);
  };
}
