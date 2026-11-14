
function Analytics({ complaints = [] }) {
  const total = complaints.length;

  const pending = complaints.filter(
    (c) => c.status === "Pending"
  ).length;

  const resolved = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  const assigned = complaints.filter(
    (c) => c.status === "Assigned"
  ).length;

  const getPercent = (value) =>
    total === 0 ? 0 : (value / total) * 100;

  return (
    <div className="page-content">
      <div className="page-intro">
        <span>HOME / ANALYTICS</span>
        <h2>Waste Analytics</h2>
        <p>Monitor and analyze waste complaints.</p>
      </div>

      <section className="stats-grid">
        <div className="stat-card">
          <h3>Total Complaints</h3>
          <h2>{total}</h2>
        </div>

        <div className="stat-card">
          <h3>Pending</h3>
          <h2>{pending}</h2>
        </div>

        <div className="stat-card">
          <h3>Resolved</h3>
          <h2>{resolved}</h2>
        </div>

        <div className="stat-card">
          <h3>Assigned</h3>
          <h2>{assigned}</h2>
        </div>
      </section>

      <section className="content-card">
        <h2>Complaint Status Analysis</h2>

        {[
          { name: "Pending", value: pending },
          { name: "Resolved", value: resolved },
          { name: "Assigned", value: assigned },
        ].map((item) => (
          <div key={item.name} style={{ marginBottom: "20px" }}>
            <p>
              {item.name}: {item.value}
            </p>

            <div style={{
              background: "#e5e7eb",
              height: "14px",
              borderRadius: "10px",
              overflow: "hidden"
            }}>
              <div style={{
                width: `${getPercent(item.value)}%`,
                background: "#16a34a",
                height: "100%",
                borderRadius: "10px"
              }} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Analytics;
