// src/utils/getDemographicData.js
import { queryDemographicData } from "@esri/arcgis-rest-demographics";
import { ApiKeyManager } from "@esri/arcgis-rest-request";

const apiKey =
  "AAPKc0a534840fb6404cb4e7350c842f2f137WNlQPzeGdDeqztxzZ_1U4PM9qnN5JKH1H9HF64M3KLjYCNgZ1p3szK3qlcCXJvX"; // Replace with your actual API key

export const getDemographicData = async (latitude, longitude) => {
  const authentication = ApiKeyManager.fromKey(apiKey);

  try {
    const response = await queryDemographicData({
      studyAreas: [{ geometry: { x: longitude, y: latitude } }],
      dataCollections: ["KeyGlobalFacts"],
      analysisVariables: [
        "PetsPetProducts.MP26001H_B",
        "CivicActivitiesPoliticalAffiliation.MP06005A_B",
        "5yearincrements.POP10_CY",
        "5yearincrements.POP5_CY",
        "5yearincrements.POP0_CY",
        "5yearincrements.POP15_CY",
        "5yearincrements.POP20_CY",
        "maritalstatustotals.MARRIED_CY",
        "educationalattainment.BACHDEG_CY",
      ],
      authentication,
    });

    if (
      response.results &&
      response.results[0] &&
      response.results[0].value &&
      response.results[0].value.FeatureSet &&
      response.results[0].value.FeatureSet.length > 0 &&
      response.results[0].value.FeatureSet[0].features &&
      response.results[0].value.FeatureSet[0].features.length > 0
    ) {
      const attributes =
        response.results[0].value.FeatureSet[0].features[0].attributes;
      return attributes;
    } else {
      return { message: "No data found for this location." };
    }
  } catch (error) {
    console.error("Failed to fetch demographic data:", error);
    return { message: "Failed to fetch demographic data." };
  }
};
