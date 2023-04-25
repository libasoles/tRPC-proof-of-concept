import type { Candidate, CandidateField, PartialCandidate, Reason } from "#/types";
import { useState, useMemo, useCallback, useRef } from "react";
import { CellProps, Column, useTable } from "react-table"
import dayjs from 'dayjs'
import { trpc } from "@/api";
import { debounceTime } from "@/config";

export type EnabledColumns = Record<CandidateField, boolean>
type Cell = CellProps<PartialCandidate>

const useCanditateTable = (enabledColumns: Partial<EnabledColumns>, onAddReason: (candidate: PartialCandidate) => void) => {
  const requestedFields: string[] = useMemo(() => Object.entries(enabledColumns).filter(([_, value]) => value).map(([key, _]) => key), [enabledColumns])

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    onlyApproved: false,
    search: "",
  });

  const debounceSearch = useRef<NodeJS.Timeout>()

  const { data, isLoading, isError, isSuccess } = trpc.candidates.all.useQuery({ filters, requestedFields, pageNumber: currentPage })

  const filterResults = useCallback((name: string, value: unknown) => {
    setCurrentPage(1);
    setFilters((filters) => ({ ...filters, [name]: value }))
  }, [])

  const filterResultsWithDebounce = useCallback((name: string, value: unknown) => {
    if (!debounceTime) {
      filterResults(name, value)
      return
    }

    clearTimeout(debounceSearch.current);
    debounceSearch.current = setTimeout(() => filterResults(name, value), debounceTime);
  }, [filterResults])

  const columns = useMemo<Column<PartialCandidate>[]>(
    () => [
      { Header: "Nombre", accessor: "name" },
      { Header: "DNI", accessor: "document" },
      { Header: "Zonajobs", accessor: "cv_zonajobs", Cell: ({ value }: Cell) => formatLink(value) },
      { Header: "Bumeran", accessor: "cv_bumeran", Cell: ({ value }: Cell) => formatLink(value) },
      { Header: "Teléfono", accessor: "phone" },
      { Header: "Email", accessor: "email" },
      { Header: "Fecha", accessor: "date", Cell: ({ value }: Cell) => <>{formatDate(value)}</> },
      { Header: "Edad", accessor: "age" },
      { Header: "Universitario", accessor: "has_university", Cell: ({ value }: Cell) => <>{formatBoolean(value)}</> },
      { Header: "Carrera", accessor: "career" },
      { Header: "Graduado", accessor: "graduated" },
      { Header: "Materias aprobadas", accessor: "courses_approved" },
      { Header: "Ubicacion", accessor: "location" },
      { Header: "Acepta carga horaria", accessor: "accepts_working_hours", Cell: ({ value }: Cell) => <>{formatBoolean(value)}</> },
      { Header: "Expectativa salarial", accessor: "desired_salary", Cell: ({ value }: Cell) => <>{formatMoney(value)}</> },
      { Header: "Fue entrevistado", accessor: "had_interview", Cell: ({ value }: Cell) => <>{formatBoolean(value)}</> },
      {
        Header: "Razones", accessor: "reason", Cell: ({ value, row }: Cell) =>
          <div className="pills">
            {formatReasons(value)}
            <button data-testid="edit-reasons-button" name="edit-reasons" className="add-button" onClick={() => onAddReason(row.original)}>Editar</button>
          </div>
      },
    ].filter(column => requestedFields.includes(column.accessor as string))
      .map((column) => ({
        ...column,
        accessor: column.accessor as keyof Candidate, // to typed columns
      })),
    [requestedFields, onAddReason]
  )

  return {
    isLoading,
    isError,
    isSuccess,
    numberOfRecords: data?.numberOfRecords || 0,
    currentPage,
    setCurrentPage,
    filterResults,
    filterResultsWithDebounce,
    ...useTable<PartialCandidate>({
      columns,
      data: data?.candidates || [],
    })
  }
}

function formatLink(value: string) {
  return <a href={value} target="blank">{`🔗 Ver CV`}</a>;
}

function formatDate(value: string) {
  return dayjs(value).format('DD/MM/YYYY');
}

function formatBoolean(value: boolean) {
  return value ? "Si" : "No";
}

function formatMoney(value: boolean) {
  return `$${value}`;
}

function formatReasons(values: Reason[]) {
  return values.map(value => <span key={value.id} className="pill" data-testid="rejection-reason">{value.description}</span>);
}

export default useCanditateTable;
