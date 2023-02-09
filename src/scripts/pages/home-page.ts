import { parseFileExtension } from './../utilities/_file';
import ready, { clearInput } from '../utilities/_helper';
import renderTable from '../components/_table';
import Folder from '../models/_folder';
import $ from 'jquery';
import MyFile from '../models/_file';
import renderModalForm from '../components/_modal';

ready(() => {
  // init data
  const folder = Folder.loadTopFolder();
  
  const state = {
    currentFolderId: 0,
  };
  // render view
  renderModalForm();
  renderTable(state);

  
  // ------------------ Event Listeners --------------------

  // clicking new file button
  $('#newFileButton').on('click', () => {
    $("label[for='name']").text('File name');
    $('#modal-title').text('Create new file');
    $('#modal-ok-button').text('Create');
    $('#modal-ok-button').attr('data-action', 'create');
  });

  // clicking new folder button
  $('#newFolderButton').on('click', () => {
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
      const type = $('#modal-title').text().includes('folder') ? 'folder' : 'file';
      
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
        const newFile = new MyFile(fileName, fileExtension, modified, modifiedBy);
        // save file to current folder
        Folder.saveFile(newFile, state.currentFolderId);

        // rerender table
        const currentFolder = Folder.loadSelectedFolder(state.currentFolderId);
        renderTable(state);

        // close modal form and clear input
        $('#modal-cancel-button').click();
        clearInput();
      }
      else {
        // create folder and assign parent folder (parent folder will be the current folder)
        const folderName = $('#name').val() as string;
        const modified = Date.parse($('#modified').val() as string);
        const modifiedBy = $('#modifiedBy').val() as string;

        if(!Folder.validateFolderInput(folderName, modified, modifiedBy)) {
          return;
        }

        const newFolder = Folder.createNewFolder(folderName, modified, modifiedBy, state.currentFolderId);
        newFolder.save(state.currentFolderId);

        const currentFolder = Folder.loadSelectedFolder(state.currentFolderId);
        renderTable(state);
        // close modal form and clear input
        $('#modal-cancel-button').click();
        clearInput();

      }
    }
  });

  

  $('#back-button').on('click', () => {
    const parentFolderId = Folder.loadSelectedFolder(state.currentFolderId).parentFolder as number;
    console.log(parentFolderId);
    const parentFolder = Folder.loadSelectedFolder(parentFolderId);
    state.currentFolderId = parentFolderId;
    renderTable(state);
  });
});
