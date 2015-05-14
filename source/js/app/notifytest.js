/*
*
*   Notify.js test
*
*   @author Yuji Ito @110chang
*
*/

define([], function() {
  $.notify('エラー表示です', {
    className: 'error',
    autoHide: false
  });

  $.notify('成功表示です', {
    className: 'success',
    autoHide: false
  });

  $.notify('情報表示です', {
    className: 'info',
    autoHide: false
  });

  $.notify('注意表示です', {
    className: 'warn',
    autoHide: false
  });

  return true;
});
