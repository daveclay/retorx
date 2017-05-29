import React from 'react'
import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
  Button,
  Col
} from 'react-bootstrap'

const buildNavItems = (
  menuItems,
  onSelect
) => {
  return menuItems.map(item => {
    return (
      <NavItem key={item.get("name")}
               onClick={() => onSelect(item)}>
        {item.get("name")}
      </NavItem>
    )
  })
}

const Menu = ({
  tags,
  currentTag,
  menuItems,
  tagSelected,
  onSelect
}) => {

  return (
    <Navbar fixedTop collapseOnSelect>
      <Navbar.Header>
        <Navbar.Brand>
          Admin {currentTag}
        </Navbar.Brand>
        <Navbar.Toggle/>
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav pullRight>
          { buildNavItems(menuItems, onSelect) }
          {
            tags.map(tag =>
              <NavItem key={tag}
                       className="visible-xs"
                       onClick={() => tagSelected(tag)}>
                {tag}
              </NavItem>
            )
          }
          <NavDropdown title={currentTag || "..."}
                       className="hidden-xs"
                       id="tag-nav-dropdown">
            {
              tags.map(tag =>
                <MenuItem key={tag}
                         onClick={() => tagSelected(tag)}>
                  {tag}
                </MenuItem>
              )
            }
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Menu
