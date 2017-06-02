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
  selectedImageFiles,
  onFileSelected,
  onAddProperty,
  onChangeName,
  onChangeValue,
  onDeleteProperty,
  onClose,
  onSave
}) => {
  let handleFileChange = (e) => {
    onFileSelected(e.target.files)
  }

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
          <br/>
          <br/>
          <input className="btn btn-lg btn-primary" type="file" onChange={handleFileChange} />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => onSave(image, properties, selectedImageFiles)}>Save</Button>
        <Button onClick={onClose}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default SingleImageEditor