import type { Candidate, CandidateField } from "../../../trpc/types";
import { useState, useEffect, useMemo } from "react";
import api from "../api";
import "./Candidates.css";
import dayjs from 'dayjs'
import { Column, useTable } from "react-table"

type EnabledColumns = Record<CandidateField, boolean>

const useCanditateTable = (enabledColumns: EnabledColumns) => {
  const requestedFields: string[] = useMemo(() => Object.entries(enabledColumns).filter(([_, value]) => value).map(([key, _]) => key), [enabledColumns])

  const [candidates, setCandidates] = useState<Partial<Candidate>[]>([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      // TODO: fetch only a few columns
      const candidates = await api.candidates.all.query({ requestedFields });
      setCandidates(candidates);
    };

    fetchCandidates();
  }, [requestedFields]);

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

  return useTable<Partial<Candidate>>({
    columns,
    data: candidates,
  })
}

type Props = { enabledColumns: EnabledColumns }

export const Candidates = ({ enabledColumns }: Props) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useCanditateTable(enabledColumns)

  return (
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
  );
};

function formatLink(value: string) {
  return <a href={value}>{`🔗 Ver`}</a>;
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