import type { Context } from "@netlify/functions";
import {
  importSDKData,
  getDietAndActivityPlan,
  type DietPlan,
} from "fitatu-sdk";

export default async (req: Request, context: Context) => {
  const rawSdkData = Netlify.env.get("SDK_DATA");
  if (!rawSdkData) {
    return new Response("SDK data not found", { status: 500 });
  }
  const sdkData = importSDKData(JSON.parse(rawSdkData));
  const dietPlan = await getDietAndActivityPlan(sdkData);
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

  return new Response(JSON.stringify(macros));
};
