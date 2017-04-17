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

class AddProperty extends React.Component {
  render() {
    return (
      <Col xs="3">
      </Col>
    )
  }
}


class PropertyEditor extends React.Component {
  render() {
    let {
      id,
      name,
      value,
      onChangeName,
      onChangeValue,
      onDelete
    } = this.props
    return (
      <FormGroup>
        <Col componentClass={ControlLabel}
             sm={4}>
          <FormControl type="text"
                       placeholder="Name"
                       value={name}
                       onChange={(e) => onChangeName(id, e.target.value)}
          />
        </Col>
        <Col sm={5}>
          {
            value && value.length > 30 ?
              <FormControl componentClass="textarea"
                           key={name}
                           placeholder="Value"
                           value={value}
                           onChange={(e) => onChangeValue(id, e.target.value) }/>
              :
              <FormControl type="text"
                           key={name}
                           placeholder="Value"
                           value={value}
                           onChange={(e) => onChangeValue(id, e.target.value) } />
          }
        </Col>
        <Col sm={3}>
          <Button onClick={() => onDelete(id)}
                  bsStyle="danger">Delete</Button>
        </Col>
      </FormGroup>
    )
  }
}

const PropertiesEditor = ({
  properties,
  onChangeName,
  onChangeValue,
  onDelete,
  onAddProperty
}) => {
  let stupidWeirdMapBecauseICantMap = properties.map(property => {
    return (
      <PropertyEditor key={property.get("id")}
                      id={property.get("id")}
                      name={property.get("name")}
                      value={property.get("value")}
                      onDelete={onDelete}
                      onChangeName={onChangeName}
                      onChangeValue={onChangeValue} />
    )
  })

  return (
    <span>
      { stupidWeirdMapBecauseICantMap }
      <br/>
      <Button onClick={onAddProperty}>Add</Button>
    </span>
  )
}

export default PropertiesEditor
