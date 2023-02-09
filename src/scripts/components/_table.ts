import $ from 'jquery';
import Folder from '../models/_folder';
import { folderIcon, mapFileExtensionToIcon } from '../utilities/_file';
import MyFile from '../models/_file';
import { parseZone } from 'moment';

const tableHeader = `<thead>
<tr>
  <th scope="col">
    <i class="fa fa-regular fa-file"></i>
  </th>
  <th scope="col">
    Name
    <i class="fa fa-light fa-caret-down"></i>
  </th>
  <th scope="col">
    Modified
    <i class="fa fa-light fa-caret-down"></i>
  </th>
  <th scope="col">
    Modified By
    <i class=" fa fa-light fa-caret-down"></i>
  </th>
  <th scope="col">
    <i class="fa fa-thin fa-plus"></i>
    Add Column
  </th>
</tr>
</thead>`;

const renderTableCell = (item: Folder | MyFile) => `
<tr>
  <td class="table-first-row">
    <div class="table-row-header col-xs-3">
      File Type
    </div>

    <div class="col-xs-9">
      ${item instanceof Folder ? folderIcon : mapFileExtensionToIcon(item.fileExtension)}
    </div>
  </td>

  <td id="f-name" data-id=${item instanceof Folder ? item.id : ''} data-type=${
  item instanceof MyFile ? MyFile : Folder
} >
    <div class="table-row-header col-xs-3">
      Name
    </div>

    <div class="col-xs-9">
      ${item instanceof Folder ? item.folderName : `${item.fileName}.${item.fileExtension}`}
    </div>
  </td>

  <td>
    <div class="table-row-header col-xs-3">
      Modified
    </div>

    <div class="modified-col col-xs-9">
      ${parseZone(item.modified).format('ll')}
    </div>
  </td>

  <td>
    <div class="table-row-header col-xs-3">
      Modified By
    </div>

    <div class="modified-col col-xs-9">
      ${item instanceof Folder ? item.modifiedBy : item.modifiedBy}
    </div>
  </td>
</tr>
`;

const renderTable = (folder: Folder) => {
  // TODO: implement code to render table
  const { items } = folder;

  const table = $('table');

  table.empty();

  if (items.length === 0) return table.append(`<p class="text-center">There is no item in this folder</p>`);
  // add table header
  table.append(tableHeader);

  // add empty table body
  table.append(`<tbody></tbody>`);

  // get table body
  const tableBody = table.find('tbody');

  // add table content to body
  items.forEach(item => {
    tableBody.append(renderTableCell(item));
  });
};

export default renderTable;
