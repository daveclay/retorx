import React from 'react'

const About = ({about}) => {
  let aboutHtml = { __html: about }
  return (
    <div id="about" style={{display: "block"}}
         className="col-xs-12 col-sm-9 col-md-10" dangerouslySetInnerHTML={aboutHtml}/>
  )
}

export default About