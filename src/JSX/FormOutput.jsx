export default function FormOutput({ data, table }) {
  const strTypes = ["String", "email", "reference", "int", "long"];

  const getFeilds = (label, type, value) => {
    if (type === "boolean") {
      return (
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={value === "true"}
            disabled
          />
          <label className="form-check-label fw-semibold">{label.name}</label>
        </div>
      );
    }
    if (strTypes.includes(type)) {
      if (type === "reference") {
        return (
          <div>
            <label className="form-label mb-1 fw-semibold">{label.name}</label>
            <input
              type="text"
              className="form-control"
              value={value.name}
              disabled
            />
          </div>
        );
      }
      return (
        <div>
          <label className="form-label mb-1 fw-semibold">{label.name}</label>
          <input type="text" className="form-control" value={value} disabled />
        </div>
      );
    }
    if (type === "date") {
      return (
        <div>
          <label className="form-label mb-1 fw-semibold">{label.name}</label>
          <input type="date" className="form-control" value={value} disabled />
        </div>
      );
    }
    if (type === "time") {
      return (
        <div>
          <label className="form-label mb-1 fw-semibold">{label.name}</label>
          <input type="time" className="form-control" value={value} disabled />
        </div>
      );
    }
    if (type === "datetime") {
      return (
        <div>
          <label className="form-label mb-1 fw-semibold">{label.name}</label>
          <input type="datetime-local" className="form-control" value={value} />
        </div>
      );
    }
    if (type === "long_description") {
      return (
        <div className="mb-3">
          <label className="form-label mb-1 fw-semibold">{label.name}</label>
          <textarea className="form-control" rows="3" value={value}></textarea>
        </div>
      );
    }
  };
  return (
    <section className="py-5">
      <div className="container  bg-white p-4 rounded">
        <h2 className="mb-4 text-center text-capitalize">{table}</h2>
        <form className="row g-3">
          {data.map(
            (rcd, ind) =>
              rcd.uivalid.visible === "true" && (
                <div
                  key={ind}
                  className={`${
                    rcd.type === "boolean" ? "col-12" : "col-md-6"
                  }`}
                >
                  {getFeilds(rcd.label, rcd.type, rcd.value)}
                </div>
              )
          )}
        </form>
      </div>
    </section>
  );
}
