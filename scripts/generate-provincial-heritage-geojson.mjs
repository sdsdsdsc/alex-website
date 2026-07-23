import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  generateProvincialHeritageGeoJson,
  serializeJson
} from "./lib/provincial-heritage-data.mjs";

const datasetPath = fileURLToPath(
  new URL("../data/jiangxi-provincial-heritage-pilot.json", import.meta.url)
);
const geoJsonPath = fileURLToPath(
  new URL("../data/jiangxi-provincial-heritage-pilot.geojson", import.meta.url)
);
const checkOnly = process.argv.includes("--check");

const dataset = JSON.parse(await readFile(datasetPath, "utf8"));
const { geojson, exclusions } = generateProvincialHeritageGeoJson(dataset);
const generatedBytes = serializeJson(geojson);

if (checkOnly) {
  let committedBytes = "";
  try {
    committedBytes = await readFile(geoJsonPath, "utf8");
  } catch {
    throw new Error("Committed provincial heritage GeoJSON is missing.");
  }
  if (committedBytes !== generatedBytes) {
    throw new Error(
      "Committed provincial heritage GeoJSON is stale. Run npm run generate:provincial-heritage."
    );
  }
  console.log("Committed provincial heritage GeoJSON is byte-for-byte current.");
} else {
  await writeFile(geoJsonPath, generatedBytes, "utf8");
  console.log(`Wrote ${geoJsonPath}.`);
}

console.log(`Features: ${geojson.features.length}.`);
console.log(`Expected exclusions: ${exclusions.length}.`);
exclusions.forEach(({ recordId, reasons }) => {
  console.log(`- ${recordId}: ${reasons.join(", ")}`);
});
console.log("Hard errors: 0.");
