// Stats Script
// Import dependencies
import { extension_settings, getContext, loadExtensionSettings } from "../../../extensions.js";
import { saveSettingsDebounced } from "../../../../script.js";

// Constants
const extensionName = "Stats";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const defaultStats = {
  name: "Unknown",
  health: 100,
  mana: 50,
  attributes: {
    strength: 10,
    dexterity: 10,
    intelligence: 10,
  },
  inventory: ["Health Potion x2", "Mana Potion x1"],
  skills: ["Fireball", "Heal"],
  relationships: [
    { name: "Villager", status: "Friendly" },
    { name: "Merchant", status: "Neutral" },
  ],
  journal: ["Started a journey into the dark forest."],
};

// Initialize settings
async function loadSettings() {
  extension_settings[extensionName] = extension_settings[extensionName] || {};
  if (Object.keys(extension_settings[extensionName]).length === 0) {
    Object.assign(extension_settings[extensionName], defaultStats);
  }
  updateStatsUI();
}

// Update the UI with stats
function updateStatsUI() {
  const stats = extension_settings[extensionName];

  $("#character-name").text(stats.name);
  $("#health").text(stats.health);
  $("#mana").text(stats.mana);

  $("#attribute-strength").text(stats.attributes.strength);
  $("#attribute-dexterity").text(stats.attributes.dexterity);
  $("#attribute-intelligence").text(stats.attributes.intelligence);

  const inventoryHtml = stats.inventory.map(item => `<li>${item}</li>`).join("");
  $("#inventory").html(inventoryHtml);

  const skillsHtml = stats.skills.map(skill => `<li>${skill}</li>`).join("");
  $("#skills").html(skillsHtml);

  const relationshipsHtml = stats.relationships
    .map(rel => `<li>${rel.name}: ${rel.status}</li>`)
    .join("");
  $("#relationships").html(relationshipsHtml);

  const journalHtml = stats.journal.map(entry => `<li>${entry}</li>`).join("");
  $("#journal").html(journalHtml);
}

// Reset stats to default
function resetStats() {
  extension_settings[extensionName] = { ...defaultStats };
  saveSettingsDebounced();
  updateStatsUI();
}

// Initialize the extension
jQuery(async () => {
  const settingsHtml = await $.get(`${extensionFolderPath}/example.html`);
  $("#extensions_settings").append(settingsHtml);

  $("#reset-rpg-stats-button").on("click", resetStats);

  await loadSettings();
});
