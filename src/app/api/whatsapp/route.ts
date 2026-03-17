export default async function handler(req, res) {
  if (req.method === "POST") {
    const message = req.body.Body; // incoming message

    console.log("User:", message);

    // 👉 Your chatbot logic
    const reply = getBotReply(message);

    const response = `
      <Response>
        <Message>${reply}</Message>
      </Response>
    `;

    res.setHeader("Content-Type", "text/xml");
    res.status(200).send(response);
  }
}

function getBotReply(msg) {
  return "Bot reply: " + msg;
}