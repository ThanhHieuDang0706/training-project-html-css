type MyFile = {
  id: number;
  fileName: string;
  fileExtension: string;
  modified: number;
  modifiedBy: string;
  isFile: boolean;
}

export type FileUpdate = {
  id: number;
  fileName: string;
  fileExtension: string;
  modified: number;
  modifiedBy: string;
}

export default MyFile;