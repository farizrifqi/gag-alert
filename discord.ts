import type { GetStockResponse } from "./types";
import { RARITY_LEVEL, SEEDS_RARITY } from "./constants";
import config from "./config.json";
const MIN_RARITY = 3; //mythical
const rarityBolder = (text: string, rarity: number) => {
  console.log(`Rarity for ${text}: ${rarity}`);
  return rarity >= MIN_RARITY ? `**${text}**` : text;
};
export const sendToDiscordGear = async (
  data: GetStockResponse
): Promise<void> => {
  const seedsEmbeds = {
    title: "Seeds Stock",
    description: "Available seeds in stock",
    color: 7161603,
    fields: data.seedsStock
      .sort((a, b) => {
        const seeds_rarityA =
          SEEDS_RARITY[a.name.toLowerCase() as keyof typeof SEEDS_RARITY] ?? 0;
        const seeds_rarityB =
          SEEDS_RARITY[b.name.toLowerCase() as keyof typeof SEEDS_RARITY] ?? 0;
        return seeds_rarityA - seeds_rarityB;
      })
      .map((seed, i) => {
        const seeds_rarity =
          SEEDS_RARITY[seed.name.toLowerCase() as keyof typeof SEEDS_RARITY] ??
          0;
        const rarityLevel = RARITY_LEVEL[seeds_rarity]!;
        return {
          name: `${seed.emoji || ""} ${seed.name}`,
          value: `${seed.value} pc${
            seed.value !== "1" ? "s" : ""
          }\nRarity: ${rarityBolder(rarityLevel, seeds_rarity).toUpperCase()}${
            seeds_rarity >= MIN_RARITY ? "\n@everyone" : ""
          }\n`,
        };
      }),
  };
  const gearEmbeds = {
    title: "Gear Stock",
    description: "Available gear in stock",
    color: 7960953,
    fields: data.gearStock
      .sort((a, b) => {
        const seeds_rarityA =
          SEEDS_RARITY[a.name.toLowerCase() as keyof typeof SEEDS_RARITY] ?? 0;
        const seeds_rarityB =
          SEEDS_RARITY[b.name.toLowerCase() as keyof typeof SEEDS_RARITY] ?? 0;
        return seeds_rarityA - seeds_rarityB;
      })
      .map((seed, i) => {
        const seeds_rarity =
          SEEDS_RARITY[seed.name.toLowerCase() as keyof typeof SEEDS_RARITY] ??
          0;
        const rarityLevel = RARITY_LEVEL[seeds_rarity]!;
        return {
          name: `${seed.emoji || ""} ${seed.name}`,
          value: `${seed.value} pc${
            seed.value !== "1" ? "s" : ""
          }\nRarity: ${rarityBolder(rarityLevel, seeds_rarity).toUpperCase()}${
            seeds_rarity >= MIN_RARITY ? "\n@everyone" : ""
          }\n`,
        };
      }),
  };
  const payload = {
    username: "AnaknyaBurhan",
    content: "New stock update!",
    embeds: [seedsEmbeds, gearEmbeds],
  };
  await fetch(config.discord_webhook_url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
