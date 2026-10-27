
import { useState } from "react";
import { panggil, GalatApi } from "../lib/api.js";

export default function Test() {
  const [message, setMessage] = useState("Hello from frontend");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [debugLogs, setDebugLogs] = useState([]);

  async function handleHello() {
    setLoading(true);
    setReply("");
    setError("");
    setDebugLogs([]);

    const onDebug = (event) => {
      setDebugLogs((previous) => [
        ...previous,
        {
          ...event,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    };

    try {
      const data = await panggil("/api/hello", {
        method: "POST",
        body: { message },
        onDebug,
      });

      setReply(data.reply);
    } catch (err) {
      if (err instanceof GalatApi) {
        setError(`${err.message} (status: ${err.status})`);
      } else {
        setError(err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "24px",
        fontFamily: "monospace",
      }}
    >
      <h1>Hello API Encryption Debugger</h1>

      <label htmlFor="message">Message</label>

      <input
        id="message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        style={{
          display: "block",
          boxSizing: "border-box",
          width: "100%",
          padding: "10px",
          margin: "8px 0 12px",
        }}
      />

      <button
        onClick={handleHello}
        disabled={loading || !message.trim()}
        style={{ padding: "10px 16px" }}
      >
        {loading ? "Sending..." : "Call Hello API"}
      </button>

      {reply && (
        <p style={{ color: "green" }}>
          API reply: {reply}
        </p>
      )}

      {error && (
        <p style={{ color: "red" }}>
          Error: {error}
        </p>
      )}

      <h2>Encryption Debug Log</h2>

      {debugLogs.length === 0 && (
        <p>No debug events yet.</p>
      )}

      <div style={{ display: "grid", gap: "16px" }}>
        {debugLogs.map((log, index) => (
          <section
            key={`${log.stage}-${index}`}
            style={{
              border: "1px solid #888",
              borderRadius: "8px",
              padding: "16px",
              overflow: "hidden",
            }}
          >
            <h3 style={{ marginTop: 0 }}>
              {index + 1}. {log.stage}
            </h3>

            <small>{log.timestamp}</small>

            <pre
              style={{
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
                fontSize: "12px",
                lineHeight: 1.5,
              }}
            >
              {JSON.stringify(log, null, 2)}
            </pre>
          </section>
        ))}
      </div>
    </main>
  );
}

