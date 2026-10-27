import { useState } from "react";
import { panggil, GalatApi } from "../lib/api";

export default function Test() {
  const [message, setMessage] = useState("Hello from frontend");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleHello() {
    setLoading(true);
    setReply("");
    setError("");

    try {
      const data = await panggil("/api/hello", {
        method: "POST",
        body: { message },
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
        maxWidth: "480px",
        margin: "80px auto",
        padding: "24px",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Hello API Test</h1>

      <label
        htmlFor="message"
        style={{ display: "block", marginBottom: "8px" }}
      >
        Message
      </label>

      <input
        id="message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        style={{
          boxSizing: "border-box",
          width: "100%",
          padding: "10px",
          marginBottom: "12px",
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
        <p style={{ color: "green", marginTop: "20px" }}>Reply: {reply}</p>
      )}

      {error && (
        <p style={{ color: "red", marginTop: "20px" }}>Error: {error}</p>
      )}
    </main>
  );
}
