const spinner = `
<div class="spinner-border position-absolute text-center text-primary center-spinner" role="status">
  <span class="sr-only">Loading...</span>
</div>`;

const renderSpinner = () => {
  $('#main-content').append(spinner);
};

export const removeSpinner = () => {
  $('.spinner-border').remove();
}

export default renderSpinner;
