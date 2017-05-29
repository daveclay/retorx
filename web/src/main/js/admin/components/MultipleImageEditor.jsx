import React from 'react'

import {
  Modal,
  Button,
  Form,
  FormGroup,
  FormControl,
  Col,
  ControlLabel
} from "react-bootstrap"

import Thumbnail from "./Thumbnail"
import PropertiesEditor from "./PropertiesEditor"

const renderImages = (images) => {
  if (!images) {
    return <span/>
  }

  return images.map(image => {
    return <Thumbnail key={image.get("id")} image={image} />
  })
}

const MultipleImageEditor = ({
  showEditor,
  properties,
  images,
  onAddProperty,
  onDeleteProperty,
  onClose,
  onChangeName,
  onChangeValue,
  onSave
}) => {
  return (
    <Modal show={showEditor} onHide={onClose} bsSize="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Multiple Images</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form horizontal>
          {
            properties ? <PropertiesEditor properties={properties}
                                           onChangeName={onChangeName}
                                           onAddProperty={onAddProperty}
                                           onDelete={onDeleteProperty}
                                           onChangeValue={onChangeValue} />
              : <span/>
          }
        </Form>
        <br/>
        <div className="thumbnails">
          {
            renderImages(images)
          }
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => onSave(images, properties)}>Save</Button>
        <Button onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default MultipleImageEditor