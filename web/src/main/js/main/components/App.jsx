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
import About from "./About"

const Loader = ({
  loader
}) => {
  return (
    <div id="loader-overlay" className={`${ loader.get("show") ? " loader-overlay-show" : ""}`}>
      <div className="message">
        {loader.get("message")}
      </div>
      <div className="loader"/>
    </div>
  )
}

const App = ({
  loader,
  showAbout,
}) => (
  <Grid>
    <Loader loader={loader} />
    <Navbar fixedTop inverse>
      <Col xs={4} md={6}>
        <div className="title">Dave Clay</div>
      </Col>
      <Col xs={8} smHidden mdHidden lgHidden>
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