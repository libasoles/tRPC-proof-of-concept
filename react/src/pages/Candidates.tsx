import { SyntheticEvent, useCallback, useState } from "react";
import Pagination from "../components/Candidates/Pagination";
import useCanditateTable, { EnabledColumns } from "../components/Candidates/useCanditateTable";
import "./Candidates.css";
import { createPortal } from "react-dom";
import RejectionReasons from "../components/Candidates/RejectionReasons";
import { queryClient, trpc } from "../api";
import { Candidate } from "../../../trpc/types";

type Props = { enabledColumns: EnabledColumns }

export const Candidates = ({ enabledColumns }: Props) => {
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

    // TODO: not working
    queryClient.invalidateQueries(['candidates', 'all'])
    queryClient.invalidateQueries(['candidates.all'])

    const queryCache = queryClient.getQueryCache();
    const queries = queryCache.findAll();

    // TODO: too much. Only invalidate the candidates.all query
    queries.forEach((query) => {
      queryClient.invalidateQueries(query.queryKey);
    });
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
  } = useCanditateTable(enabledColumns, onAddReason)

  if (status === 'error')
    return <div className="error">Hubo un error cargando el listado. Intenta recargando la pagina.</div>

  return (
    <div className="content">
      {(status === 'loading') && <div className="loading"><span>Cargando...</span></div>}
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

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalRows={numberOfRecords} rowsPerPage={10} />

      {displayReasons && createPortal(
        <RejectionReasons
          preselectedReasons={preselectedReasons}
          onSelectReason={onSelectReason}
          onClose={onClose}
        />
        , document.body)}
    </div>
  );
};
