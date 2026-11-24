export function GET() {
  return new Response("google-site-verification: google608401da6e5be338.html\n", {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
