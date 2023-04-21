import type { Candidate } from "../../../trpc/types";
import { useState, useEffect, useMemo } from "react";
import api from "../api";
import "./Candidates.css";
import dayjs from 'dayjs'
import { Column, useTable } from "react-table"

export const Candidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      // TODO: fetch only a few columns
      const candidates = await api.candidates.all.query();
      setCandidates(candidates);
    };

    fetchCandidates();
  }, []);

  const columns = useMemo<Column<Candidate>[]>(
    () => [
      { Header: "Nombre", accessor: "name" },
      { Header: "DNI", accessor: "document" },
      { Header: "Zonajobs", accessor: "cv_zonajobs", Cell: ({ value }) => formatLink(value) },
      { Header: "Bumeran", accessor: "cv_bumeran", Cell: ({ value }) => formatLink(value) },
      { Header: "Teléfono", accessor: "phone" },
      { Header: "Email", accessor: "email" },
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
      { Header: "Razones", accessor: "reason", Cell: ({ value }) => <div className="pills">{formatReasons(value)}</div> },
    ],
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<Candidate>({
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