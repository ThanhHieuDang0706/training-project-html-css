import Item from './_item';

export default interface MyFile extends Item {
  fileExtension: string;
}

export type FileUpdate = {
  id: number;
  name: string;
  fileExtension: string;
  modified: number;
  modifiedBy: string;
};
