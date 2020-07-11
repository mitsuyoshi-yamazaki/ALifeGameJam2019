import React, { useEffect, useState } from "react"
import { InputGroup, FormControl, OverlayTrigger, Tooltip } from "react-bootstrap"
import { URLParameter } from "../utilities"

interface Props {
  parameters: URLParameter
  paramKey: string
  page: string
  defaultValue: number
  detail: string
  label: string

  effect(value: number): void
}

export function NumberParameterInput({parameters, paramKey, page, effect, defaultValue, label, detail}: Props) {
  const [value, setValue] = useState(parameters.getNumber(paramKey, defaultValue))
  useEffect(() => {
    effect(value)
    parameters.setNumber(paramKey, value)
    window.history.pushState("page", "blind_painter_react", `/pages/${page}.html${parameters.toURLString()}`)
  })

  return <OverlayTrigger
    key={paramKey}
    placement="top"
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
}
