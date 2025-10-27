"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

interface JsonViewerProps {
  data: any
  initialDepth?: number
}

export default function JsonViewer({ data, initialDepth = 1 }: JsonViewerProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const toggleCollapse = useCallback((id: string) => {
    setCollapsed((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }, [])

  const renderValue = useCallback(
    (key: string, value: any, depth = 0): React.JSX.Element => {
      if (Array.isArray(value)) {
        const id = `${key}-${depth}-${Math.random().toString(36).substring(2, 7)}`
        return (
          <div className="ml-4">
            <div
              className="flex items-center cursor-pointer hover:bg-gray-100 rounded px-2"
              onClick={() => toggleCollapse(id)}
            >
              {collapsed[id] ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span className="text-blue-600">{key}</span>: [
              {collapsed[id] ? <span className="text-gray-500 ml-1">...{value.length} items]</span> : "]"}
            </div>
            {!collapsed[id] && (
              <div className="ml-4">
                {value.slice(0, 100).map((item: any, index: number) => (
                  <div key={index}>
                    {typeof item === "object" && item !== null ? (
                      renderObject(item, depth + 1)
                    ) : (
                      <div className="ml-4">
                        <span className="text-green-600">"{item}"</span>
                        {index < Math.min(value.length - 1, 99) ? "," : ""}
                      </div>
                    )}
                  </div>
                ))}
                {value.length > 100 && <div className="ml-4 text-gray-500">...{value.length - 100} more items</div>}
                {!collapsed[id] && value.length > 0 && <div className="ml-[-4px]">]</div>}
              </div>
            )}
          </div>
        )
      }

      if (typeof value === "object" && value !== null) {
        return <div className="ml-4">{renderObject(value, depth + 1)}</div>
      }

      return (
        <div className="ml-4">
          <span className="text-blue-600">{key}</span>: <span className="text-green-600">"{value}"</span>
        </div>
      )
    },
    [collapsed, toggleCollapse],
  )

  const renderObject = useCallback(
    (obj: any, depth = 0): React.JSX.Element => {
      if (!obj) return <div>null</div>

      const entries = Object.entries(obj)
      const id = `object-${depth}-${Math.random().toString(36).substring(2, 7)}`

      return (
        <div>
          <div
            className="flex items-center cursor-pointer hover:bg-gray-100 rounded px-2"
            onClick={() => toggleCollapse(id)}
          >
            {collapsed[id] ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {"{"}
            {collapsed[id] && <span className="text-gray-500 ml-1">{"..."}</span>}
          </div>
          {!collapsed[id] && (
            <>
              {entries.map(([key, value], index) => (
                <div key={key}>{renderValue(key, value, depth + 1)}</div>
              ))}
              <div>{"}"}</div>
            </>
          )}
        </div>
      )
    },
    [collapsed, renderValue, toggleCollapse],
  )

  return <div className="font-mono text-sm">{renderObject(data, initialDepth)}</div>
}

