// Stats Script
// Import dependencies
import { extension_settings, getContext, loadExtensionSettings } from "../../../extensions.js";
import { saveSettingsDebounced } from "../../../../script.js";
import { loadMovingUIState } from '../../../../scripts/power-user.js';

// Constants
const extensionName = "Stats";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const defaultStats = {
  name: "Trevor",
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

function doPopout(e) {
    const target = e.target;

    //repurposes the zoomed avatar template to server as a floating div
    if ($('#objectiveExtensionPopout').length === 0) {
        console.debug('did not see popout yet, creating');
        const originalHTMLClone = $(target).parent().parent().parent().find('.inline-drawer-content').html();
        const originalElement = $(target).parent().parent().parent().find('.inline-drawer-content');
        const template = $('#zoomed_avatar_template').html();
        const controlBarHtml = `<div class="panelControlBar flex-container">
        <div id="objectiveExtensionPopoutheader" class="fa-solid fa-grip drag-grabber hoverglow"></div>
        <div id="objectiveExtensionPopoutClose" class="fa-solid fa-circle-xmark hoverglow dragClose"></div>
    </div>`;
        const newElement = $(template);
        newElement.attr('id', 'objectiveExtensionPopout')
            .removeClass('zoomed_avatar')
            .addClass('draggable')
            .empty();
        originalElement.html('<div class="flex-container alignitemscenter justifyCenter wide100p"><small>Currently popped out</small></div>');
        newElement.append(controlBarHtml).append(originalHTMLClone);
        $('#movingDivs').append(newElement);
        $('#objectiveExtensionDrawerContents').addClass('scrollY');
        loadSettings();
        loadMovingUIState();

        $('#objectiveExtensionPopout').css('display', 'flex').fadeIn(animation_duration);
        dragElement(newElement);

        //setup listener for close button to restore extensions menu
        $('#objectiveExtensionPopoutClose').off('click').on('click', function () {
            $('#objectiveExtensionDrawerContents').removeClass('scrollY');
            const objectivePopoutHTML = $('#objectiveExtensionDrawerContents');
            $('#objectiveExtensionPopout').fadeOut(animation_duration, () => {
                originalElement.empty();
                originalElement.append(objectivePopoutHTML);
                $('#objectiveExtensionPopout').remove();
            });
            loadSettings();
        });
    } else {
        console.debug('saw existing popout, removing');
        $('#objectiveExtensionPopout').fadeOut(animation_duration, () => { $('#objectiveExtensionPopoutClose').trigger('click'); });
    }
}

// Initialize the extension
jQuery(async () => {
  const settingsHtml = await $.get(`${extensionFolderPath}/example.html`);
  $("#extensions_settings").append(settingsHtml);
  $(document).on('click', '#objectiveExtensionPopoutButton', function (e) {
        doPopout(e);
        e.stopPropagation();

  $("#reset-stats-button").on("click", resetStats);

  await loadSettings();
});
