import React from 'react'

import Menu from "../containers/Menu"
import Tag from "../containers/Tag"
import MultipleImageEditor from "../containers/MultipleImageEditor"
import SingleImageEditor from "../containers/SingleImageEditor"

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
  tags,
  currentTag,
  onTagSelected,
  loader
}) => (
  <div>
    <Loader loader={loader} />
    <Menu />
    {
      currentTag ?
        <Tag tag={currentTag} /> :
        "Loading..."
    }
    <MultipleImageEditor />
    <SingleImageEditor />
  </div>
)

export default App