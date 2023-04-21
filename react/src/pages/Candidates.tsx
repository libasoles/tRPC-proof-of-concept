import Pagination from "../components/Candidates/Pagination";
import useCanditateTable, { EnabledColumns } from "../components/Candidates/useCanditateTable";
import "./Candidates.css";

type Props = { enabledColumns: EnabledColumns }

export const Candidates = ({ enabledColumns }: Props) => {
  const {
    numberOfRecords,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    onPageChange
  } = useCanditateTable(enabledColumns)

  return (
    <>
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
    </>
  );
};
