import React from 'react'
import { Row, Col } from 'react-bootstrap'

import Selection from "./selection/Selection"
import SelectionItem from "./selection/SelectionItem"
import Thumbnail from "./Thumbnail"

class Tag extends React.Component {

  renderImages = (images) => {
    if (images) {
      return images.map(image => {
        return (
          <SelectionItem key={image.get("id")}
                         id={image.get("id")}
                         value={image}>
            <Thumbnail image={image} />
          </SelectionItem>
        )
      })
    } else {
      this.props.onLoad(this.props.tag)
      return (
        <div>loading...</div>
      )
    }
  }

  render = () => {
    return (
      <Row className="admin-images">
        <Col xs={12}>
          <Selection tag={this.props.tag}
                     onSelectionChange={this.props.onImagesSelected}
                     onDoubleClickSelection={this.props.onDoubleClickImages}>
            {
              this.renderImages(this.props.images)
            }
          </Selection>
        </Col>
      </Row>
    )
  }
}

export default Tag
