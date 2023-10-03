import React from "react"
import Table from "../base-components/Table"
import Button from "../base-components/Button"
import Lucide from "../base-components/Lucide"

interface TableProps {
  fields: any
  data: any
  action: Function
}

const TableConstructor = ({ fields, data, action }: TableProps) => {
  return (
    <Table striped>
      <Table.Thead>
        <Table.Tr>
          {fields.map((field: { name: string }) => {
            return (
              <Table.Th key={field.name} className="whitespace-nowrap">
                {field.name}
              </Table.Th>
            )
          })}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data?.map((row: any) => {
          return (
            <Table.Tr className="bg-white" key={row.Nombre + row.CUIT}>
              {fields?.map((field: { name: string }) => {
                if (field.name != "Acciones")
                  return <Table.Td key={row[field?.name]}>{row[field?.name]}</Table.Td>
              })}
              <Table.Td className="first:rounded-l-md last:rounded-r-md border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                <Button
                  variant="soft-primary"
                  className="mb-2 mr-1"
                  style={{ cursor: "pointer" }}
                  onClick={() => action()}
                >
                  <Lucide icon="Eye" className="w-5 h-5" />
                </Button>
              </Table.Td>
            </Table.Tr>
          )
        })}
      </Table.Tbody>
    </Table>
  )
}

export default TableConstructor
