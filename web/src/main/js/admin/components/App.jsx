import React from 'react'
import { Tabs, Tab } from "react-bootstrap"

import Menu from "../containers/Menu"
import Tag from "../containers/Tag"
import MultipleImageEditor from "../containers/MultipleImageEditor"
import SingleImageEditor from "../containers/SingleImageEditor"
import ImageUploader from "../containers/ImageUploader"

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

const buildTabForTags = (tags) => {
  return tags.map(tag => {
    return (
      <Tab key={tag}
           mountOnEnter={true}
           eventKey={tag}
           title={tag}>
        <Tag tag={tag} />
      </Tab>
    )
  })
}

const App = ({
  tags,
  activeTag,
  onTagSelected,
  loader
}) => (
  <div>
    <Loader loader={loader} />
    <Menu />
    <Tabs
      id="tags"
      activeKey={activeTag}
      onSelect={ (tag) => onTagSelected(tag) }>
      { buildTabForTags(tags) }
    </Tabs>
    <MultipleImageEditor />
    <SingleImageEditor />
    <ImageUploader />
  </div>
)

export default App