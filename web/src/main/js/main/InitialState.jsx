import { fromJS } from 'immutable'

import {
  loadImagesForTag,
  loadAllTags,
} from "./actions/imageApiActions"

export default fromJS({
  initialTag: "figure painting",
  tags: [],
  imagesByTag: {},
  loader: {
    show: false,
    message: ""
  },
  tagInfo: {
    "figure constructions":
    "The figure constructions are explorations in engineering art, building up abstract " +
    "sculptural elements integrated into figures rendered with mixed media. <i>\"There's a lot of chaotic elements " +
    "in these pieces. I tried to construct a certain amount of decayed industrial textures and figurative energy.\"</i> " +
    "These figures represent a transition between the digital collage and the artist's current figurative oil paintings.",

    "figure painting":
    "The artist's current primary focus is painting the figure in oils. <i>\"I'm looking at using oils - " +
    "its variety in color and texture - to further explore the complex relationships of humanity, sexuality, and our digital-industrial " +
    "environment. The figures exist in abstract textures rather than real " +
    "space.\"</i>",

    "abstracts":
    "<i>\"Abstraction is always at the edge of even my figurative works. I am not interested " +
    "in literal transcriptions or realism. I want to reflect a broader context of the environment that we live in." +
    "\"</i> The abstract pieces here represent experiments and studies, elements that may be brought into the figurative works.",

    "digital collage":
    "These digital works, created from 2001-2007, examine the ephemeral nature of modern sexuality and technology. " +
    "The source images are assembled into abstract bio-mechanical forms with explicit and suggestive figurative " +
    "elements. These images combined the artist's fascination with code, engineering and figurative work.",

    "posters": "These posters were created for various local bands using various pen and ink techniques and digitally colored.",

    "sculpture": "<i>\"Sculpture is rarely a focus of my work, but has had a major influence on how I approach drawing" +
    " and painting. It's a tool for me to delve further into industrial forms with new media.\"</i>",

    "graphic design": "Album covers and websites for various personal and professional projects."
  }
})
