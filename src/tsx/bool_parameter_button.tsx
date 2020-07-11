import React, { useEffect, useState } from "react"
import { ToggleButton } from "react-bootstrap"
import { URLParameter } from "../utilities"

interface Props {
  parameters: URLParameter
  paramKey: string
  page: string
  children: string

  effect(value: boolean): void
}

export function BoolParameterButton({parameters, paramKey, page, effect, children}: Props) {
  const [checked, setChecked] = useState(parameters.getBoolean(paramKey))
  useEffect(() => {
    effect(checked)
    parameters.setBoolean(paramKey, checked)
    window.history.pushState("page", "blind_painter_react", `/pages/${page}.html${parameters.toURLString()}`)
  })

  return <ToggleButton
    type="checkbox"
    variant="secondary"
    checked={checked}
    value="1"
    onChange={(e: any) => {
      setChecked(e.currentTarget.checked)
    }}
  >{children}</ToggleButton>
}
