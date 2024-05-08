const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { translate } = require("bing-translate-api");

const languages = [
  { name: "Arabic", value: "ar" },
  { name: "Chinese (Simplified)", value: "zh" },
  { name: "English", value: "en" },
  { name: "French", value: "fr" },
  { name: "German", value: "de" },
  { name: "Hindi", value: "hi" },
  { name: "Italian", value: "it" },
  { name: "Japanese", value: "ja" },
  { name: "Korean", value: "ko" },
  { name: "Portuguese (Brazil)", value: "pt" },
  { name: "Russian", value: "ru" },
  { name: "Spanish", value: "es" },
  { name: "Turkish", value: "tr" },
  { name: "Vietnamese", value: "vi" },
  { name: "Chinese (Traditional)", value: "zh-TW" },
  { name: "Dutch", value: "nl" },
  { name: "Greek", value: "el" },
  { name: "Hebrew", value: "he" },
  { name: "Indonesian", value: "id" },
  { name: "Malay", value: "ms" },
  { name: "Polish", value: "pl" },
  { name: "Romanian", value: "ro" },
  { name: "Swedish", value: "sv" },
  { name: "Thai", value: "th" },
  { name: "Ukrainian", value: "uk" },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Translate text from one language to another")
    .addStringOption(option => option.setName("text").setDescription("The text to translate").setRequired(true))
    .addStringOption(option => option.setName("source_language").setDescription("The language to translate from").setRequired(true).addChoices(...languages))
    .addStringOption(option => option.setName("target_language").setDescription("The language to translate to").setRequired(true).addChoices(...languages)),
  async execute(interaction) {
    const inputText = interaction.options.getString("text");
    const sourceLanguage = interaction.options.getString("source_language");
    const targetLanguage = interaction.options.getString("target_language");

    try {
      const { translation, language } = await translate(inputText, sourceLanguage, targetLanguage);
      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setAuthor({ name: `${interaction.user.username} says`, iconURL: interaction.user.avatarURL() })
        .addFields(
          { name: 'Original Text', value: inputText, inline: false },
          { name: 'Translated Text', value: translation, inline: false },
          { name: 'Detected Language', value: language.from, inline: false },
          { name: 'Translated To', value: language.to, inline: false }
        );
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error translating text:", error);
      await interaction.reply("Failed to translate your text");
    }
  },
};