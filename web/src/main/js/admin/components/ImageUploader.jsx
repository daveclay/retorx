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

const ImageUploader = ({
  selectedImageFiles,
  showUploader,
  onClose,
  onFileSelected,
  onSave
}) => {

  let handleFileChange = (e) => {
    onFileSelected(e.target.files)
  }

  return (
    <Modal show={showUploader} onHide={onClose} bsSize="lg">
      <Modal.Header closeButton>
        <Modal.Title>Upload Image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form horizontal>
          <input type="file" onChange={handleFileChange} />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={() => onSave(selectedImageFiles)}>Save</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ImageUploader
