/*eslint-disable */
var HogiaBootstrapExpandablePanel = HogiaBootstrapExpandablePanel || {};

HogiaBootstrapExpandablePanel.ExpandablePanelHandler = function () {
  var VmExpandablePanel = function () {
    this.initAnimState = true;
    this.isAddNewVisible = false;

    elemSelector = ".table-expandable-panel";

    this.itemlist = [];

    var tableRows = document.querySelector(elemSelector + " tbody").children;
    if (tableRows) {
      for (var i = 0; i < tableRows.length; i++) {
        this.itemlist.push(tableRows[i]);
      }
    }
  };

  //Toggle functions
  VmExpandablePanel.prototype.togglePost = function () {

    this.initAnimState = false;
    this.isAddNewVisible = !this.isAddNewVisible;

    var elem = document.querySelector('.table-expandable-panel #postContainer > td > div');
    if (!this.initAnimState) {
      if (this.isAddNewVisible) {
        elem.className = 'slideDown';
      } else {
        elem.className = 'slideUp';
      }
    }
  };

  VmExpandablePanel.prototype.togglePatch = function (row) {
    var parent = row.parentElement;

    parent.parentElement.className = parent.parentElement.className == "expanded" ? "notExpanded" : "expanded";

    if (this.itemlist.length > 0) {
      this.itemlist.forEach(item => {
        if (item !== parent.parentElement) {
          vm.toggle(item);
      item.className = item.className == "expanded" || item.className == "" ? "notExpanded" : "expanded";
    }
  });
}
vm.toggle(parent);
};

VmExpandablePanel.prototype.toggle = function (parent) {

  var elem = parent.querySelector(".white-space-before");
  if (parent.parentElement == this.itemlist[0]) {
    elem.style = "display: none;"
  }

  if (parent.parentElement.className == "expanded") {
    elem.className = 'white-space white-space-before white-space-down';
  } else {
    elem.className = 'white-space white-space-before white-space-up';
  }

  elem = parent.querySelector(".expandable-form");
  if (parent.parentElement.className == "expanded") {
    elem.className = 'expandable-form slideDown';
  } else {
    elem.className = 'expandable-form slideUp';
  }

  elem = parent.querySelector(".toggle-link");
  var classes = "fa fa-chevron-down toggle-link";
  if (parent.parentElement.className == "expanded") {
    elem.className = classes + ' ' + 'rotateAntiClockWise';
  } else {
    elem.className = classes + ' ' + 'rotateClockWise';
  }
};

VmExpandablePanel.prototype.initialize = function (Itemlist) {
  this.initAnimState = true;
  this.isAddNewVisible = false;
};

var vm = new VmExpandablePanel();

var viewmodel = {
  initialize: function (Itemlist) {
    vm.initialize(Itemlist);
  },
  togglePost: vm.togglePost,
  togglePatch: function (row) {
    vm.togglePatch(row)
  },
  initAnimState: vm.initAnimState,
  isAddNewVisible: vm.isAddNewVisible,
  itemlist: vm.itemlist
};

return viewmodel;
}
/* eslint-enable */