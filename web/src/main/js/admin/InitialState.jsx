import { fromJS } from 'immutable'

export default fromJS({
  tags: [],
  imagesByTag: {},
  menuItems: [
    {
      name: "reload tags"
    },
    {
      name: "reload files"
    },
    {
      name: "select"
    },
  ]
})
