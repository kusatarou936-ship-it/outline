export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const url = process.env.NEXT_PUBLIC_WORKER_URL + "/api/thumbnail";

  const response = await fetch(url, {
    method: "POST",
    body: req,
    headers: req.headers,
  });

  const text = await response.text();
  res.status(response.status).send(text);
}
