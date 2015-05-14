/*
 *
 *   Main 
 *
 */

requirejs.config({
  baseUrl: '/js',
  urlArgs: 'bust=' + (new Date()).getTime(),
  paths: {
    'mod' : 'mod'
  }
});

require([], function() {
  $(function() {
    console.log('DOM ready.');
  });
});

