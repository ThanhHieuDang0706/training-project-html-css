import $ from 'jquery';
import { parseZone } from 'moment';
import Folder from '../models/_folder';
import { folderIcon, isFile, mapFileExtensionToIcon } from '../utilities/_file';
import MyFile from '../models/_file';
import { fillInput } from './_modal';
import renderSpinner, { removeSpinner } from './_loading';
import { State } from '../interfaces/_homepage';
import Item from '../interfaces/_item';

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

const renderTableCell = (item: Item) => `
<tr>

  <td class="table-first-row">
    <div class="table-row-header col-xs-3">
      File Type
    </div>

    <div class="col-xs-9">
      ${!isFile(item) ? folderIcon : mapFileExtensionToIcon((<MyFile>item).fileExtension)}
    </div>
  </td>

  <td class="f-name" data-id="${!isFile(item) ? item.id : ''}" data-type="${isFile(item) ? 'file' : 'folder'}" >
    <div class="table-row-header col-xs-3">
      Name
    </div>

    <div class="col-xs-9">
      ${!isFile(item) ? item.name : `${(<MyFile>item).name}.${(<MyFile>item).fileExtension}`}
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
      ${!isFile(item) ? item.modifiedBy : item.modifiedBy}
    </div>
  </td>

  <td>
     <div class="table-row-header col-xs-3">
      Actions
    </div>

    <div class="modified-col col-xs-9">
      <div class="btn-group" role="group" aria-label="btn actions">
        <button data-toggle="modal" data-target="#modal-form" data-action="edit" data-id="${item.id}" data-type="${
  isFile(item) ? 'file' : 'folder'
}" type="button" class="btn btn-sm btn-primary">
          <i class="fa fa-pencil"></i>
        </button>
        <button data-action="delete" data-id="${item.id}" data-type="${isFile(item) ? 'file' : 'folder'}" type="button" class="btn btn-sm btn-danger">
          <i class="fa fa-trash"></i>
        </button>
      </div>
    </div>
  </td>
</tr>
`;

const renderTable = async (state: State) => {
  if (state.currentFolderId === 0) {
    $('#back-button').hide();
  } else {
    $('#back-button').show();
  }

  const folder = Folder.loadSelectedFolder(state.currentFolderId);
  const { items } = folder;
  const table = $('table');

  // add loading animation
  renderSpinner();

  setTimeout(() => {
    table.empty();
    removeSpinner();
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
    tableBody.find('td.f-name').each((_, element) => {
      const td = $(element);
      const type = td.data('type');
      if (type === 'folder') {
        td.addClass('folder');
      }
    });

    // add event listeners when clikcing folder => change current folder
    $('.f-name').each((_, element) => {
      const td = $(element);
      const type = td.data('type');

      if (type === 'folder') {
        td.on('click', () => {
          const folderId = parseInt(td.data('id'), 10);
          state.setCurrentFolderId(folderId);
          return renderTable(state);
        });
      }
    });

    // add event listeners when clicking edit button
    $('button[data-action="edit"]').each((_, element) => {
      const id = parseInt($(element).data('id'), 10);
      const type = $(element).data('type');

      $(element).on('click', () => {
        if (type === 'file') {
          $("label[for='name']").text('file name');
          $('#modal-title').text('Edit file');
          $('#modal-ok-button').text('Save');
          $('#modal-ok-button').attr('data-action', 'edit');
          const file = MyFile.getFileById(id);

          fillInput(file, id);
        } else if (type === 'folder') {
          $("label[for='name']").text('folder name');
          $('#modal-title').text('Edit folder');
          $('#modal-ok-button').text('Save');
          $('#modal-ok-button').attr('data-action', 'edit');
          const currentFolder = Folder.loadSelectedFolder(id);
          fillInput(currentFolder, id);
        }
      });
    });

    // add event listeners when clicking delete button
    $('button[data-action="delete"]').each((_, element) => {
      const id = parseInt($(element).data('id'), 10);
      const type = $(element).data('type');
      $(element).on('click', () => {
        if (type === 'file') {
          MyFile.deleteFile(id, state.currentFolderId);
          return renderTable(state);
        }
        if (type === 'folder') {
          Folder.deleteFolder(id);
          return renderTable(state);
        }
      });
    });
  }, Math.random() * 1000);
};

export default renderTable;
