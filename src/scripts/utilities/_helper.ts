import $ from 'jquery';

const ready = (fn: () => void) => {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};

export const clearInput = () => {
  $('#name').val('');
  $('#modified').val('');
  $('#modifiedBy').val('');
};

export default ready;
