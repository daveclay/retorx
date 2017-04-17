import React from 'react'

import { baseImageContentServicePath } from "../../main/constants/constants"

class Thumbnail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false
    }
  }

  render() {
     let image = this.props.image;

    let hiddenClassName = image.get("properties").get("hidden") ? " hidden-image" : ""
    let fadeClassName = this.state.loaded ? "fadeIn " : "transparent "
    let className = `${fadeClassName}${hiddenClassName}`

    let thumbnail = image.get("imageFilesByVersion").get("thumbnail");
    let src = baseImageContentServicePath + "image/thumbnail/" + image.get("name") + ".png";


    return (
      <div className="thumbnail">
        <img className={className}
             onLoad={ () => this.setState({ loaded: true }) }
             width="100"
             height="100"
             src={src} />
        <br/>
        {image.get("name")}
      </div>
    )
  }
}

export default Thumbnail
