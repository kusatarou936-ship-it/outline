export const onRequest: PagesFunction = async ({ request, next }) => {
  const url = new URL(request.url);
  const path = url.pathname;

  // API はキャッシュしない
  if (path.startsWith("/api/")) {
    return next();
  }

  // サムネイル（R2）は immutable
  if (path.startsWith("/thumbnails/")) {
    const res = await next();
    res.headers.set("Cache-Control", "public, max-age=31536000, immutable");
    return res;
  }

  // OGP は 1日キャッシュ
  if (path.startsWith("/ogp")) {
    const res = await next();
    res.headers.set("Cache-Control", "public, max-age=86400");
    return res;
  }

  // トップページは 60秒キャッシュ
  if (path === "/") {
    const res = await next();
    res.headers.set("Cache-Control", "public, max-age=60");
    return res;
  }

  // 詳細ページは 30秒キャッシュ
  if (path.startsWith("/work/")) {
    const res = await next();
    res.headers.set("Cache-Control", "public, max-age=30");
    return res;
  }

  // その他はデフォルト
  return next();
};
