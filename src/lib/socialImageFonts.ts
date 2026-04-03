const SOURCE_SERIF_4_FAMILY = "Source Serif 4";
const SOURCE_SERIF_4_CSS_URL = "https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;700&display=swap";
const FONT_CSS_HEADERS = {
  "User-Agent": "Mozilla/5.0",
};

const sourceSerifCss = fetch(SOURCE_SERIF_4_CSS_URL, { headers: FONT_CSS_HEADERS }).then(async (response) => {
  if (!response.ok) {
    throw new Error(`Failed to load Source Serif 4 CSS: ${response.status}`);
  }

  return response.text();
});

function getFontAssetUrl(css: string, weight: 400 | 700) {
  const match = css.match(new RegExp(`font-weight: ${weight};[\\s\\S]*?src: url\\(([^)]+)\\)`));

  if (!match?.[1]) {
    throw new Error(`Unable to find Source Serif 4 asset for weight ${weight}`);
  }

  return match[1];
}

async function loadSourceSerif(weight: 400 | 700) {
  const css = await sourceSerifCss;
  const assetUrl = getFontAssetUrl(css, weight);
  const response = await fetch(assetUrl);

  if (!response.ok) {
    throw new Error(`Failed to load Source Serif 4 asset ${weight}: ${response.status}`);
  }

  return response.arrayBuffer();
}

export { SOURCE_SERIF_4_FAMILY };
export const sourceSerifRegular = loadSourceSerif(400);
export const sourceSerifBold = loadSourceSerif(700);
