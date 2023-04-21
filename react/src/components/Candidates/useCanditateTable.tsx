import type { Candidate, CandidateField } from "../../../../trpc/types";
import { useState, useEffect, useMemo, useCallback } from "react";
import api from "../../api";
import dayjs from 'dayjs'
import { Column, useTable } from "react-table"

export type EnabledColumns = Record<CandidateField, boolean>

const useCanditateTable = (enabledColumns: EnabledColumns) => {
  const requestedFields: string[] = useMemo(() => Object.entries(enabledColumns).filter(([_, value]) => value).map(([key, _]) => key), [enabledColumns])

  const [candidates, setCandidates] = useState<Partial<Candidate>[]>([]);
  const [numberOfRecords, setNumberOfRecords] = useState(0);

  // TODO: implement this using React Query
  const fetchCandidates = useCallback(async (pageNumber = 1) => {
    const { candidates, numberOfRecords } = await api.candidates.all.query({ requestedFields, pageNumber });
    setCandidates(candidates);
    setNumberOfRecords(numberOfRecords);
  }, [requestedFields]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const onPageChange = useCallback((pageNumber: number) => {
    fetchCandidates(pageNumber)
  }, [fetchCandidates])

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
      // @ts-ignore
      { Header: "Razones", accessor: "reason", Cell: ({ value }) => <div className="pills">{formatReasons(value)}</div> },
    ].filter(column => requestedFields.includes(column.accessor as string))
      .map((column) => ({
        ...column,
        accessor: column.accessor as keyof Partial<Candidate>,
      })),
    [requestedFields]
  )

  return {
    numberOfRecords,
    onPageChange,
    ...useTable<Partial<Candidate>>({
      columns,
      data: candidates,
    })
  }
}

function formatLink(value: string) {
  return <a href={value} target="blank">{`🔗 Ver`}</a>;
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

function formatReasons(values: string[]) {
  return values.map(value => <span key={value} className="pill">{value}</span>);
}

export default useCanditateTable;
