import React from 'react'

class SelectionItem extends React.Component {
  render = () => {
    return(
      <div ref="container" >
        { this.props.children }
      </div>
    );
  }
}

export default SelectionItem