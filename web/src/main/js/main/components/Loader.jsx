import React from 'react'

const Loader = ({
  showLoader
}) => {
  let styles = showLoader ? {} : { "display": "none" }
  return (
    <div id="content-loader" style={styles}>
      <div className="loader-graphic"/>
      <div className="message">
        Loading...
      </div>
    </div>
  )
}

export default Loader
