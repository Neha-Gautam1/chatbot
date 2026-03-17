import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const message = req.body.Body as string;

    console.log("User:", message);

    // 👉 chatbot logic
    const reply = getBotReply(message);

    const twiml = `
      <Response>
        <Message>${reply}</Message>
      </Response>
    `;

    res.setHeader("Content-Type", "text/xml");
    res.status(200).send(twiml);
  } else {
    res.status(405).end(); // method not allowed
  }
}

// 👉 simple bot function
function getBotReply(msg: string): string {
  return "Bot reply: " + msg;
}