import React from 'react'

import {
  DropdownButton,
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
  showAbout,
  tags,
  onSelect,
  onSelectAbout
}) => {
  let title = showAbout ? "About" :
    (currentTag || "")
  return (
    <DropdownButton className="navbar-menu"
                    title={title}
                    id="category-dropdown"
                    pullRight>
      { buildNavItems(tags, onSelect) }
      <MenuItem onSelect={onSelectAbout}>About</MenuItem>
      <InstagramMenuItem/>
    </DropdownButton>
  )
}

export default Menu
