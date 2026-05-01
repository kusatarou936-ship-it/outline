export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { id } = req.query;
  const base = process.env.NEXT_PUBLIC_WORKER_URL;
  const url = `${base}/thumbnail/${id}`;

  if (req.method === "GET") {
    const response = await fetch(url);
    res.setHeader("Content-Type", response.headers.get("Content-Type") || "image/jpeg");
    const buf = Buffer.from(await response.arrayBuffer());
    res.status(response.status).send(buf);
    return;
  }

  if (req.method === "DELETE") {
    const response = await fetch(url, { method: "DELETE" });
    res.status(response.status).end();
    return;
  }

  res.status(405).end();
}
