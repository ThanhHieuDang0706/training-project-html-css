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
    Actions
    <i class="fa fa-light fa-caret-down"></i>
  </th>
  <th scope="col">
    <i class="fa fa-thin fa-plus"></i>
    Add Column
  </th>
</tr>
</thead>`;

const renderTableCell = (item: any) => `
<tr>

  <td class="table-first-row">
    <div class="table-row-header col-xs-3">
      File Type
    </div>

    <div class="col-xs-9">
      ${!item.isFile ? folderIcon : mapFileExtensionToIcon(item.fileExtension)}
    </div>
  </td>

  <td class="f-name" data-id="${!item.isFile ? item.id : ''}" data-type="${item.isFile ? 'file' : 'folder'}" >
    <div class="table-row-header col-xs-3">
      Name
    </div>

    <div class="col-xs-9">
      ${!item.isFile ? item.folderName : `${item.fileName}.${item.fileExtension}`}
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
      ${!item.isFile ? item.modifiedBy : item.modifiedBy}
    </div>
  </td>

  <td>
     <div class="table-row-header col-xs-3">
      Actions
    </div>

    <div class="modified-col col-xs-9">
      <div class="btn-group" role="group" aria-label="btn actions">
        <button data-action="edit" data-id="${item.id}" data-type="${item.isFile ? 'file' : 'folder'}" type="button" class="btn btn-sm btn-primary">
          <i class="fa fa-pencil"></i>
        </button>
        <button data-action="delete" data-id="${item.id}" data-type="${item.isFile ? 'file' : 'folder'}" type="button" class="btn btn-sm btn-danger">
          <i class="fa fa-trash"></i>
        </button>
      </div>
    </div>
  </td>
</tr>
`;

const renderTable = (state: { currentFolderId: number }) => {
  // TODO: implement code to render table
  const folder = Folder.loadSelectedFolder(state.currentFolderId);
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

  // update style for folder to be clickable and add event listeners
  tableBody.find('td.f-name').each((index, element) => {
    const td = $(element);
    const type = td.data('type');
    if (type === 'folder') {
      td.addClass('folder');
    }
  });

  if (state.currentFolderId !== 0) {
    $('#back-button').removeClass('invisible');
  } else {
    $('#back-button').addClass('invisible');
  }

  // add event listeners when clikcing folder => change current folder
  $('.f-name').each((_, element) => {
    const td = $(element);
    const type = td.data('type');

    if (type === 'folder') {
      td.on('click', () => {
        const folderId = td.data('id');
        state.currentFolderId = folderId;
        renderTable(state);
      });
    }
  });

  // add event listeners when clicking edit button
  $('button[data-action="edit"]').each((_, element) => {
    const id = parseInt($(element).data('id'));
    const type = $(element).data('type');

    element.onclick = () => {
      if (type === 'file') {
        renderTable(state);
      }
      else if (type === 'folder') {

      }
    }
  });

  // add event listeners when clicking delete button
  $('button[data-action="delete"]').each((_, element) => {
    const id = parseInt($(element).data('id'));
    const type = $(element).data('type');
    element.onclick = () => {
      if (type === 'file') {
        MyFile.deleteFile(id, state.currentFolderId);
        renderTable(state);
      }
      else if (type === 'folder') {
        Folder.deleteFolder(id);
        renderTable(state);
      }
    }
  });
};

export default renderTable;
