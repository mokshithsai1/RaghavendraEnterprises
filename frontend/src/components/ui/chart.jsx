import {jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment} from "react/jsx-runtime"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } 















const ChartContext = React.createContext(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef







(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    _jsx(ChartContext.Provider, { value: { config }, children: 
      _jsxs('div', {
        'data-chart': chartId,
        ref: ref,
        className: cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        ),
        ...props,
 children: [
        _jsx(ChartStyle, { id: chartId, config: config,} )
        , _jsx(RechartsPrimitive.ResponsiveContainer, { children: 
          children
        })
      ]})
    })
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    _jsx('style', {
      dangerouslySetInnerHTML: {
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      _optionalChain([itemConfig, 'access', _ => _.theme, 'optionalAccess', _2 => _2[theme ]]) ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      },}
    )
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef









(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !_optionalChain([payload, 'optionalAccess', _3 => _3.length])) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || _optionalChain([item, 'optionalAccess', _4 => _4.dataKey]) || _optionalChain([item, 'optionalAccess', _5 => _5.name]) || "value"}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === "string"
          ? _optionalChain([config, 'access', _6 => _6[label ], 'optionalAccess', _7 => _7.label]) || label
          : _optionalChain([itemConfig, 'optionalAccess', _8 => _8.label])

      if (labelFormatter) {
        return (
          _jsx('div', { className: cn("font-medium", labelClassName), children: 
            labelFormatter(value, payload)
          })
        )
      }

      if (!value) {
        return null
      }

      return _jsx('div', { className: cn("font-medium", labelClassName), children: value})
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ])

    if (!active || !_optionalChain([payload, 'optionalAccess', _9 => _9.length])) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      _jsxs('div', {
        ref: ref,
        className: cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        ),
 children: [
        !nestLabel ? tooltipLabel : null
        , _jsx('div', { className: "grid gap-1.5" , children: 
          payload
            .filter((item) => item.type !== "none")
            .map((item, index) => {
              const key = `${nameKey || item.name || item.dataKey || "value"}`
              const itemConfig = getPayloadConfigFromPayload(config, item, key)
              const indicatorColor = color || item.payload.fill || item.color

              return (
                _jsx('div', {

                  className: cn(
                    "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                    indicator === "dot" && "items-center"
                  ),
 children: 
                  formatter && _optionalChain([item, 'optionalAccess', _10 => _10.value]) !== undefined && item.name ? (
                    formatter(item.value, item.name, item, index, item.payload)
                  ) : (
                    _jsxs(_Fragment, { children: [
                      _optionalChain([itemConfig, 'optionalAccess', _11 => _11.icon]) ? (
                        _jsx(itemConfig.icon, {} )
                      ) : (
                        !hideIndicator && (
                          _jsx('div', {
                            className: cn(
                              "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                              {
                                "h-2.5 w-2.5": indicator === "dot",
                                "w-1": indicator === "line",
                                "w-0 border-[1.5px] border-dashed bg-transparent":
                                  indicator === "dashed",
                                "my-0.5": nestLabel && indicator === "dashed",
                              }
                            ),
                            style: 
                              {
                                "--color-bg": indicatorColor,
                                "--color-border": indicatorColor,
                              } 
                            ,}
                          )
                        )
                      )
                      , _jsxs('div', {
                        className: cn(
                          "flex flex-1 justify-between leading-none",
                          nestLabel ? "items-end" : "items-center"
                        ),
 children: [
                        _jsxs('div', { className: "grid gap-1.5" , children: [
                          nestLabel ? tooltipLabel : null
                          , _jsx('span', { className: "text-muted-foreground", children: 
                            _optionalChain([itemConfig, 'optionalAccess', _12 => _12.label]) || item.name
                          })
                        ]})
                        , item.value && (
                          _jsx('span', { className: "font-mono font-medium tabular-nums text-foreground"   , children: 
                            item.value.toLocaleString()
                          })
                        )
                      ]})
                    ]})
                  )
                }, item.dataKey)
              )
            })
        })
      ]})
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef






(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    const { config } = useChart()

    if (!_optionalChain([payload, 'optionalAccess', _13 => _13.length])) {
      return null
    }

    return (
      _jsx('div', {
        ref: ref,
        className: cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        ),
 children: 
        payload
          .filter((item) => item.type !== "none")
          .map((item) => {
            const key = `${nameKey || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)

            return (
              _jsxs('div', {

                className: cn(
                  "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
                ),
 children: [
                _optionalChain([itemConfig, 'optionalAccess', _14 => _14.icon]) && !hideIcon ? (
                  _jsx(itemConfig.icon, {} )
                ) : (
                  _jsx('div', {
                    className: "h-2 w-2 shrink-0 rounded-[2px]"   ,
                    style: {
                      backgroundColor: item.color,
                    },}
                  )
                )
                , _optionalChain([itemConfig, 'optionalAccess', _15 => _15.label])
              ]}, item.value)
            )
          })
      })
    )
  }
)
ChartLegendContent.displayName = "ChartLegend"

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config,
  payload,
  key
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey = key

  if (
    key in payload &&
    typeof payload[key ] === "string"
  ) {
    configLabelKey = payload[key ] 
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key ] === "string"
  ) {
    configLabelKey = payloadPayload[
      key 
    ] 
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key ]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
