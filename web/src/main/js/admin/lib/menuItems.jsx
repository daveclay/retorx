import {
  reload,
  openAddImage
} from "../actions/actions"

export const menuItems = [
  {
    name: "Add New Image",
    action: openAddImage
  },
  {
    name: "Reload Files",
    action: reload
  },
];
