/*
*
*   SuggestCollectionVM
*
*   @author Yuji Ito @110chang
*
*/

define([
  'knockout',
  'mod/extend'
], function(ko, extend) {
  function SuggestCollectionVM(data) {
    this.selected = -1;
    this.suggestions = ko.observableArray([]);
  }
  extend(SuggestCollectionVM.prototype, {
    add: function(suggest) {
      if (suggest.length && suggest.length > 0) {
        this.suggestions(this.suggestions().concat(suggest));
      } else {
        this.suggestions.push(suggest);
      }
    },
    get: function() {
      return this.suggestions();
    },
    set: function(suggestions) {
      this.suggestions(suggestions);
    },
    clear: function() {
      this.suggestions([]);
      this.selected = -1;
    },
    current: function() {
      return this.get()[this.selected];
    },
    updateFocus: function() {
      this.clearFocus();
      if (this.hasFocused()) {
        this.get()[this.selected].focused(true);
      }
    },
    toggle: function() {
      this.next();
    },
    prev: function() {
      this.selected--;
      if (this.selected < -1) {
        this.selected = this.get().length - 1;
      }
      this.updateFocus();
    },
    next: function() {
      this.selected++;
      if (this.selected >= this.get().length) {
        this.selected = -1;
      }
      this.updateFocus();
    },
    clearFocus: function() {
      this.get().forEach(function(suggest) {
        suggest.focused(false);
      });
    },
    hasSuggestion: function() {
      return this.get().length > 0;
    },
    hasFocused: function() {
      return this.selected > -1;
    },
    isSelected: function() {
      return this.hasSuggestion() && this.hasFocused();
    }
  });

  return SuggestCollectionVM;
});
