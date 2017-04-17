import React from 'react'
import { connect } from 'react-redux'

import App from "../components/App"
import { tagSelected } from "../actions/actions"

const mapStateToProps = (state) => {
  return {
    tags: state.get("tags"),
    loader: state.get("loader")
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTagSelected: function(tag) {
      dispatch(tagSelected(tag))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

/*
menu.addItem("reload tags", function() {
  loader.show();
  adminApi.reloadTags(function()  {
    notify("Reloaded.");
  });
});

menu.addItem("reload files", function() {
  loader.show();
  adminApi.reloadFiles(function() {
    notify("Reloaded.");
  });
});

menu.addItem("enable select", function(menuItem, menuDiv) {
  if (selectionEnabled) {
    menuDiv.text("enable select");
    self.disableSelection();
  } else {
    menuDiv.text("disbale select");
    self.enableSelection();
  }
});

menu.addItem("hide selected", function() {
  loader.show();
  tagAdminUIs.forEach(function(tagAdminUI) {
    tagAdminUI.markSelectedAsHidden();
  });
});

makeModalButton(menu.addItem("edit selected", function() {
  self.editSelected();
}).elem);
*/