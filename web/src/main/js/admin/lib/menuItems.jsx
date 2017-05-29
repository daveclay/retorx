import {
  reloadTags,
  reloadFiles,
  editSelected,
  openAddImage
} from "../actions/actions"

export const menuItems = [
  {
    name: "reload tags",
    action: reloadTags
  },
  {
    name: "reload files",
    action: reloadFiles
  },
  {
    name: "Add",
    action: openAddImage
  },
  {
    name: "Edit",
    action: editSelected
  },
];
