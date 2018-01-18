import React from 'react'

import {
  Grid,
  Col,
  Row,
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem
} from "react-bootstrap"

import { ConnectedDropdownMenu, ConnectedSidebarMenu } from "../containers/Menus"
import ThumbnailImageGallery from "../containers/ThumbnailImageGallery"
import About from "../containers/About"

const App = ({
  showAbout,
}) => (
  <Grid>
    <Navbar fixedTop>
      <Col xs={6}>
        <div className="title">Dave Clay</div>
      </Col>
      <Col xs={6} smHidden mdHidden lgHidden>
        <ConnectedDropdownMenu/>
      </Col>
    </Navbar>
    <Grid>
      <Row>
        <ConnectedSidebarMenu/>
        {
          showAbout ?
            <About/> :
            <ThumbnailImageGallery/>
        }
      </Row>
    </Grid>
  </Grid>
)

export default App