import React from 'react'

const About = () => {
  return (
    <div id="about" style={{display: "block"}}
         className="col-xs-12 col-sm-9 col-md-10">
      <div className="about-img-container">
        <img className="about-img" src="./images/me.jpg"/>
      </div>
      <div id="about-text"><p>
        Dave Clay is a figure artist, software engineer, interactive sculptor using Arduino and LEDs, and musician. He has exhibited at the Seattle Erotic Art Festival as well as an Honorarium Grant Receiver for Burning Man.
      </p><p>
        The art explores human religious and erotic behavior with our modern industrial technological environment. Figure drawing and painting is integrated with physical constructions using wire and old electrical/industrial components, mixing illustrative figures with abstract sculpture.
      </p>
        <p>For print availability and other information, contact Dave Clay at <a className="contactLink" href="mailto:daveclay+art@gmail.com">art@daveclay.com</a></p>
        <p>
          Dave Clay currently lives in Seattle, WA.
        </p>
      </div>
    </div>
  )
}

export default About