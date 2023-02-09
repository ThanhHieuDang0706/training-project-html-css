import MyFile from "../models/_file";

export default interface Folder {
  id: number;
  folderName: string;
  parentFolder: number | null;
  items: Array<MyFile | Folder>;
  modified: number;
  modifiedBy: string;
}