import {
  GENERALIZED_POINT_CONTRACT_VERSION,
  GENERALIZED_POINT_MANDATORY_LIMITATION
} from "../../heritage-engine/official-geometry-schema.js";

function makeSyntheticGeneralizedPointContract({
  identityId = "JX-TEST-PCH-001",
  publicationDecision = "approved-for-publication"
} = {}) {
  return {
    contractVersion: GENERALIZED_POINT_CONTRACT_VERSION,
    originalSpatialBasis: {
      basisType: "documented-support-area",
      sourceNotation: "Synthetic bounded support area centred on 113.8825 E, 27.6202 N",
      coordinateReferenceSystem: "source datum unstated; WGS84 and CGCS2000 interpretations retained",
      methodBasis: "Use the predeclared centre of the bounded synthetic support area after evaluating both accepted datum paths.",
      publicEvidenceReference: {
        label: "Synthetic non-Xinyu contract fixture",
        url: "https://example.gov.cn/synthetic-generalized-point"
      },
      restrictedEvidenceReference: null
    },
    sourceCoordinatePrecision: {
      kind: "notation-resolution",
      metres: 2,
      explanation: "Synthetic notation resolution, recorded separately from all other quantities."
    },
    datumInterpretations: [
      {
        datum: "WGS84",
        rationale: "Plausible synthetic interpretation for a GPS-labelled source.",
        transformationMethod: "Identity transform to WGS84.",
        frameAllowanceMetres: 1
      },
      {
        datum: "CGCS2000",
        rationale: "Plausible synthetic interpretation for a modern mainland-China institutional source.",
        transformationMethod: "Treat CGCS2000 as coincident with WGS84 at this public display scale.",
        frameAllowanceMetres: 1
      }
    ],
    multiInterpretationEnvelope: {
      applicable: true,
      method: "Minimum enclosing circle of both accepted WGS84 outputs.",
      maximumSeparationMetres: 3
    },
    supportArea: {
      meaning: "Documented synthetic general vicinity; not the heritage extent or protection boundary.",
      shape: "bounded circular test support",
      extentDescription: "Maximum 30 metres from the deterministic representative Point.",
      maximumDistanceFromRepresentativeMetres: 30,
      sourceReferenceLabel: "Synthetic non-Xinyu support-area fixture",
      sourceReferenceUrl: "https://example.gov.cn/synthetic-generalized-point"
    },
    representativePoint: {
      method: "minimum-enclosing-circle-centre",
      methodVersion: "synthetic-v1",
      selectionRule: "Select the centre fixed before inspecting the rendered result; do not select a convenient interpretation."
    },
    intentionalGeneralization: {
      method: "four-decimal WGS84 rounding",
      displacementMetres: 5,
      explanation: "Deliberate coordinate coarsening; not source or transformation uncertainty."
    },
    displayedCoordinatePrecision: {
      decimalPlaces: 4,
      approximateResolutionMetres: 11
    },
    outwardCoverageMetres: 40,
    provenance: {
      spatialBasis: {
        label: "Synthetic non-Xinyu bounded spatial basis",
        url: "https://example.gov.cn/synthetic-generalized-point",
        accessedDate: "2026-08-04"
      },
      limitation: {
        label: "Phase 15C-17 Generalized reference Point policy",
        url: "https://example.gov.cn/generalized-point-policy",
        accessedDate: "2026-08-04"
      }
    },
    mandatoryPublicLimitation: GENERALIZED_POINT_MANDATORY_LIMITATION,
    candidateSpecificLimitation: "Synthetic candidate limitation: the source datum is unstated and both accepted interpretations are covered.",
    review: {
      evidenceReviewer: "Synthetic fixture reviewer",
      reviewDate: "2026-08-04",
      policyVersion: "Phase 15C-17",
      accountableRole: "Synthetic fixture publication owner",
      publicationDecision
    },
    representation: {
      identityId,
      representationId: `${identityId}:generalized-point:v1`,
      status: "active",
      supersedesRepresentationIds: [],
      supersessionHistoryReference: "Synthetic fixture has no prior public representation."
    }
  };
}

export { makeSyntheticGeneralizedPointContract };
