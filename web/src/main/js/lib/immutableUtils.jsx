import Immutable from "immutable"

export const findById = (id) => item => item.get("id") == id

export const upserter = (finder, modifier) => {
  return list => {
    let index = list.findIndex(finder)
    if (index > -1) {
      return list.update(index, item => modifier(item, index, list))
    } else {
      return list.push(modifier())
    }
  }
}

export const deleter = (finder) => {
  return list => {
    let index = list.findIndex(finder)
    if (index > -1) {
      return list.delete(index)
    }
  }
}


