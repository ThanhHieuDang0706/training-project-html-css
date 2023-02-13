import MyFile from '../interfaces/_file';
import Item, { ItemType } from '../interfaces/_item';

const modal = () => `<!-- New File Modal -->
<div
  class="modal fade"
  id="modal-form"
  tabindex="-1"
  role="dialog"
  aria-labelledby="modal-formLabel"
  aria-hidden="true"
>
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modal-title"></h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="name"></label>
            <input type="text" class="form-control" id="name" placeholder="Enter file name">
          </div>
          <div class="form-group">
            <label for="modified">Modified</label>
            <input type="datetime-local" class="form-control" id="modified" placeholder="Modified Date">
          </div>
          <div class="form-group">
            <label for="modifiedBy">Modified By</label>
            <input type="text" class="form-control" id="modifiedBy" placeholder="Who modified this?">
          </div>

        </form>

      </div>
      <div class="modal-footer">
        <button type="button" id="modal-cancel-button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" id="modal-ok-button" class="btn btn-primary"></button>
      </div>
    </div>
  </div>
</div>`;

const renderModalForm = () => {
  $('#main-content').append(modal);
};

export const fillInput = (item: Item, id: number) => {
  // set id in the input so editor can find it
  $('#modal-title').attr('data-id', id);
  $('#name').val(item.itemType === ItemType.File ? `${item.name}.${(<MyFile>item).fileExtension}` : item.name);
  $('#modified').val(new Date(item.modified).toISOString().slice(0, 16));
  $('#modifiedBy').val(item.modifiedBy);
};

export const clearModal = () => {
  $('#modal-form').remove();
};

export default renderModalForm;
