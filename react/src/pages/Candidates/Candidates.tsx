import Pagination from "@/components/Candidates/Pagination";
import useCanditateTable, { EnabledColumns } from "@/components/Candidates/hooks/useCanditateTable";
import useReasonModal from "@/components/Candidates/hooks/useReasonModal";
import { rowsPerPage } from "@/config";
import "./Candidates.css";

type Props = { enabledColumns: Partial<EnabledColumns> }

const Candidates = ({ enabledColumns }: Props) => {
  const {
    onAddReason,
    displayReasons,
    ReasonModal
  } = useReasonModal()

  const {
    isLoading,
    isError,
    isSuccess,
    numberOfRecords,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    currentPage,
    setCurrentPage,
    filterResultsWithDebounce,
    filterResults
  } = useCanditateTable(enabledColumns, onAddReason)

  if (isError)
    return <div className="error">Hubo un error cargando el listado. Intenta recargando la pagina.</div>

  const hasNoResults = isSuccess && rows.length === 0

  return (
    <div className="content" data-testid="candidates-page">
      <div className="section-header">
        <h1>Candidatos</h1>
        <form>
          <div className="filters">
            <div className="filter">
              <input type="text" placeholder="Buscar por nombre..." onKeyUp={(e) => filterResultsWithDebounce("search", e.currentTarget.value)} />
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

      {isLoading && <div className="loading"><span>Cargando...</span></div>}

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
        <tbody {...getTableBodyProps()} data-testid="table-body" className={rows.length === 0 ? "hidden" : "visible"}>
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

      {hasNoResults && <div className="no-results">No hay resultados de busqueda.</div>}

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalRows={numberOfRecords}
        rowsPerPage={rowsPerPage}
      />

      {displayReasons && <ReasonModal />}
    </div >
  );
};

export default Candidates;
