import React from "react"
import Table from "../base-components/Table"
import Button from "../base-components/Button"
import Lucide from "../base-components/Lucide"
import { capitalizeFirstLetter, transformarDinero } from "../utils/helper"
import { getSituacion } from "../utils/tasaUtils"
import { useTasaContext } from '../context/TasaProvider';
import { useNavigate } from 'react-router-dom';

interface TableProps {
  fields: any
  data: any
  handleClick: Function
}

const TableConstructor = ({ fields, data, handleClick }: TableProps) => {
  const { setSelectedInmueble, setInmuebles } = useTasaContext();
  const navigate = useNavigate();

  const handleRowClick = (row) => {
    setSelectedInmueble(row);
    setInmuebles([row]);
    navigate(`/detalle/${row.nro_bad}`);
  };

  return (
    <Table striped>
      <Table.Thead>
        <Table.Tr>
          {fields.map((field: { name: string; field: string }, idx: number) => {
            return (
              <Table.Th key={idx} className="whitespace-nowrap">
                {field.name}
              </Table.Th>
            )
          })}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data?.map((row: any, idx: number) => {
          return (
            <Table.Tr className="bg-white" key={idx}>
              {fields?.map(
                (
                  field: {
                    name: string
                    field?: string
                    fieldsArray?: { fieldName: string; frontName: string }[]
                  },
                  idx: number
                ) => {
                  if (field.field) {
                    const currentField = field.field
                    if (field.name === "Situación") {
                      return <Table.Td key={field.name}>{getSituacion(row[currentField])}</Table.Td>
                    } else if (field.name === "Estado") {
                      return (
                        <Table.Td key={field.name}>
                          {row[currentField] ? "Activo" : "Baja"}
                        </Table.Td>
                      )
                    } else if (field.name === "Acciones") return

                    const formattedField =
                      typeof row[field?.field] === "number"
                        ? transformarDinero(row[field?.field])
                        : capitalizeFirstLetter(row[field?.field])
                    return <Table.Td key={idx}>{formattedField}</Table.Td>
                  } else if (field.fieldsArray)
                    return (
                      <Table.Td key={idx}>
                        {field.fieldsArray.map((ele: { fieldName: string; frontName: string }) => {
                          return (
                            <React.Fragment key={ele.fieldName}>
                              <span className="font-medium">
                                {`${capitalizeFirstLetter(ele.frontName)}: `}
                              </span>
                              <span>{`${capitalizeFirstLetter(row[ele.fieldName].toString())}`}</span>
                              <br />
                            </React.Fragment>
                          )
                        })}
                      </Table.Td>
                    )
                }
              )}
              <Table.Td className="first:rounded-l-md last:rounded-r-md border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                <Button
                  variant="soft-primary"
                  className="mb-2 mr-1"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRowClick(row)}
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
