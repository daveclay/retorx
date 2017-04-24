import React from 'react'
import {
  Navbar,
  Nav,
  NavItem,
  Button,
  Col
} from 'react-bootstrap'

const buildNavItems = (
  menuItems,
  onSelect
) => {
  return menuItems.map(item => {
    return (
      <Button key={item.get("name")}
               onClick={() => onSelect(item)}>
        {item.get("name")}
      </Button>
    )
  })
}

const Menu = ({
  menuItems,
  onSelect
}) => {

  return (
    <Navbar fixedTop>
      <Col xs={2} md={2}>
        Admin
      </Col>
      <Col xs={10} md={10} mdHidden>
        { buildNavItems(menuItems, onSelect) }
      </Col>
    </Navbar>
  )
}

export default Menu
