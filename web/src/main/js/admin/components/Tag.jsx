import React from 'react'
import { Row, Col } from 'react-bootstrap'

import Selection from "./selection/Selection"
import SelectionItem from "./selection/SelectionItem"
import { baseImageContentServicePath } from "../../main/constants/constants"

const Thumbnail = ({
  onThumbnailLoaded,
 image
}) => {
  let hiddenClassName = image.get("properties").get("hidden") ? " hidden-image" : ""
  let fadeClassName = image.get("loaded") ? "fadeIn " : "transparent "
  let className = `${fadeClassName}${hiddenClassName}`

  let thumbnail = image.get("imageFilesByVersion").get("thumbnail");
  let src = baseImageContentServicePath + "image/thumbnail/" + image.get("name") + ".png";

  return (
    <div className="admin-thumb-link">
      <img className={className}
           onLoad={ () => { onThumbnailLoaded(image) }}
           width="100"
           height="100"
           src={src} />
      <br/>
      {image.get("name")}
    </div>
  )
}

const renderImages = (onThumbnailLoaded, images) => {
  if (images) {
    return images.map(image => {
      return (
        <SelectionItem key={image.get("id")}
                       id={image.get("id")}
                       value={image}>
          <Thumbnail image={image}
                     onThumbnailLoaded={onThumbnailLoaded} />
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
    let tag = this.props.tag
    return (
      <div>
        <Row>
          <Col xs={12}>
            <Selection onSelectionChange={this.props.onImagesSelected}>
              {
                renderImages(this.props.onThumbnailLoaded, this.props.images)
              }
            </Selection>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Tag
