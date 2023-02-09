import MyFile from '../models/_file';

type Folder = {
  id: number;
  folderName: string;
  parentFolder: number | null;
  items: Array<MyFile | Folder>;
  modified: number;
  modifiedBy: string;
};
export default Folder;
