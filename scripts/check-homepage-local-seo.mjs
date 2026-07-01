import { readFileSync } from 'node:fs';

const files = {
  homepage: 'src/app/page.tsx',
  hero: 'src/views/jumbotron.tsx',
  layout: 'src/app/layout.tsx',
  structuredData: 'src/components/structured-data.tsx',
};

const source = Object.fromEntries(
  Object.entries(files).map(([key, path]) => [key, readFileSync(path, 'utf8')]),
);

const checks = [
  ['homepage title targets Williamsburg med spa intent', source.homepage.includes('Williamsburg Med Spa: Botox, Fillers, PRP & Ear Piercing')],
  ['homepage description names Williamsburg, VA and core services', /Williamsburg, VA[\s\S]*Botox[\s\S]*Xeomin[\s\S]*fillers[\s\S]*PRP/.test(source.homepage)],
  ['homepage visible FAQ matches medical spa services question', source.homepage.includes('What medical spa services are available in Williamsburg, VA?')],
  ['homepage links Williamsburg location page', source.homepage.includes('href="/locations/williamsburg-va"')],
  ['homepage links Williamsburg Botox page', source.homepage.includes('href="/procedures/botox/near/williamsburg-va"')],
  ['hero keeps Nurse Practitioner led med spa positioning', source.hero.includes('Nurse Practitioner Led Medical Spa')],
  ['hero keeps Williamsburg, VA in above-fold H1', source.hero.includes('Natural-Looking Aesthetic Care in Williamsburg, VA')],
  ['hero includes Jenny credentials above the fold', /Jenny Coleman[\s\S]*MSN[\s\S]*RN[\s\S]*CPNP[\s\S]*PMHS/.test(source.hero)],
  ['hero includes Botox, Xeomin, fillers, PRP, O-Shot, and medical ear piercing', /Botox[\s\S]*Xeomin[\s\S]*fillers[\s\S]*PRP[\s\S]*O-Shot[\s\S]*medical ear piercing/.test(source.hero)],
  ['sitewide LocalBusiness schema remains mounted', source.layout.includes('<StructuredData type="LocalBusiness" />')],
  ['LocalBusiness schema renders MedicalBusiness with Williamsburg address', source.structuredData.includes('"@type": "MedicalBusiness"') && source.structuredData.includes('3900 Powhatan Parkway') && source.structuredData.includes('Williamsburg')],
];

const failed = checks.filter(([, ok]) => !ok);

for (const [label, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${label}`);
}

if (failed.length) {
  console.error(`\n${failed.length} homepage local SEO checks failed.`);
  process.exit(1);
}

console.log('\nHomepage local SEO source checks passed.');
