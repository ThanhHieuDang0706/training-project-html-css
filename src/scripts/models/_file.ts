import { isValidFileName } from './../utilities/_file';
import IFile from '../interface/_file';

export default class MyFile implements IFile {
  fileName: string;
  fileExtension: string;
  modified: number;
  modifiedBy: string;

  constructor(fileName: string, fileExtension: string, modified: number, modifiedBy: string) {
    this.fileName = fileName;
    this.fileExtension = fileExtension;
    this.modified = modified;
    this.modifiedBy = modifiedBy;
  }

  static validateFileInput = (fileNameWithExtension: string, modified: number, modifiedBy: string): boolean => {
    // validate file input
    if (!isValidFileName(fileNameWithExtension)) {
      return false;
    } else if (modified === 0 || isNaN(modified)) {
      return false;
    }
    return true;
  };
}
