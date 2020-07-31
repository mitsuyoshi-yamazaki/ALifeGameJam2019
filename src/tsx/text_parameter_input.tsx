import React, { useEffect, useState } from "react"
import { InputGroup, FormControl, OverlayTrigger, Tooltip, Row, Col } from "react-bootstrap"
import { URLParameter } from "../utilities"

interface Props {
  parameters: URLParameter
  paramKey: string
  page: string
  defaultValue: string
  detail: string
  label: string

  effect(value: string): void
}

export function TextParameterInput({parameters, paramKey, page, effect, defaultValue, label, detail}: Props) {
  const [value, setValue] = useState(parameters.getString(paramKey, defaultValue))
  useEffect(() => {
    effect(value)
    parameters.setString(paramKey, value)
    window.history.pushState("page", page, `/pages/${page}.html${parameters.toURLString()}`)
  })

  return <Row>
    <Col>
      <label>{label}</label>
    </Col>
    <Col>
      <OverlayTrigger
        key={paramKey}
        placement="bottom"
        overlay={
          <Tooltip id={`tooltip-${paramKey}`}>
            {detail}
          </Tooltip>
        }
      >
        <FormControl
          type="text"
          placeholder={label}
          aria-label={label}
          aria-describedby="btnGroupAddon2"
          value={value}
          onChange={(e: any) => {
            setValue(e.currentTarget.value)
          }}
        />
      </OverlayTrigger>
    </Col>
  </Row>
}
