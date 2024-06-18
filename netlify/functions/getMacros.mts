import type { Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import {
  importSDKData,
  exportSDKData,
  getDietAndActivityPlan,
  type DietPlan,
} from "fitatu-sdk";

const BLOB_STORE_KEY = "fitatu";

export default async (req: Request, context: Context) => {
  const blobStore = getStore(BLOB_STORE_KEY);
  const rawSdkData =
    (await blobStore.get("SDK_DATA", { consistency: "strong" })) ??
    Netlify.env.get("SDK_DATA");
  if (!rawSdkData) {
    return new Response("SDK data not found", { status: 500 });
  }
  const sdkData = importSDKData(JSON.parse(rawSdkData));
  console.log("Getting diet data...");
  const dietPlan = await getDietAndActivityPlan(sdkData);
  console.log("Transforming data...");
  const items = Object.keys(dietPlan.dietPlan)
    .map((day) => dietPlan.dietPlan[day as keyof DietPlan].items)
    .flat();
  const macros = items.reduce(
    (acc, item) => {
      acc.protein += item.protein;
      acc.carbohydrates += item.carbohydrate;
      acc.fat += item.fat;
      acc.calories += item.energy;
      return acc;
    },
    { protein: 0, carbohydrates: 0, fat: 0, calories: 0 }
  );

  console.log("Saving updated sdk data to blob storage...");
  await blobStore.set(BLOB_STORE_KEY, JSON.stringify(exportSDKData(sdkData)));

  return new Response(JSON.stringify(macros));
};
