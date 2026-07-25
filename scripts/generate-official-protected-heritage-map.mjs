import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  generateOfficialProtectedHeritageMap,
  serializeJson
} from "./lib/official-protected-heritage-publication.mjs";

const paths = {
  phase14: fileURLToPath(new URL("../data/jiangxi-provincial-heritage-pilot.json", import.meta.url)),
  xinyu: fileURLToPath(new URL("../data/xinyu-provincial-heritage-marker-pilot.json", import.meta.url)),
  locations: fileURLToPath(new URL("../data/official-protected-heritage-public-locations.json", import.meta.url)),
  output: fileURLToPath(new URL("../data/jiangxi-provincial-protected-heritage-map.geojson", import.meta.url))
};
const checkOnly = process.argv.includes("--check");

const [phase14Dataset, xinyuDataset, publicLocationDataset] = await Promise.all([
  readFile(paths.phase14, "utf8").then(JSON.parse),
  readFile(paths.xinyu, "utf8").then(JSON.parse),
  readFile(paths.locations, "utf8").then(JSON.parse)
]);
const result = generateOfficialProtectedHeritageMap({
  phase14Dataset,
  xinyuDataset,
  publicLocationDataset
});
const generatedBytes = serializeJson(result.geojson);

if (checkOnly) {
  const committedBytes = await readFile(paths.output, "utf8").catch(() => "");
  if (committedBytes !== generatedBytes) {
    throw new Error("Committed aggregate official heritage GeoJSON is missing or stale. Run npm run generate:official-heritage-map.");
  }
  console.log("Committed aggregate official heritage GeoJSON is byte-for-byte current.");
} else {
  await writeFile(paths.output, generatedBytes, "utf8");
  console.log(`Wrote ${paths.output}.`);
}

console.log(`Source records: ${result.geojson.metadata.sourceRecordCount}.`);
console.log(`Features: ${result.geojson.features.length}.`);
console.log(`Expected exclusions: ${result.exclusions.length}.`);
result.exclusions.forEach(({ recordId, reasons }) => {
  console.log(`- ${recordId}: ${reasons.join(", ")}`);
});
console.log(`Hard errors: ${result.hardErrorCount}.`);
