export default interface Item {
  id: number;
  name: string;
  modified: number;
  modifiedBy: string;
  itemType: ItemType;
}

export enum ItemType {
  File = 'file',
  Folder = 'folder',
}
