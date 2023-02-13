import Item from './_item';

export default interface Folder extends Item {
  parentFolder: number | null;
  items: Array<Item>;
}
