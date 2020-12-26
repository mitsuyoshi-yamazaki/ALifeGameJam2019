import { FormGroup } from "@material-ui/core"
import Checkbox from "@material-ui/core/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import React, { useEffect, useState } from "react"
import { URLParameter } from "../utilities"

interface Props {
  parameters: URLParameter
  paramKey: string
  page: string
  children: string
  defaultValue: boolean

  effect(value: boolean): void
}

export function BoolParameterButton({ parameters, paramKey, page, effect, children, defaultValue}: Props) {
  const [checked, setChecked] = useState(parameters.getBoolean(paramKey, defaultValue))
  useEffect(() => {
    effect(checked)
    parameters.setBoolean(paramKey, checked)
    window.history.pushState("page", page, `/pages/${page}.html${parameters.toURLString()}`)
  })

  return <FormGroup row>
    <FormControlLabel
      control={
        <Checkbox
          checked={ checked}
          value="1"
          onChange={ (e: any) => {
            setChecked(e.currentTarget.checked)
          }}
        />
      }
      label={ children}
    />
  </FormGroup>

}
