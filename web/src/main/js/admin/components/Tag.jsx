import React from 'react'
import { Row, Col } from 'react-bootstrap'

import Selection from "./selection/Selection"
import SelectionItem from "./selection/SelectionItem"
import Thumbnail from "./Thumbnail"

const renderImages = (images) => {
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
    return (
      <div>loading...</div>
    )
  }
}

class Tag extends React.Component {
  componentDidMount = () => {
    if (!this.props.images) {
      this.props.onLoad(this.props.tag)
    }
  }

  render = () => {
    return (
      <Row>
        <Col xs={12}>
          <Selection onSelectionChange={this.props.onImagesSelected}
                     onDoubleClickSelection={this.props.onDoubleClickImages}>
            {
              renderImages(this.props.images)
            }
          </Selection>
        </Col>
      </Row>
    )
  }
}

export default Tag
