import { parseFileExtension } from './../utilities/_file';
import ready, { clearInput } from '../utilities/_helper';
import renderTable from '../components/_table';
import Folder from '../models/_folder';
import $ from 'jquery';
import MyFile from '../models/_file';
import renderModalForm from '../components/_modal';
import { FileUpdate } from '../types/_file';

ready(() => {
  // init data, call this to make sure that there is data in local storage
  Folder.loadTopFolder();

  // state
  const state = {
    currentFolderId: 0,
  };

  // render intial view
  renderModalForm();
  renderTable(state);

  // ------------------ Event Listeners --------------------

  // clicking new file button
  $('#newFileButton').on('click', () => {
    clearInput();
    $("label[for='name']").text('File name');
    $('#modal-title').text('Create new file');
    $('#modal-ok-button').text('Create');
    $('#modal-ok-button').attr('data-action', 'create');
  });

  // clicking new folder button
  $('#newFolderButton').on('click', () => {
    clearInput();
    $("label[for='name']").text('Folder name');
    $('#modal-title').text('Create new folder');
    $('#modal-ok-button').text('Create');
    $('#modal-ok-button').attr('data-action', 'create');
  });

  // when clicking ok button in modal form
  $('#modal-ok-button').on('click', () => {
    const action = $('#modal-ok-button').attr('data-action');
    if (action === 'create') {
      // folder or file
      const type = $('#modal-title')
        .text()
        .includes('folder')
        ? 'folder'
        : 'file';

      // create new file
      if (type === 'file') {
        // validate input
        const fileNameWithExtension = $('#name').val() as string;
        const modified = Date.parse($('#modified').val() as string);
        const modifiedBy = $('#modifiedBy').val() as string;

        // check input, not valid then do nothing
        if (!MyFile.validateFileInput(fileNameWithExtension, modified, modifiedBy)) {
          return;
        }

        const fileExtension = parseFileExtension(fileNameWithExtension);
        const fileName = fileNameWithExtension.replace(`.${fileExtension}`, '');

        // create new file
        const newFile = MyFile.createNewFile(fileName, fileExtension, modified, modifiedBy);
        // save file to current folder
        Folder.saveFile(newFile, state.currentFolderId);

        // rerender table
        renderTable(state);

        // close modal form and clear input
        $('#modal-cancel-button').click();
        clearInput();
      } else {
        // create folder and assign parent folder (parent folder will be the current folder)
        const folderName = $('#name').val() as string;
        const modified = Date.parse($('#modified').val() as string);
        const modifiedBy = $('#modifiedBy').val() as string;

        if (!Folder.validateFolderInput(folderName, modified, modifiedBy)) {
          return;
        }

        const newFolder = Folder.createNewFolder(folderName, modified, modifiedBy, state.currentFolderId);
        newFolder.save(state.currentFolderId);

        renderTable(state);
        // close modal form and clear input
        $('#modal-cancel-button').click();
        clearInput();
      }
    }

    if (action === 'edit') {
      const type = $('#modal-title')
        .text()
        .includes('folder')
        ? 'folder'
        : 'file';

      // get by using attr is fine =)) but not data =((
      const id = parseInt($('#modal-title').attr('data-id') as string);
      
      if (type === 'file') {
        const fileNameWithExtension = $('#name').val() as string;
        const modified = Date.parse($('#modified').val() as string);
        const modifiedBy = $('#modifiedBy').val() as string;

        // check input, not valid then do nothing
        if (!MyFile.validateFileInput(fileNameWithExtension, modified, modifiedBy)) {
          return;
        }

        const fileExtension = parseFileExtension(fileNameWithExtension);
        const fileName = fileNameWithExtension.replace(`.${fileExtension}`, '');

        const changes: FileUpdate = {
          id,
          fileExtension,
          fileName,
          modified,
          modifiedBy,
        };

        MyFile.updateFile(id, changes, state.currentFolderId);
        renderTable(state);
        $('#modal-cancel-button').click();
        clearInput();

      } else if (type === 'folder') {
      }
    }
  });

  $('#back-button').on('click', () => {
    const parentFolderId = Folder.loadSelectedFolder(state.currentFolderId).parentFolder as number;
    state.currentFolderId = parentFolderId;
    renderTable(state);
  });
});
