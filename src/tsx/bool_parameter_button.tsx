import React, { useEffect, useState } from "react"
import { ToggleButton } from "react-bootstrap"
import { URLParameter } from "../utilities"

interface Props {
  parameters: URLParameter
  initial: boolean
  paramKey: string
  page: string
  children: string

  effect(value: boolean): void
}

export function BoolParameterButton({parameters, initial, paramKey, page, effect, children}: Props) {
  const [checked, setChecked] = useState(initial)
  useEffect(() => {
    effect(checked)
    parameters.parameters.set(paramKey, checked.toString())
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
