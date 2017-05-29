import React from 'react'

import {
  MenuItem
} from "react-bootstrap"

const AboutMenuItem = ({ onSelect }) => {
  return (
    <MenuItem onSelect={onSelect}>About</MenuItem>
  )
}

export default AboutMenuItem