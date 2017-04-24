import React from 'react'

import {
  DropdownButton,
  Dropdown,
  MenuItem
} from "react-bootstrap"

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
    </DropdownButton>
  )
}

export default Menu
