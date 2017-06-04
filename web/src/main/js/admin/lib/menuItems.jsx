import {
  reloadTags,
  reloadFiles,
  openAddImage
} from "../actions/actions"

export const menuItems = [
  {
    name: "Add New Image",
    action: openAddImage
  },
  {
    name: "Reload Tags",
    action: reloadTags
  },
  {
    name: "Reload Files",
    action: reloadFiles
  },
];
