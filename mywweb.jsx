
import { useState } from "react";
import "./index.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [chats, setChats] = useState({});
  const [activeChat, setActiveChat] = useState(null);

  function login(role) {
    const name = prompt("Enter your name:");
    if (!name) return;
    setUser({ name, role });
  }

  function logout() {
    setUser(null);
    setJobs([]);
    setChats({});
    setActiveChat(null);
  }

  function postJob(title, desc, budget) {
    if (!title || !desc || !budget) return alert("Please fill all fields");
    setJobs((prev) => [
      ...prev,
      { id: Date.now(), client: user.name, title, desc, budget, applicants: [] },
    ]);
    alert("Job posted successfully!");
  }

  function applyToJob(jobId) {
    setJobs((prev) =>
      prev.map((job) => {
        if (job.id !== jobId) return job;
        if (job.applicants.some((a) => a.devName === user.name)) {
          alert("You already applied!");
          return job;
        }
        alert("Applied successfully!");
        openChat(job.client);
        return {
          ...job,
          applicants: [...job.applicants, { devName: user.name }],
        };
      })
    );
  }

  function openChat(name) {
    const key = [user.name, name].sort().join("-");
    if (!chats[key]) setChats((prev) => ({ ...prev, [key]: [] }));
    setActiveChat(key);
  }

  function sendMessage(text) {
    if (!text) return;
    setChats((prev) => ({
      ...prev,
      [activeChat]: [
        ...(prev[activeChat] || []),
        { sender: user.name, text },
      ],
    }));
  }

  return (
    <div>
      <header
        style={{
          background: "#2563eb",
          color: "white",
          padding: "15px 25px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>DevConnect</h1>
        {user ? (
          <div>
            {user.name} ({user.role}){" "}
            <button
              className="btn btn-red"
              onClick={logout}
              style={{
                background: "#dc2626",
                color: "white",
                border: "none",
                padding: "6px 10px",
                borderRadius: "5px",
              }}
            >
              Logout
            </button>
          </div>
        ) : null}
      </header>

      {!user ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <h2>Welcome to DevConnect</h2>
          <p>Connect Clients and Developers seamlessly!</p>
          <div>
            <button
              onClick={() => login("client")}
              style={{
                background: "white",
                color: "#2563eb",
                fontWeight: "bold",
                padding: "10px 15px",
                margin: "5px",
                borderRadius: "5px",
                border: "none",
              }}
            >
              Login as Client
            </button>
            <button
              onClick={() => login("dev")}
              style={{
                background: "white",
                color: "#2563eb",
                fontWeight: "bold",
                padding: "10px 15px",
                margin: "5px",
                borderRadius: "5px",
                border: "none",
              }}
            >
              Login as Developer
            </button>
          </div>
        </div>
      ) : (
        <main style={{ display: "flex", height: "calc(100vh - 70px)" }}>
          {/* LEFT PANEL */}
          <div
            style={{
              flex: 1,
              borderRight: "1px solid #ddd",
              padding: "15px",
              overflowY: "auto",
            }}
          >
            {user.role === "client" ? (
              <>
                <h2>Post a Job</h2>
                <input id="title" placeholder="Job Title" style={inputStyle} />
                <textarea
                  id="desc"
                  placeholder="Job Description"
                  style={inputStyle}
                />
                <input id="budget" placeholder="Budget ($)" style={inputStyle} />
                <button
                  className="btn btn-blue"
                  style={btnBlue}
                  onClick={() =>
                    postJob(
                      document.getElementById("title").value,
                      document.getElementById("desc").value,
                      document.getElementById("budget").value
                    )
                  }
                >
                  Post Job
                </button>
              </>
            ) : (
              <>
                <h2>Your Profile</h2>
                <input
                  id="skills"
                  placeholder="Your Skills (HTML, React...)"
                  style={inputStyle}
                />
                <button
                  className="btn btn-green"
                  style={btnGreen}
                  onClick={() => alert("Profile updated!")}
                >
                  Save Profile
                </button>
              </>
            )}
          </div>

          {/* CENTER PANEL */}
          <div
            style={{
              flex: 1,
              borderRight: "1px solid #ddd",
              padding: "15px",
              overflowY: "auto",
            }}
          >
            <h2>
              {user.role === "client" ? "Your Jobs" : "Available Jobs"}
            </h2>
            {jobs.length === 0 && <p>No jobs posted yet.</p>}
            {jobs.map((job) => (
              <div
                key={job.id}
                style={{
                  background: "white",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <h3 style={{ color: "#2563eb" }}>{job.title}</h3>
                <p>{job.desc}</p>
                <small>Budget: ${job.budget}</small>
                <br />
                {user.role === "dev" ? (
                  <button
                    style={btnBlue}
                    onClick={() => applyToJob(job.id)}
                  >
                    Apply
                  </button>
                ) : (
                  job.applicants.length > 0 && (
                    <>
                      <p><strong>Applicants:</strong></p>
                      {job.applicants.map((a, i) => (
                        <button
                          key={i}
                          onClick={() => openChat(a.devName)}
                          style={{
                            background: "#e5e7eb",
                            border: "none",
                            borderRadius: "5px",
                            margin: "2px",
                            padding: "6px 10px",
                            cursor: "pointer",
                          }}
                        >
                          {a.devName}
                        </button>
                      ))}
                    </>
                  )
                )}
              </div>
            ))}
          </div>

          {/* RIGHT PANEL */}
          <div style={{ flex: 1, padding: "15px" }}>
            <h2>Chat</h2>
            {!activeChat ? (
              <p>No chat open.</p>
            ) : (
              <>
                <div
                  style={{
                    height: "65vh",
                    background: "white",
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    padding: "10px",
                    overflowY: "auto",
                  }}
                >
                  {(chats[activeChat] || []).map((m, i) => (
                    <div
                      key={i}
                      style={{
                        textAlign:
                          m.sender === user.name ? "right" : "left",
                        margin: "5px 0",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          background:
                            m.sender === user.name
                              ? "#2563eb"
                              : "#e5e7eb",
                          color:
                            m.sender === user.name ? "white" : "black",
                          padding: "6px 10px",
                          borderRadius: "10px",
                        }}
                      >
                        {m.text}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", marginTop: "5px" }}>
                  <input
                    id="chat"
                    placeholder="Type a message..."
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendMessage(e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                  <button
                    style={btnBlue}
                    onClick={() => {
                      const val = document.getElementById("chat").value;
                      sendMessage(val);
                      document.getElementById("chat").value = "";
                    }}
                  >
                    Send
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      )}
    </div>
  );
}

// shared styles
const inputStyle = {
  width: "100%",
  margin: "5px 0",
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "5px",
};
const btnBlue = { background: "#2563eb", color: "white", border: "none", padding: "8px 12px", borderRadius: "5px", cursor: "pointer" };
const btnGreen = { background: "#16a34a", color: "white", border: "none", padding: "8px 12px", borderRadius: "5px", cursor: "pointer" };
