import type { Candidate, CandidateField, Reason } from "#/types";
import { useState, useMemo, useCallback, useRef } from "react";
import { Column, useTable } from "react-table"
import dayjs from 'dayjs'
import { trpc } from "@/api";

export type EnabledColumns = Record<CandidateField, boolean>

const useCanditateTable = (enabledColumns: Partial<EnabledColumns>, onAddReason: (candidate: Candidate) => void) => {
  const requestedFields: string[] = useMemo(() => Object.entries(enabledColumns).filter(([_, value]) => value).map(([key, _]) => key), [enabledColumns])

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    onlyApproved: false,
    search: "",
  });

  const debounce = useRef<NodeJS.Timeout>()

  const { data, isLoading, isError, isSuccess } = trpc.candidates.all.useQuery({ filters, requestedFields, pageNumber: currentPage })

  const filterResults = useCallback((name: string, value: unknown) => {
    setCurrentPage(1);
    setFilters((filters) => ({ ...filters, [name]: value }))
  }, [])

  const filterResultsWithDebounce = useCallback((name: string, value: unknown) => {
    clearTimeout(debounce.current);

    debounce.current = setTimeout(() => filterResults(name, value), 500);
  }, [filterResults])

  const columns = useMemo<Column<Partial<Candidate>>[]>(
    () => [
      { Header: "Nombre", accessor: "name" },
      { Header: "DNI", accessor: "document" },
      // @ts-ignore
      { Header: "Zonajobs", accessor: "cv_zonajobs", Cell: ({ value }) => formatLink(value) },
      // @ts-ignore
      { Header: "Bumeran", accessor: "cv_bumeran", Cell: ({ value }) => formatLink(value) },
      { Header: "Teléfono", accessor: "phone" },
      { Header: "Email", accessor: "email" },
      // @ts-ignore
      { Header: "Fecha", accessor: "date", Cell: ({ value }) => <>{formatDate(value)}</> },
      { Header: "Edad", accessor: "age" },
      // @ts-ignore
      { Header: "Universitario", accessor: "has_university", Cell: ({ value }) => <>{formatBoolean(value)}</> },
      { Header: "Carrera", accessor: "career" },
      { Header: "Graduado", accessor: "graduated" },
      { Header: "Materias aprobadas", accessor: "courses_approved" },
      { Header: "Ubicacion", accessor: "location" },
      // @ts-ignore
      { Header: "Acepta carga horaria", accessor: "accepts_working_hours", Cell: ({ value }) => <>{formatBoolean(value)}</> },
      // @ts-ignore
      { Header: "Expectativa salarial", accessor: "desired_salary", Cell: ({ value }) => <>{formatMoney(value)}</> },
      // @ts-ignore
      { Header: "Fue entrevistado", accessor: "had_interview", Cell: ({ value }) => <>{formatBoolean(value)}</> },
      {
        // @ts-ignore
        Header: "Razones", accessor: "reason", Cell: ({ value, row }) =>
          <div className="pills">
            {formatReasons(value)}
            <button data-testid="edit-reasons-button" name="edit-reasons" className="add-button" onClick={() => onAddReason(row.original)}>Editar</button>
          </div>
      },
    ].filter(column => requestedFields.includes(column.accessor as string))
      .map((column) => ({
        ...column,
        accessor: column.accessor as keyof Partial<Candidate>,
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
    ...useTable<Partial<Candidate>>({
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