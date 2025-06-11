import { MAIN_API } from "./constants";
import { sendToDiscordGear } from "./discord";
import Logger from "./logger";
import type { GetStockResponse, RestockTimeResponse } from "./types";

const logger = new Logger("silly");

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
const timeout = (ms: number) =>
  new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Timeout after ${ms} ms`)), ms);
  });
function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];

  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
  if (hours > 0 || minutes > 0)
    parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
  parts.push(`${seconds} second${seconds !== 1 ? "s" : ""}`);

  return parts.join(" ");
}

const doRequest = async (url: string): Promise<any> => {
  try {
    const request = await fetch(url);
    if (!request.ok) {
      throw new Error(`HTTP error! status: ${request.status}`);
    }
    const response = await request.json();
    return response;
  } catch (err) {
    return null;
  }
};

const getStock = async () => {
  try {
    const request = await Promise.race([
      doRequest(`${MAIN_API}/stock/GetStock`),
      timeout(30000),
    ]);
    logger.log({
      level: "info",
      label: "getStock",
      message: `Stock data fetched successfully`,
    });
    return request as GetStockResponse;
  } catch (err: any) {
    logger.log({
      level: "error",
      label: "getStock",
      message: `Error fetching stock data: ${err.message}`,
    });
    await sleep(10000);
    return await getStock();
  }
};
const getRestockTime = async () => {
  try {
    const request = await Promise.race([
      doRequest(`${MAIN_API}/stock/Restock-Time`),
      timeout(30000),
    ]);
    const currentTime = new Date().getTime();
    const time =
      (request as RestockTimeResponse).seeds.timestamp + 5000 - currentTime;
    logger.log({
      level: "info",
      label: "getRestockTime",
      message: `Restock time data fetched successfully, sleep for ${formatDuration(
        time
      )}`,
    });

    return (request as RestockTimeResponse).seeds.timestamp;
  } catch (err: any) {
    logger.log({
      level: "error",
      label: "getRestockTime",
      message: `Error: ${err.message}`,
    });
    const currentTime = new Date().getTime();

    return currentTime + 1000 * 60 * 5;
  }
};

const run = async () => {
  const a = await getStock();
  const restockTime = await getRestockTime();
  sendToDiscordGear(a, restockTime);
  const currentTime = new Date().getTime();
  const time = restockTime + 5000 - currentTime;
  await sleep(time);
  return await run();
};

run();
