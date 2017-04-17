import React from 'react'

import {
  Modal,
  Button,
  Form, FormControl,
} from "react-bootstrap"

import PropertiesEditor from "./PropertiesEditor"

const SingleImageEditor = ({
  showEditor,
  properties,
  image,
  onAddProperty,
  onChangeName,
  onChangeValue,
  onDeleteProperty,
  onClose,
  onSave
}) => {
  let name = image ? image.get("name") : ""
  return (
    <Modal show={showEditor} onHide={onClose} bsSize="lg">
      <Modal.Header closeButton>
        <Modal.Title>{ name }</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form horizontal>
          {
            properties ? <PropertiesEditor properties={properties}
                                           onChangeName={onChangeName}
                                           onDelete={onDeleteProperty}
                                           onAddProperty={onAddProperty}
                                           onChangeValue={onChangeValue} />
            : <span/>
          }
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => onSave(image, properties)}>Save</Button>
        <Button onClick={onClose}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default SingleImageEditor