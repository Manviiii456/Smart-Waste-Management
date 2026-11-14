
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Analytics from "./Analytics";
import Reports from "./Reports";
const API = "http://127.0.0.1:8000";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    location: "",
    description: ""
  });

  const loadComplaints = async () => {
    try {
      const response = await axios.get(`${API}/complaints`);
      setComplaints(response.data);
    } catch (error) {
      console.error("Unable to load complaints", error);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === "Pending").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;
  const assigned = complaints.filter(c => c.status === "Assigned").length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${API}/complaints`, form);

      setMessage(response.data.message);

      setForm({
        name: "",
        category: "",
        location: "",
        description: ""
      });

      await loadComplaints();
      setActivePage("Dashboard");

    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
        "Unable to submit complaint. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: "▦" },
    { name: "Report Complaint", icon: "＋" },
    { name: "Complaints", icon: "▤" },
    { name: "Waste Guide", icon: "♻" },
    { name: "Analytics", icon: "📊" },
    { name: "Reports", icon: "📊" },
{ name: "About", icon: "ⓘ" }
  ];

  return (
    <div className="app-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">♻</div>
          <div>
            <h2>EcoTrack</h2>
            <span>SMART WASTE MANAGEMENT</span>
          </div>
        </div>

        <p className="menu-heading">MAIN MENU</p>

        <div className="menu-list">
          {menuItems.map(item => (
            <button
              key={item.name}
              className={`menu-item ${activePage === item.name ? "active" : ""}`}
              onClick={() => {
                setActivePage(item.name);
                setMessage("");
              }}
            >
              <span className="menu-icon">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span>🌱</span>
            <h4>Keep it green!</h4>
            <p>Small actions today create a cleaner tomorrow.</p>
          </div>

          <div className="sidebar-footer">
            <div className="profile-avatar">M</div>
            <div>
              <strong>Project User</strong>
              <span>Community Member</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        <header className="topbar">
          <div>
            <h3>{activePage}</h3>
            <p>Smart Waste Management System</p>
          </div>

          <div className="topbar-right">
            <span className="online-status">
              <span></span> System Online
            </span>
            <div className="top-avatar">M</div>
          </div>
        </header>

        <div className="page-content">

          {/* DASHBOARD */}
          {activePage === "Dashboard" && (
            <>
              <section className="welcome-banner">
                <div>
                  <span className="banner-tag">CLEANER COMMUNITIES, BETTER FUTURE</span>
                  <h1>Let's Make Our Surroundings Cleaner!</h1>
                  <p>
                    Report waste issues, monitor complaints and
                    contribute towards a cleaner environment.
                  </p>
                  <button
                    className="banner-button"
                    onClick={() => setActivePage("Report Complaint")}
                  >
                    + Report Waste
                  </button>
                </div>
                <div className="banner-art">🌿</div>
              </section>

              <div className="section-heading">
                <div>
                  <h2>Overview</h2>
                  <p>Summary of registered waste complaints</p>
                </div>
                <button className="refresh-button" onClick={loadComplaints}>
                  ↻ Refresh
                </button>
              </div>

              <section className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon green">▤</div>
                  <p>Total Complaints</p>
                  <h2>{total}</h2>
                  <span>All registered complaints</span>
                </div>

                <div className="stat-card">
                  <div className="stat-icon orange">◷</div>
                  <p>Pending Complaints</p>
                  <h2>{pending}</h2>
                  <span>Waiting for action</span>
                </div>

                <div className="stat-card">
                  <div className="stat-icon blue">✓</div>
                  <p>Resolved Complaints</p>
                  <h2>{resolved}</h2>
                  <span>Successfully resolved</span>
                </div>

                <div className="stat-card">
                  <div className="stat-icon purple">↗</div>
                  <p>Assigned Complaints</p>
                  <h2>{assigned}</h2>
                  <span>Assigned for collection</span>
                </div>
              </section>

              <section className="dashboard-grid">

                <div className="content-card recent-card">
                  <div className="card-heading">
                    <div>
                      <h3>Recent Complaints</h3>
                      <p>Latest waste reports submitted</p>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => setActivePage("Complaints")}
                    >
                      View All →
                    </button>
                  </div>

                  {complaints.length === 0 ? (
                    <div className="empty-state">
                      <span>📋</span>
                      <h3>No complaints yet</h3>
                      <p>New waste complaints will appear here.</p>
                    </div>
                  ) : (
                    <div className="table-wrapper">
                      <table>
                        <thead>
                          <tr>
                            <th>Category</th>
                            <th>Location</th>
                            <th>Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {complaints.slice(0, 5).map((c) => (
                            <tr key={c._id}>
                              <td>{c.category}</td>
                              <td>{c.location}</td>
                              <td>
                                {c.created_at
                                  ? new Date(c.created_at).toLocaleDateString()
                                  : "-"}
                              </td>
                              <td>
                                <span className={`status ${c.status?.toLowerCase().replaceAll(" ", "-")}`}>
                                  {c.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="content-card quick-card">
                  <h3>Quick Actions</h3>
                  <p>What would you like to do?</p>

                  <button onClick={() => setActivePage("Report Complaint")}>
                    <span className="quick-icon">＋</span>
                    <span>
                      <strong>Report Waste</strong>
                      <small>Submit a new complaint</small>
                    </span>
                    <b>→</b>
                  </button>

                  <button onClick={() => setActivePage("Complaints")}>
                    <span className="quick-icon">▤</span>
                    <span>
                      <strong>View Complaints</strong>
                      <small>Check reported waste issues</small>
                    </span>
                    <b>→</b>
                  </button>

                  <button onClick={() => setActivePage("Waste Guide")}>
                    <span className="quick-icon">♻</span>
                    <span>
                      <strong>Waste Segregation</strong>
                      <small>Learn proper waste disposal</small>
                    </span>
                    <b>→</b>
                  </button>
                </div>

              </section>

              <section className="awareness-banner">
                <div>
                  <span>♻ WASTE SEGREGATION MATTERS</span>
                  <h3>Segregate Today, Save Tomorrow.</h3>
                  <p>Separate wet, dry and recyclable waste for a healthier environment.</p>
                </div>
                <button onClick={() => setActivePage("Waste Guide")}>
                  Explore Waste Guide →
                </button>
              </section>
            </>
          )}

          {/* REPORT COMPLAINT */}
          {activePage === "Report Complaint" && (
            <section className="form-page">
              <div className="page-intro">
                <span>HOME / REPORT COMPLAINT</span>
                <h2>Report a Waste Issue</h2>
                <p>Help us identify and address waste management problems in your area.</p>
              </div>

              <div className="content-card form-card">
                <h3>Complaint Details</h3>
                <p>Enter the details of the waste issue below.</p>

                <form onSubmit={handleSubmit}>
                  <label>Your Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    required
                  />

                  <label>Complaint Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({...form, category: e.target.value})}
                    required
                  >
                    <option value="">Select category</option>
                    <option>Overflowing Dustbin</option>
                    <option>Illegal Dumping</option>
                    <option>Uncollected Waste</option>
                  </select>

                  <label>Waste Location</label>
                  <input
                    type="text"
                    placeholder="Enter the location"
                    value={form.location}
                    onChange={e => setForm({...form, location: e.target.value})}
                    required
                  />

                  <label>Problem Description</label>
                  <textarea
                    placeholder="Describe the waste issue..."
                    value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                    required
                  />

                  <button className="submit-button" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Complaint →"}
                  </button>

                  {message && <p className="form-message">{message}</p>}
                </form>
              </div>
            </section>
          )}

          {/* COMPLAINTS */}
          {activePage === "Complaints" && (
            <section className="content-card complaints-page">
              <div className="page-intro">
                <span>HOME / COMPLAINTS</span>
                <h2>Waste Complaints</h2>
                <p>View all complaints registered in the system.</p>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Complaint ID</th>
                      <th>Reported By</th>
                      <th>Category</th>
                      <th>Location</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map(c => (
                      <tr key={c._id}>
                        <td>#{c._id.slice(-6)}</td>
                        <td>{c.name}</td>
                        <td>{c.category}</td>
                        <td>{c.location}</td>
                        <td>
                          {c.created_at
                            ? new Date(c.created_at).toLocaleDateString()
                            : "-"}
                        </td>
                        <td>
                          <span className={`status ${c.status?.toLowerCase().replaceAll(" ", "-")}`}>
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {complaints.length === 0 && (
                  <div className="empty-state">No complaints registered yet.</div>
                )}
              </div>
            </section>
          )}

          {/* WASTE GUIDE */}
          {activePage === "Waste Guide" && (
            <section className="guide-page">
              <div className="page-intro">
                <span>HOME / WASTE GUIDE</span>
                <h2>Know Your Waste</h2>
                <p>Learn how to separate waste and dispose of it responsibly.</p>
              </div>

              <div className="guide-grid">
                <div className="guide-card wet">
                  <div>🍃</div>
                  <h3>Wet Waste</h3>
                  <p>Biodegradable waste that can decompose naturally.</p>
                  <strong>Examples</strong>
                  <ul>
                    <li>Fruit and vegetable peels</li>
                    <li>Leftover food</li>
                    <li>Tea leaves</li>
                  </ul>
                </div>

                <div className="guide-card dry">
                  <div>📦</div>
                  <h3>Dry Waste</h3>
                  <p>Non-biodegradable materials that can often be recycled.</p>
                  <strong>Examples</strong>
                  <ul>
                    <li>Paper and cardboard</li>
                    <li>Plastic packaging</li>
                    <li>Metal containers</li>
                  </ul>
                </div>

                <div className="guide-card recycle">
                  <div>♻️</div>
                  <h3>Recyclable Waste</h3>
                  <p>Materials that can be processed and reused.</p>
                  <strong>Examples</strong>
                  <ul>
                    <li>Glass bottles</li>
                    <li>Clean paper</li>
                    <li>Suitable plastic containers</li>
                  </ul>
                </div>
              </div>

              <div className="awareness-banner guide-note">
                <div>
                  <h3>Every small action counts!</h3>
                  <p>Segregating waste at the source makes collection and recycling easier.</p>
                </div>
              </div>
            </section>
          )}

          {/* ANALYTICS */}
{activePage === "Analytics" && (
  <Analytics complaints={complaints} />
)}
{/* ANALYTICS */}
{/* REPORTS */}
{activePage === "Reports" && (
  <Reports />
)}

{/* ABOUT */}


          {activePage === "About" && (
            <section className="content-card about-page">
              <div className="about-symbol">🌱</div>
              <h2>About EcoTrack</h2>
              <p>
                EcoTrack is a Smart Waste Management System designed to
                provide a centralized platform for reporting waste-related
                complaints, monitoring their status and promoting proper
                waste segregation.
              </p>
              <h3>Our Mission</h3>
              <p>
                To encourage responsible waste disposal and support cleaner,
                healthier communities through technology.
              </p>
            </section>
          )}

          <footer className="page-footer">
            <span>EcoTrack © 2026 Smart Waste Management System</span>
            <span>Building a cleaner tomorrow 🌿</span>
          </footer>

        </div>
      </main>
    </div>
  );
}

export default App;
