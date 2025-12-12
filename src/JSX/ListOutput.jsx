export default function ListOutput({ data, table }) {
  return (
    <section className="py-5">
      <div className="container bg-white p-4 rounded">
        <h2 className="mb-4 text-capitalize">{table}</h2>
        <table className="table border table-striped">
          <thead>
            <tr>
              {data[0]?.record?.map((head, ind) => (
                <th scope="col" key={ind}>
                  {head.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map((dt, ind) => (
              <tr>
                {dt.record.map((rcd, ind) => (
                  <td
                  // onMouseDown={(e) => {
                  //   callform(e, table, data[0].record[0].value);
                  // }}
                  >
                    {rcd.value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
