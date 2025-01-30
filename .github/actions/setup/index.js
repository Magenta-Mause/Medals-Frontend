import { getInput } from "@actions/core";
import { exec } from "@actions/exec";

async function run() {
  try {
    const nodeVersion = getInput("node-version");
    await exec(`nvm install ${nodeVersion}`);
    await exec(`nvm use ${nodeVersion}`);
    await exec(`nvm ci`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
