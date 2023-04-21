import { SyntheticEvent, useCallback, useState } from "react";
import Pagination from "../components/Candidates/Pagination";
import useCanditateTable, { EnabledColumns } from "../components/Candidates/useCanditateTable";
import "./Candidates.css";
import { createPortal } from "react-dom";
import RejectionReasons from "../components/Candidates/RejectionReasons";
import { queryClient, trpc } from "../api";
import { Reason } from "../../../trpc/types";

type Props = { enabledColumns: EnabledColumns }

export const Candidates = ({ enabledColumns }: Props) => {
  const [displayReasons, setDisplayReasons] = useState(false)
  const [preselectedReasons, setPreselectedReasons] = useState<number[]>([])

  const onAddReason = useCallback((selectedReasons: Reason[]) => {
    setDisplayReasons(true)
    setPreselectedReasons(selectedReasons.map(({ id }) => id))
  }, [])

  const mutation = trpc.candidates.updateReasons.useMutation()

  const onSelectReason = useCallback((e: SyntheticEvent<HTMLInputElement>) => {
    const value = Number(e.currentTarget.value)
    setPreselectedReasons(reasons => [...reasons, value]);

    const selection = [...preselectedReasons, value]

    // TODO: use real candidateId
    mutation.mutate({ candidateId: "5a271a1368adf47eb31fe683", reasonIds: selection })
  }, [mutation, preselectedReasons])

  const onClose = useCallback((e: SyntheticEvent) => {
    const shouldDismiss = !HTMLButtonElement.prototype.isPrototypeOf(e.target) && (e.target as HTMLButtonElement).getAttribute("role") !== "button"
    if (shouldDismiss) return

    setDisplayReasons(false)

    // TODO: not working
    queryClient.invalidateQueries(['candidates', 'all'])
    queryClient.invalidateQueries(['candidates.all'])
  }, [])

  const {
    status,
    numberOfRecords,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    onPageChange
  } = useCanditateTable(enabledColumns, onAddReason)

  if (status === 'error')
    return <div className="error">Hubo un error cargando el listado. Intenta recargando la pagina.</div>

  return (
    <>
      {(status === 'loading') && <div className="loading">Cargando...</div>}
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {
            rows.map((row, i) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })}
                </tr>
              )
            })
          }
        </tbody>
      </table >
      <Pagination onPageChange={onPageChange} totalRows={numberOfRecords} rowsPerPage={10} />

      {displayReasons && createPortal(
        <RejectionReasons
          preselectedReasons={preselectedReasons}
          onSelectReason={onSelectReason}
          onClose={onClose}
        />
        , document.body)}
    </>
  );
};
