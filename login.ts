import { Argy } from "argy-args";
import { exportSDKData, login } from "fitatu-sdk";
import { writeFileSync } from "fs";

const argy = new Argy();

argy.setAppName("Fitatu Relay CLI");

const loginData = {
  email: "",
  password: "",
};

argy.addArgument("email", {
  prefix: "long",
  takesValue: true,
  required: true,
  description: "Fitatu account email",
  callback: (e) => (loginData.email = e!),
});

argy.addArgument("password", {
  prefix: "long",
  takesValue: true,
  required: true,
  description: "Fitatu account password",
  callback: (e) => (loginData.password = e!),
});

argy.addAutoHelp();

argy.execArguments();

console.log(`Logging in as ${loginData.email}...`);

login(loginData.email, loginData.password).then((data) => {
  console.log("Logged in successfully!");
  console.log("Exporting SDK data...");
  const sdkData = exportSDKData(data);
  writeFileSync("sdkData.json", JSON.stringify(sdkData));
  console.log("SDK data exported to sdkData.json");
});
