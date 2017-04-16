import React from 'react'
import { Tabs, Tab } from "react-bootstrap"

import Menu from "../containers/Menu"
import Tag from "../containers/Tag"

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
  onTagSelected
}) => (
  <div>
    <Menu />
    <Tabs
      id="tags"
      activeKey={activeTag}
      onSelect={ (tag) => onTagSelected(tag) }>
      { buildTabForTags(tags) }
    </Tabs>
  </div>
)

export default App