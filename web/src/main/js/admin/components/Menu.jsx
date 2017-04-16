import React from 'react'
import { Navbar, Nav, NavItem } from 'react-bootstrap'

const buildNavItems = (
  menuItems,
  onSelect
) => {
  return menuItems.map(item => {
    return (
      <NavItem key={item.get("name")} onSelect={() => onSelect(item)}>{item.get("name")}</NavItem>
    )
  })
}

const Menu = ({
  menuItems,
  onSelect
}) => {

  return (
    <Navbar>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="#">Admin</a>
        </Navbar.Brand>
      </Navbar.Header>
      <Nav>
        { buildNavItems(menuItems, onSelect) }
      </Nav>
    </Navbar>
  )
}

export default Menu
