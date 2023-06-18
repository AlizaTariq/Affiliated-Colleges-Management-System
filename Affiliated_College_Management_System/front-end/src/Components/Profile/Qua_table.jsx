import React from "react";

const QuaTable = ({ headings, data, keys }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Degree Title</th>
          <th scope="col">Institution Name</th>
          <th scope="col">Starting Date</th>
          <th scope="col">Ending Date</th>
          <th scope="col">Transcript latter</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((item, index) => (
          <tr>
            <th scope="row">{index + 1}</th>
            <td>{item?.degree_title}</td>
            <td>{item?.institution_name}</td>
            <td>{item?.starting_date}</td>
            <td>{item?.ending_date}</td>
            <td>
              <a
                href="/assets/transcripts/11062023172842,25.pdf"
                target="_blank"
              >
                {item?.transcript}
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default QuaTable;
