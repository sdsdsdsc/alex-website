import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  assertValidProvincialHeritageDataset,
  generateProvincialHeritageGeoJson
} from "./lib/provincial-heritage-data.mjs";

const datasetPath = fileURLToPath(
  new URL("../data/jiangxi-provincial-heritage-pilot.json", import.meta.url)
);

const dataset = JSON.parse(await readFile(datasetPath, "utf8"));
const result = assertValidProvincialHeritageDataset(dataset);
const generation = generateProvincialHeritageGeoJson(dataset);

console.log(`Validated ${result.recordCount} provincial heritage records.`);
console.log(`Geometry-eligible records: ${generation.geojson.features.length}.`);
console.log(`Expected exclusions: ${generation.exclusions.length}.`);
generation.exclusions.forEach(({ recordId, reasons }) => {
  console.log(`- ${recordId}: ${reasons.join(", ")}`);
});
console.log("Hard errors: 0.");
