import Immutable from "immutable"

import {
  upserter,
  deleter,
  findById
} from "../../lib/immutableUtils"

export const upsertEditorPropertyName = property => {
  return editorProperty => {
    if (editorProperty) {
      return editorProperty.set("name", property.newName)
    } else {
      return Immutable.Map(property)
    }
  }
}

export const upsertEditorPropertyValue = property => {
  return editorProperty => {
    if (editorProperty) {
      return editorProperty.set("value", property.value)
    } else {
      return Immutable.Map(property)
    }
  }
}

export const deleteImageEditorPropertyById = (id) => {
  let deleterFunc = deleter(findById(String(id)));
  return modifyImageEditorPropertyById(id, deleterFunc)
}

export const upsertImageEditorPropertyById = (id, modifier) => {
  let upsertFunc = upserter(findById(String(id)), modifier);
  return modifyImageEditorPropertyById(id, upsertFunc)
}

export const setImageEditorProperties = (state, imageProperties) => {
  return state.set("imageEditorProperties", buildEditorProperties(imageProperties))
}

const modifyImageEditorPropertyById = (id, modifier) => {
  return state => {
    let editorProperties = state.get("imageEditorProperties")
    return state.set("imageEditorProperties", modifier(editorProperties))
  }
}

export const buildEditorProperties = (imageProperties) => {
  return imageProperties.keySeq().toList().map(key => {
    return Immutable.Map({
      id: key,
      name: key,
      value: imageProperties.get(key)
    })
  })
}

export const assignMaps = (source, ...targets) => {
  let collectedTargets = targets.reduce((result, source) => {
    return Object.assign(result, source.toJS())
  }, {})
  return Immutable.fromJS(Object.assign(source.toJS(), collectedTargets))
}

export const editorPropertiesToMap = (editorProperties) => {
  let properties = {}
  editorProperties.forEach(editorProperty => {
    properties[editorProperty.get("name")] = editorProperty.get("value")
  })
  return Immutable.fromJS(properties)
}

export const addMapToFormData = (map, formData) => {
  let blob = new Blob([JSON.stringify(map.toJS(), null, 2)], { type : 'application/json' })
  formData.append("properties", blob)
}
