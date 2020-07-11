import React, { useEffect, useState } from "react"
import { ButtonGroup, ToggleButton } from "react-bootstrap"
import { URLParameter } from "../utilities"

interface Props {
  parameters: URLParameter
  modes: { name: string, value: string }[]
  paramKey: string
  page: string

  effect(value: string): void
}

export function SelectionParameterRadioButton({modes, effect, parameters, paramKey, page}: Props) {
  const [radioValue, setRadioValue] = useState(parameters.getString(paramKey))
  useEffect(() => {
    effect(radioValue)
    parameters.setString(paramKey, radioValue)
    window.history.pushState("page", "blind_painter_react", `/pages/${page}.html${parameters.toURLString()}`)
  })

  return <ButtonGroup toggle>
    {modes.map((radio, idx) => (
      <ToggleButton
        key={idx}
        type="radio"
        variant="secondary"
        name="radio"
        value={radio.value}
        checked={radioValue === radio.value}
        onChange={(e: any) => {
          setRadioValue(e.currentTarget.value)
        }}
      >
        {radio.name}
      </ToggleButton>
    ))}
  </ButtonGroup>

}
