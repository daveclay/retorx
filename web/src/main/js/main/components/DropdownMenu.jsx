import React from 'react'

import {
  DropdownButton,
  Dropdown,
  MenuItem
} from "react-bootstrap"

import InstagramMenuItem from "./InstagramMenuItem"

const buildNavItems = (tags, onSelect) => {
  return tags.map(tag => {
    return <MenuItem key={tag}
                     onSelect={() => onSelect(tag)}>{tag}</MenuItem>
  })
}

const Menu = ({
  currentTag,
  tags,
  onSelect
}) => {
  return (
    <DropdownButton className="navbar-menu"
                    title={currentTag || ""}
                    id="category-dropdown"
                    pullRight>
      { buildNavItems(tags, onSelect) }
      <InstagramMenuItem/>
    </DropdownButton>
  )
}

export default Menu
