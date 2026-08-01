import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  generateOfficialProtectedHeritageMap,
  generateProvincialCompatibilityMap,
  serializeJson
} from "./lib/official-protected-heritage-publication.mjs";

const paths = {
  phase14: fileURLToPath(new URL("../data/jiangxi-provincial-heritage-pilot.json", import.meta.url)),
  xinyu: fileURLToPath(new URL("../data/xinyu-official-heritage-records.json", import.meta.url)),
  legacyProvincial: fileURLToPath(new URL("../data/xinyu-provincial-heritage-marker-pilot.json", import.meta.url)),
  locations: fileURLToPath(new URL("../data/official-protected-heritage-public-locations.json", import.meta.url)),
  output: fileURLToPath(new URL("../data/jiangxi-official-protected-heritage-map.geojson", import.meta.url)),
  legacyOutput: fileURLToPath(new URL("../data/jiangxi-provincial-protected-heritage-map.geojson", import.meta.url))
};
const checkOnly = process.argv.includes("--check");

const [phase14Dataset, xinyuDataset, legacyProvincialDataset, publicLocationDataset] = await Promise.all([
  readFile(paths.phase14, "utf8").then(JSON.parse),
  readFile(paths.xinyu, "utf8").then(JSON.parse),
  readFile(paths.legacyProvincial, "utf8").then(JSON.parse),
  readFile(paths.locations, "utf8").then(JSON.parse)
]);
const result = generateOfficialProtectedHeritageMap({
  phase14Dataset,
  xinyuDataset,
  publicLocationDataset
});
const legacyResult = generateProvincialCompatibilityMap({
  phase14Dataset,
  legacyProvincialDataset,
  publicLocationDataset
});
const generatedBytes = serializeJson(result.geojson);
const legacyGeneratedBytes = serializeJson(legacyResult.geojson);

if (checkOnly) {
  const committedBytes = await readFile(paths.output, "utf8").catch(() => "");
  const legacyCommittedBytes = await readFile(paths.legacyOutput, "utf8").catch(() => "");
  if (committedBytes !== generatedBytes) {
    throw new Error("Committed canonical Official Heritage GeoJSON is missing or stale. Run npm run generate:official-heritage-map.");
  }
  if (legacyCommittedBytes !== legacyGeneratedBytes) {
    throw new Error("Committed provincial compatibility GeoJSON is missing or stale. Run npm run generate:official-heritage-map.");
  }
  console.log("Committed canonical and provincial compatibility GeoJSON files are byte-for-byte current.");
} else {
  await writeFile(paths.output, generatedBytes, "utf8");
  await writeFile(paths.legacyOutput, legacyGeneratedBytes, "utf8");
  console.log(`Wrote ${paths.output}.`);
  console.log(`Wrote ${paths.legacyOutput}.`);
}

console.log(`Source records: ${result.geojson.metadata.sourceRecordCount}.`);
console.log(`Features: ${result.geojson.features.length}.`);
console.log(`Expected exclusions: ${result.exclusions.length}.`);
result.exclusions.forEach(({ recordId, reasons }) => {
  console.log(`- ${recordId}: ${reasons.join(", ")}`);
});
console.log(`Hard errors: ${result.hardErrorCount}.`);
console.log(`Provincial compatibility features: ${legacyResult.geojson.features.length}.`);
