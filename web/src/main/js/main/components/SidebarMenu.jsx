import React from 'react'

import {
  Grid,
  Row
} from "react-bootstrap"

import InstagramMenuItem from "./InstagramMenuItem"

const buildNavItems = (tags, currentTag, onSelect) => {
  return tags.map(tag => {
    let className = (tag == currentTag) ? "active-menu-item" : "";
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
  onSelect
}) => {
  return (
    <ul className="sidebar-menu col-xs-12 col-sm-3 col-md-2 hidden-xs">
      { buildNavItems(tags, currentTag, onSelect) }
      <InstagramMenuItem/>
    </ul>
  )
}

export default Menu
