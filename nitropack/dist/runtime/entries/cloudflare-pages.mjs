import "#internal/nitro/virtual/polyfill";
import { requestHasBody, useRequestBody } from "nitropack/dist/runtime/utils";
import { nitroApp } from "nitropack/dist/runtime/app";

export default {
  async fetch(request, env, context) {
    return await handleEvent(request, env, context);
  }
};
async function handleEvent(request, env, context) {
  try {
    return await env.ASSETS.fetch(request, { cacheControl: assetsCacheControl });
  } catch (_err) {
  }
  const url = new URL(request.url);
  let body;
  if (requestHasBody(request)) {
    body = await useRequestBody(request);
  }
  const r = await nitroApp.localCall({
    context,
    url: url.pathname + url.search,
    host: url.hostname,
    protocol: url.protocol,
    headers: request.headers,
    method: request.method,
    redirect: request.redirect,
    body
  });
  return new Response(r.body, {
    headers: r.headers,
    status: r.status,
    statusText: r.statusText
  });
}
function assetsCacheControl(_request) {
  return {};
}
