export async function uploadThumbnail(file: File) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("/api/thumbnail", {
    method: "POST",
    body: form,
  });

  if (!res.ok) throw new Error("Upload failed");

  const data = await res.json();
  return data.id;
}
