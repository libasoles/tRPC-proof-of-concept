import { SyntheticEvent, useCallback, useState } from "react";
import Pagination from "@/components/Candidates/Pagination";
import useCanditateTable, { EnabledColumns } from "@/components/Candidates/useCanditateTable";
import { createPortal } from "react-dom";
import RejectionReasons from "@/components/Candidates/RejectionReasons";
import { queryClient, trpc } from "@/api";
import { Candidate } from "#/types";
import "./Candidates.css";
import { rowsPerPage } from "@/config";
import { getQueryKey } from "@trpc/react-query";

type Props = { enabledColumns: Partial<EnabledColumns> }

// TODO: extract part of this logic to a hook
const Candidates = ({ enabledColumns }: Props) => {
  const [displayReasons, setDisplayReasons] = useState(false)
  const [preselectedReasons, setPreselectedReasons] = useState<number[]>([])
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null)

  const onAddReason = useCallback((candidate: Candidate) => {
    setDisplayReasons(true)
    setPreselectedReasons(candidate.reason.map(({ id }) => id))
    setCurrentCandidate(candidate)
  }, [])

  const mutation = trpc.candidates.updateReasons.useMutation()

  const onSelectReason = useCallback((e: SyntheticEvent<HTMLInputElement>) => {
    if (!currentCandidate) return

    const value = Number(e.currentTarget.value)

    const updatedReasons = preselectedReasons.filter(reason => reason !== value)

    if (e.currentTarget.checked) updatedReasons.push(value)

    setPreselectedReasons(updatedReasons);

    mutation.mutate({ candidateId: currentCandidate.id, reasonIds: updatedReasons })
  }, [mutation, preselectedReasons, currentCandidate])

  const onClose = useCallback((e: SyntheticEvent) => {
    const shouldDismiss = !HTMLButtonElement.prototype.isPrototypeOf(e.target) && (e.target as HTMLButtonElement).getAttribute("role") !== "button"
    if (shouldDismiss) return

    setDisplayReasons(false)

    queryClient.invalidateQueries(getQueryKey(trpc.candidates.all))
  }, [])

  const {
    status,
    numberOfRecords,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    currentPage,
    setCurrentPage,
    filterResults
  } = useCanditateTable(enabledColumns, onAddReason)

  if (status === 'error')
    return <div className="error">Hubo un error cargando el listado. Intenta recargando la pagina.</div>

  return (
    <div className="content" data-testid="candidates-page">
      <div className="section-header">
        <h1>Candidatos</h1>
        <form>
          <div className="filters">
            <div className="filter">
              <input type="text" placeholder="Buscar por nombre..." onKeyUp={(e) => filterResults("search", e.currentTarget.value)} />
            </div>
            <div className="filter">
              <label htmlFor="filter-status">
                <input type="checkbox" id="filter-status" onChange={(e) => filterResults("onlyApproved", e.currentTarget.checked)} />
                <span>Solo aprobados</span>
              </label>
            </div>
          </div>
        </form>
      </div>
      {(status === 'loading') && <div className="loading"><span>Cargando...</span></div>}
      {/* TODO: maybe make first column static and table scrollable */}
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
        <tbody {...getTableBodyProps()} data-testid="table-body">
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

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalRows={numberOfRecords}
        rowsPerPage={rowsPerPage}
      />

      {
        displayReasons && createPortal(
          <RejectionReasons
            preselectedReasons={preselectedReasons}
            onSelectReason={onSelectReason}
            onClose={onClose}
          />
          , document.body)
      }
    </div >
  );
};

export default Candidates;
