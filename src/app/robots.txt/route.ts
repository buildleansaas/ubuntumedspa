// Hand-rendered because Next's MetadataRoute.Robots cannot emit the Content-Signal directive.
export const dynamic = "force-static";

const body = `User-Agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=yes
Allow: /

Sitemap: https://www.williamsburgmedspa.com/sitemap.xml
`;

export function GET() {
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
