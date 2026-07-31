function acceptsHtml(request) {
  return request.method === "GET" && (request.headers.get("accept") ?? "").includes("text/html");
}

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404 || !acceptsHtml(request)) {
      return response;
    }

    const shellUrl = new URL("/index.html", request.url);
    return env.ASSETS.fetch(new Request(shellUrl, request));
  }
};
