import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Label,
  LabelList,
  Rectangle,
} from "recharts";

export default function ReportOutput({report}){
  const reportlist = [];
  const selectedReportName = "";
  const pie_colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const bar_colors = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "red",
    "pink",
    "#8884d8",
  ];

  function CustomizedAxisTick({ x, y, stroke, payload }) {
    let val = payload.value;
    let p_val = val.split(` `)[0];
    if (p_val.length > 6) {
      p_val = p_val.substring(0, 6) + "...";
    }
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={-10}
          y={0}
          dy={40}
          textAnchor="left"
          fill="#666"
          transform="rotate(-20)"
          style={{ marginTop: "5rem", marginLeft: "15%" }}
        >
          {p_val}
        </text>
      </g>
    );
  }

  function CustomizedLabel({ x, y, stroke, value }) {
    return (
      <text x={x} y={y} dy={-4} fill={stroke} fontSize={11} textAnchor="middle">
        {value}
      </text>
    );
  }

  function CustomTooltip({
    active,
    payload,
    label,
    reportname,
    reportlist,
    reporttype,
  }) {
    if (active && payload && payload.length) {
      const legendItem = reportlist.find(
        (item) => item.name === payload[0].name
      );
      return (
        <div className="custom-tooltip">
          {reporttype !== "pie" && <p className="label">{`${label}`}</p>}
          <p className="valuee">{`${reportname} : ${payload[0].value}`}</p>
          {legendItem && (
            <div className="legend-item">
              {/* <Rectangle fill="#8884d8" width={10} height={10} /> */}
              <span
                className="legend-icon"
                style={{ backgroundColor: "legendItem.color" }}
              />
              <span className="legend-label">{legendItem.name}</span>
            </div>
          )}
        </div>
      );
    }

    return null;
  }
  return (
    <>
      <div
        className="d-flex flex-column justify-content-center align-items-center border p-3"
        style={{ height: "100%" }}
      >
        <h5>{report.name}</h5>
        {report.data.length > 0 && (
          <>
            {report.type === "line" && (
              <div className="question-container">
                <div
                  style={{
                    width: "100%",
                    overflowX: report.data.length > 5 ? "auto" : "hidden",
                    height: "100%",
                  }}
                >
                  <ResponsiveContainer
                    width={
                      report.data.length > 5 ? report.data.length * 100 : "100%"
                    }
                    height="100%"
                  >
                    <LineChart
                      data={report.data}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                      syncId="anyId"
                    >
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                        height={60}
                        tick={<CustomizedAxisTick />}
                      >
                        <Label
                          value={report.xAxis}
                          offset={39}
                          position="insideTop"
                          scale="point"
                        />
                      </XAxis>
                      <YAxis>
                        <Label
                          value={report.yAxis}
                          angle={-90}
                          position="insideLeft"
                        />
                      </YAxis>
                      <Tooltip
                        wrapperStyle={{ width: 200 }}
                        content={
                          <CustomTooltip
                            reportname={selectedReportName}
                            reportlist={reportlist}
                          />
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8884d8"
                        strokeWidth={2}
                        label={<CustomizedLabel />}
                        activeDot={{ r: 8 }}
                        animationBegin={0}
                        animationDuration={1500}
                        animationEasing="ease-in-out"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {report.type === "bar" && (
              <div className="question-container">
                <div
                  style={{
                    width: "100%",
                    overflowX: report.data.length > 5 ? "auto" : "hidden",
                    height: "100%",
                  }}
                >
                  <ResponsiveContainer
                    width={
                      report.data.length > 5 ? report.data.length * 100 : "100%"
                    }
                    height="100%"
                  >
                    <BarChart
                      data={report.data}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 15,
                      }}
                      barCategoryGap="20%" //{10}
                      barGap="20%" //{5}
                    >
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        interval={0} // Show all labels
                        height={100}
                        tick={<CustomizedAxisTick />}
                        scale="auto"
                      >
                        <Label
                          value={report.xAxis}
                          offset={-5}
                          position="insideBottom"
                        />
                      </XAxis>
                      <YAxis padding={{ top: 20 }}>
                        <Label
                          value={report.yAxis}
                          angle={-90}
                          position="insideLeft"
                        />
                      </YAxis>
                      <Tooltip
                        content={
                          <CustomTooltip
                            reportname={report.name}
                            reportlist={reportlist}
                          />
                        }
                      />
                      <Bar
                        dataKey="value"
                        fill="#8884d8"
                        activeBar={<Rectangle stroke="blue" />} //fill="gold"
                        isAnimationActive={true}
                        animationDuration={600}
                        animationEasing="ease-in-out"
                        barSize={50}
                      >
                        <LabelList dataKey="value" position="top" />
                        {report.data.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={bar_colors[index % bar_colors.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            {report.type === "pie" && (
              <div style={{ height: "400px", width: "100%" }}>
                <ResponsiveContainer
                  width="70%"
                  height="80%"
                  className="container"
                >
                  <PieChart width={600} height={600}>
                    <Pie
                      data={report.data}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={5}
                      label
                      fill="#8884d8"
                    >
                      {report.data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={pie_colors[index % pie_colors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      payload={reportlist.map((entry, index) => ({
                        color: pie_colors[index % pie_colors.length],
                      }))}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {report.type === "horizontalBar" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  width={500}
                  height={300}
                  data={report.data}
                >
                  <XAxis type="number" height={60}>
                    <Label
                      value={report.yAxis}
                      offset={39}
                      position="insideTop"
                    />
                  </XAxis>
                  <YAxis
                    angle={-45}
                    textAnchor="end"
                    interval={0} // Show all labels
                    dataKey="name"
                    type="category"
                  >
                    <Label
                      value={report.xAxis}
                      angle={-90}
                      position="insideLeft"
                    />
                  </YAxis>
                  <Tooltip
                    content={
                      <CustomTooltip
                        reportname={selectedReportName}
                        reportlist={reportlist}
                      />
                    }
                  />
                  <Bar
                    dataKey="value"
                    activeBar={<Rectangle stroke="blue" />} //fill="gold"
                    barSize={40}
                    fill="#8884d8"
                    isAnimationActive={true}
                    animationDuration={600}
                    animationEasing="ease-in-out"
                  >
                    {report.data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={bar_colors[index % bar_colors.length]}
                      />
                    ))}
                    <LabelList position="right" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}

            {report.type === "singleScore" && (
              <div className="position-relative text-center p-4 sc_main_sty">
                <div className="sc_sty"></div>
                {report.data.map((data, indx) => (
                  <div
                    key={indx}
                    className="h5 mb-0 sc_num"
                    // onMouseDown={(e) => goToNewTab(e)}
                  >
                    {data.value}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
