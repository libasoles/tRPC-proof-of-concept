import Pagination from "@/components/Candidates/Pagination";
import useCanditateTable, { EnabledColumns } from "@/components/Candidates/useCanditateTable";
import { rowsPerPage } from "@/config";
import useReasonModal from "@/components/Candidates/useReasonModal";
import "./Candidates.css";

type Props = { enabledColumns: Partial<EnabledColumns> }

const Candidates = ({ enabledColumns }: Props) => {
  const {
    onAddReason,
    displayReasons,
    ReasonModal
  } = useReasonModal()

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

      {displayReasons && <ReasonModal />}
    </div >
  );
};

export default Candidates;
