// Authority-neutral public entry point. The legacy provincial-named module
// remains as a compatibility implementation until a separately approved
// internal-file migration can remove that historical import contract.
export {
  OFFICIAL_HERITAGE_DATASET_ID,
  OFFICIAL_HERITAGE_EMPTY_MESSAGE,
  OFFICIAL_HERITAGE_FAILURE_MESSAGE,
  OFFICIAL_HERITAGE_LOADING_MESSAGE,
  OFFICIAL_HERITAGE_SOURCE_RECORD_COUNT,
  GENERALIZED_POINT_MANDATORY_LIMITATION,
  OfficialHeritageMapValidationError,
  PROJECT_COORDINATE_PROVENANCE,
  SUPPORTED_SCHEMA_VERSION,
  buildOfficialFeatureAccessibleName,
  buildOfficialMarkerAccessibleName,
  buildOfficialPopupData,
  getOfficialDesignationLevelLabel,
  validateOfficialHeritageGeoJson,
  validateOfficialHeritagePublicationGeoJson
} from "./provincial-heritage-map.js?v=2026-08-09-kuixing-pavilion-point";
