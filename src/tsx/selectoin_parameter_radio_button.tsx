import { FormGroup } from "@material-ui/core"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import React, { useEffect, useState } from "react"
import { URLParameter } from "../utilities"

interface Props {
  parameters: URLParameter
  modes: { name: string, value: string }[]
  paramKey: string
  page: string
  defaultValue: string

  effect(value: string): void
}

export function SelectionParameterRadioButton({modes, effect, parameters, paramKey, page, defaultValue}: Props) {
  const [radioValue, setRadioValue] = useState(parameters.getString(paramKey, defaultValue))
  useEffect(() => {
    effect(radioValue)
    parameters.setString(paramKey, radioValue)
    window.history.pushState("page", page, `/pages/${page}.html${parameters.toURLString()}`)
  })

  return <RadioGroup row defaultValue={defaultValue}>
    {modes.map((radio, idx) => (
      <FormControlLabel
        control={<Radio color="primary"/>}
        labelPlacement="end"
        value={radio.value}
        label={radio.name}
        onChange={(e: any) => {
          setRadioValue(e.currentTarget.value)
        }}
      ></FormControlLabel>
    ))}
  </RadioGroup>

}
