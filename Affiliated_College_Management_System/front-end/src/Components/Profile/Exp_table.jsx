import React from "react";

const ExpTable = ({ headings, data,keys }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Job Title</th>
          <th scope="col">Organization Name</th>
          <th scope="col">Reference Email</th>
          <th scope="col">Starting Date</th>
          <th scope="col">Ending Date</th>
          <th scope="col">Experience latter</th>
          
        </tr>
      </thead>
      <tbody>
        {data?.map((item,index)=>(
             <tr>
             <th scope="row">{index+1}</th>
             <td>{item?.job_title}</td>
             <td>{item?.organization_name}</td>
             <td>{item?.reference_email}</td>
             <td>{item?.starting_date}</td>
             <td>{item?.ending_date}</td>
             <td>{item?.experience_latter}</td>
           </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExpTable;
