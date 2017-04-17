import React from 'react'

class SelectionItem extends React.Component {
  render = () => {
    return(
      <span ref="container" >
        { this.props.children }
      </span>
    );
  }
}

export default SelectionItem