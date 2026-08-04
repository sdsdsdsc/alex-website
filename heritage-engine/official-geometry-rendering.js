import {
  deriveLegacyPointGeometryMeaning,
  getOfficialGeometryMeaningLabel
} from "./official-geometry-schema.js?v=2026-08-04-generalized-point-contract";

const OFFICIAL_GEOMETRY_SOURCE_PRESENTATION_LABELS = Object.freeze({
  "official-published-geometry": "Official published geometry",
  "official-map-reference": "Official map reference",
  "institutional-map-reference": "Institutional map reference",
  "provider-map-reference": "Provider map reference",
  "project-reviewed-digitization": "Project-reviewed digitization",
  "project-generalized-reference": "Project-generalized reference"
});

const NON_POINT_GEOMETRY_PRESENTATIONS = Object.freeze({
  "reviewed-line": Object.freeze({
    geometryTypes: Object.freeze(["LineString", "MultiLineString"]),
    className: "official-heritage-geometry official-heritage-geometry--reviewed-line",
    pathOptions: Object.freeze({
      color: "#a94700",
      weight: 5,
      opacity: 0.92,
      lineCap: "round",
      lineJoin: "round",
      fill: false
    })
  }),
  "approximate-line": Object.freeze({
    geometryTypes: Object.freeze(["LineString", "MultiLineString"]),
    className: "official-heritage-geometry official-heritage-geometry--approximate-line",
    pathOptions: Object.freeze({
      color: "#b85b13",
      weight: 3,
      opacity: 0.76,
      dashArray: "8 7",
      lineCap: "round",
      lineJoin: "round",
      fill: false
    })
  }),
  "reviewed-boundary": Object.freeze({
    geometryTypes: Object.freeze(["Polygon", "MultiPolygon"]),
    className: "official-heritage-geometry official-heritage-geometry--reviewed-boundary",
    pathOptions: Object.freeze({
      color: "#a94700",
      weight: 3,
      opacity: 0.92,
      fillColor: "#d66a16",
      fillOpacity: 0.14,
      lineCap: "round",
      lineJoin: "round"
    })
  }),
  "approximate-boundary": Object.freeze({
    geometryTypes: Object.freeze(["Polygon", "MultiPolygon"]),
    className: "official-heritage-geometry official-heritage-geometry--approximate-boundary",
    pathOptions: Object.freeze({
      color: "#b85b13",
      weight: 2.5,
      opacity: 0.8,
      dashArray: "8 6",
      fillColor: "#e18a45",
      fillOpacity: 0.08,
      lineCap: "round",
      lineJoin: "round"
    })
  }),
  "generalized-reference-area": Object.freeze({
    geometryTypes: Object.freeze(["Polygon", "MultiPolygon"]),
    className: "official-heritage-geometry official-heritage-geometry--generalized-reference-area",
    pathOptions: Object.freeze({
      color: "#b85b13",
      weight: 2,
      opacity: 0.7,
      dashArray: "3 7",
      fillColor: "#efaa72",
      fillOpacity: 0.045,
      lineCap: "round",
      lineJoin: "round"
    })
  }),
  "uncertainty-area": Object.freeze({
    geometryTypes: Object.freeze(["Polygon", "MultiPolygon"]),
    className: "official-heritage-geometry official-heritage-geometry--uncertainty-area",
    pathOptions: Object.freeze({
      color: "#c97a3d",
      weight: 1.5,
      opacity: 0.58,
      dashArray: "2 8",
      fillColor: "#efb98d",
      fillOpacity: 0.1,
      lineCap: "round",
      lineJoin: "round"
    })
  })
});

const REQUIRED_RENDER_PRECISION_BY_MEANING = Object.freeze({
  "reviewed-line": "reviewed",
  "approximate-line": "approximate",
  "reviewed-boundary": "reviewed",
  "approximate-boundary": "approximate",
  "generalized-reference-area": "generalized",
  "uncertainty-area": "uncertain"
});

class OfficialGeometryRenderingError extends Error {
  constructor(message) {
    super(message);
    this.name = "OfficialGeometryRenderingError";
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function getOfficialGeometrySourceLabel(sourceType) {
  return OFFICIAL_GEOMETRY_SOURCE_PRESENTATION_LABELS[sourceType] || null;
}

function getFeatureGeometryMeaning(feature) {
  if (feature?.geometry?.type === "Point") {
    return feature.properties?.geometryMeaning
      || deriveLegacyPointGeometryMeaning(feature.properties);
  }
  return feature?.properties?.geometryMeaning || null;
}

function getOfficialGeometryRenderPresentation(feature) {
  if (!isPlainObject(feature) || !isPlainObject(feature.geometry) || !isPlainObject(feature.properties)) {
    throw new OfficialGeometryRenderingError("Official geometry rendering requires a validated GeoJSON Feature.");
  }

  const geometryType = feature.geometry.type;
  const geometryMeaning = getFeatureGeometryMeaning(feature);
  const meaningLabel = getOfficialGeometryMeaningLabel(geometryMeaning);
  if (!meaningLabel) {
    throw new OfficialGeometryRenderingError(`Unsupported official geometry meaning: ${geometryMeaning || "missing"}.`);
  }

  if (geometryType === "Point") {
    return Object.freeze({
      geometryType,
      geometryMeaning,
      meaningLabel,
      renderer: "point",
      className: null,
      pathOptions: null
    });
  }

  const presentation = NON_POINT_GEOMETRY_PRESENTATIONS[geometryMeaning];
  if (!presentation || !presentation.geometryTypes.includes(geometryType)) {
    throw new OfficialGeometryRenderingError(
      `No controlled rendering presentation exists for ${geometryType || "missing geometry"} with ${geometryMeaning || "missing meaning"}.`
    );
  }
  const requiredPrecision = REQUIRED_RENDER_PRECISION_BY_MEANING[geometryMeaning];
  if (feature.properties.geometryPrecision !== requiredPrecision) {
    throw new OfficialGeometryRenderingError(
      `No controlled rendering presentation exists for ${geometryMeaning} with ${feature.properties.geometryPrecision || "missing precision"}.`
    );
  }

  return Object.freeze({
    geometryType,
    geometryMeaning,
    meaningLabel,
    renderer: ["LineString", "MultiLineString"].includes(geometryType) ? "line" : "area",
    className: presentation.className,
    pathOptions: Object.freeze({
      ...presentation.pathOptions,
      className: presentation.className,
      interactive: true
    })
  });
}

function prepareOfficialGeometryRenderModels(features) {
  if (!Array.isArray(features)) {
    throw new OfficialGeometryRenderingError("Official geometry rendering requires a validated feature array.");
  }
  return features.map((feature) => Object.freeze({
    feature,
    presentation: getOfficialGeometryRenderPresentation(feature)
  }));
}

export {
  NON_POINT_GEOMETRY_PRESENTATIONS,
  OFFICIAL_GEOMETRY_SOURCE_PRESENTATION_LABELS,
  REQUIRED_RENDER_PRECISION_BY_MEANING,
  OfficialGeometryRenderingError,
  getFeatureGeometryMeaning,
  getOfficialGeometryRenderPresentation,
  getOfficialGeometrySourceLabel,
  prepareOfficialGeometryRenderModels
};
