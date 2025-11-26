// Call backend MCP endpoint
export async function callMcp(tool, input) {
  const response = await fetch("http://localhost:3000/mcp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ tool, input })
  });

  if (!response.ok) {
    throw new Error("Request failed");
  }

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
