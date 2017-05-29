import React from 'react'

import {
  MenuItem
} from "react-bootstrap"

import InstagramMenuItem from "./InstagramMenuItem"

const buildNavItems = (tags,
                       currentTag,
                       showAbout,
                       onSelect) => {
  return tags.map(tag => {
    let className = (!showAbout && tag == currentTag) ? "active-menu-item" : "";
    return (
      <li key={tag}
          className={className}>
        <a onClick={() => onSelect(tag)}>{tag}</a>
      </li>
    )
  })
}

const Menu = ({
  currentTag,
  tags,
  showAbout,
  onSelect,
  onSelectAbout
}) => {
  return (
    <ul className="sidebar-menu col-xs-12 col-sm-3 col-md-2 hidden-xs">
      { buildNavItems(tags, currentTag, showAbout, onSelect) }
      <MenuItem key="About"
                className={showAbout ? "active-menu-item" : ""}
                onSelect={onSelectAbout}>About</MenuItem>
      <InstagramMenuItem/>
    </ul>
  )
}

export default Menu
