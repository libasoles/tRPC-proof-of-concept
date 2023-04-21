import type { Candidate } from "../../../trpc/types";
import { useState, useEffect, useMemo } from "react";
import api from "../api";
import "./Candidates.css";
import dayjs from 'dayjs'
import { Column, useTable } from "react-table"

// TODO: move to a config file or somewhere else
export const enabledColumns = {
  id: true,
  name: true,
  document: true,
  cv_zonajobs: true,
  cv_bumeran: false,
  phone: true,
  email: true,
  date: true,
  age: true,
  has_university: false,
  career: true,
  graduated: false,
  courses_approved: true,
  location: true,
  accepts_working_hours: false,
  desired_salary: true,
  had_interview: false,
  reason: true,
};

export const Candidates = () => {
  const [candidates, setCandidates] = useState<Partial<Candidate>[]>([]);

  const requiredFields: string[] = useMemo(() => Object.entries(enabledColumns).filter(([_, value]) => value).map(([key, _]) => key), [])

  useEffect(() => {
    const fetchCandidates = async () => {
      // TODO: fetch only a few columns
      const candidates = await api.candidates.all.query({ requiredFields });
      setCandidates(candidates);
    };

    fetchCandidates();
  }, [requiredFields]);

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
      { Header: "Universitario", accessor: "has_university" },
      { Header: "Carrera", accessor: "career" },
      { Header: "Graduado", accessor: "graduated" },
      { Header: "Materias a probadas", accessor: "courses_approved" },
      { Header: "Ubicacion", accessor: "location" },
      { Header: "Acepta carga horaria", accessor: "accepts_working_hours" },
      { Header: "Expectativa salarial", accessor: "desired_salary" },
      { Header: "Fue entrevistado", accessor: "had_interview" },
      // @ts-ignore
      { Header: "Razones", accessor: "reason", Cell: ({ value }) => <div className="pills">{formatReasons(value)}</div> },
    ].filter(column => requiredFields.includes(column.accessor as string))
      .map((column) => ({
        ...column,
        accessor: column.accessor as keyof Partial<Candidate>,
      })),
    [requiredFields]
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<Partial<Candidate>>({
    columns,
    data: candidates,
  })

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

function formatReasons(values: string[]) {
  return values.map(value => <span key={value} className="pill">{value}</span>);
}