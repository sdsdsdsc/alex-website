import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { generateOfficialProtectedHeritageMap } from "./lib/official-protected-heritage-publication.mjs";

const readJson = (path) => readFile(fileURLToPath(new URL(path, import.meta.url)), "utf8").then(JSON.parse);
const [phase14Dataset, xinyuDataset, publicLocationDataset] = await Promise.all([
  readJson("../data/jiangxi-provincial-heritage-pilot.json"),
  readJson("../data/xinyu-provincial-heritage-marker-pilot.json"),
  readJson("../data/official-protected-heritage-public-locations.json")
]);
const result = generateOfficialProtectedHeritageMap({
  phase14Dataset,
  xinyuDataset,
  publicLocationDataset
});

console.log(`Validated ${phase14Dataset.records.length + xinyuDataset.records.length} official records.`);
console.log(`Approved public-location decisions: ${publicLocationDataset.decisions.length}.`);
console.log(`Renderable aggregate features: ${result.geojson.features.length}.`);
console.log(`Expected exclusions: ${result.exclusions.length}.`);
console.log(`Hard errors: ${result.hardErrorCount}.`);
