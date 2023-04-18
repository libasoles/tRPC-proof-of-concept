import './App.css';
import * as React from "react";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import * as data from './testData';

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/">
          <Route index element={
            <>
              <div><nav><ul><li><Link to="/">Home</Link></li><li><Link to="/foo">Candidates</Link></li></ul></nav><hr /><Outlet /></div>
              <div style={{ textAlign: 'left' }}>
                <h1>Assignment</h1>
                <h2>Part one</h2>
                <p>Like you may already know, Emi is used by huge companies to massively screen candidates. They apply through a job board like Zona Jobs,
                Bumeran, Indeed, etc. Once they apply, they receive an SMS and an e-mail to start chatting with Emi.</p>
                <p>Then, when the screeing interview is finished, the results are processed by a backend application that
                classifies candidates in two groups: <i>approved</i> and <i>rejected</i>.</p>
                <h2>Your goal:</h2>
                <ul>
                  <li>Create a new backend application that provides the necessary endpoints to retrieve the hardcoded in testData.js. You can use any programming language or framework you feel comfortable with (we suggest using Node).</li>
                  <li>Then, use this new backend to fetch the candidates and the columns to display (not all recruiters want to see the same data).</li>
                  <li>List all candidates.</li>
                  <li>Add (or at least, name) other desirable features you can think of, for this list view.</li>
                </ul>
                <p>Note: How do we know if a candidate was approved or rejected? Each candidate has a 'reason' field. If the
                  field is empty it means that the candidate was approved. On the other hand, if the value is not empty, it
                  means that the candidate was rejected. There may be more than one rejection reason. E.g. salary out of range
                  or minimum age not met.</p>
                <br></br>
                <h2>Part two</h2>
                <p>After displaying the data we want to update it.</p>
                <p>The backend learns how to classify candidates with the feedback of recruiters. This is core part of the
                  feedback loop for this AI.</p>
                <p>This is why recruiters may occasionally need to re-classify a candidate. This is a manual process that is
                  done based on the results that are shown on the previous step.</p>
                <h1>Your task:</h1>
                <p>Allow the recruiters to reclassify candidates.</p>
                <h4>Manually approving a candidate</h4>
                <ol>
                  <li>Hit the API endpoint to remove the rejection reasons assigned to a candidate.</li>
                  <li>Make sure the table is refreshed with the new data.</li>
                </ol>
                <h4>Manually rejecting a candidate</h4>
                <ol>
                  <li>Hit the API to list all the available rejection reasons.</li>
                  <li>Let the recruiter select one or more rejection reasons.</li>
                  <li>Hit the API again to update that candidate's data.</li>
                </ol>
                <p>Note: for this second part, you are allowed to handle state locally, so just add dummy endpoints in your API to be able to do so.</p>
                <br></br>
                <h1>Guidelines for part 1 and 2</h1>
                <ol>
                  <li>This is a productive application, so it's expected you make changes you would do as if you were working in a real environment.</li>
                  <li>Adapt and create React components using the application in this repository to solve the previous requirements.</li>
                </ol>
              </div>
            </>
          } />
          <Route path="foo" element={
              <>
                <div><nav><ul><li><Link to="/">Home</Link></li><li><Link to="/foo">Candidates</Link></li></ul></nav><hr /><Outlet /></div>
                <div>Your job ;)<table>{data.candidates.map(c => <tr>{Object.keys(c).map(k => <td>{c[k]}</td>)}</tr>)}</table></div>
              </>
          } />
        </Route>
      </Routes>
    </div>
  );
}