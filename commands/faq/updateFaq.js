// const {
//     SlashCommandBuilder,
//     ButtonBuilder,
//     ButtonStyle,
//     ActionRowBuilder,
// } = require("discord.js");
// const { db } = require("../../config/database");

// const updateQuestion = {
//     data: new SlashCommandBuilder()
//         .setName("question")
//         .setDescription("Entrez votre nouvelle question.")
//         .addStringOption(option =>
//             option
//                 .setName("question")
//                 .setDescription("Entrez votre nouvelle question.")
//                 .setRequired(true)),
//     async execute(interaction) {
//         const question = interaction.options.getString("question");
//         console.log(question, "question")
//     }
// };

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName("faq-update")
//         .setDescription(
//             "Affiche les questions. Sélectionnez celle que vous souhaitez mettre à jour avec son numéro."
//         ),
//         async execute(interaction) {
//             try {
//                 db.all("SELECT * FROM Questions", function (err, questionRows) {
//                     if (err) {
//                         console.error(err);
//                         interaction.reply(
//                             "Une erreur s'est produite lors de la récupération des questions."
//                         );
//                         return;
//                     }

//                     if (!interaction.member.permissions.has("superuser") || !interaction.member.permissions.has("Helper")) {
//                         interaction.reply("Vous devez être administrateur pour mettre à jour une question.");
//                         return;
//                     }

//                     if (!questionRows || questionRows.length === 0) {
//                         interaction.reply("La FAQ est vide.");
//                         return;
//                     }

//                     let faqMessage = "Sélectionnez la question que vous souhaitez mettre à jour:\n";
//                     let updateQuestion = new ActionRowBuilder();

//                     questionRows.forEach((questionRow, index) => {
//                         faqMessage += `**${index + 1}:** ${
//                             questionRow.question.charAt(0).toUpperCase() + questionRow.question.slice(1)
//                         }\n`;
//                         let button = new ButtonBuilder()
//                             .setLabel(`Question ${index + 1}`)
//                             .setStyle(ButtonStyle.Primary)
//                             .setCustomId(`${questionRow.id}`);
//                         updateQuestion.addComponents(button);
//                     });

//                     interaction.reply({
//                         content: faqMessage,
//                         components: [updateQuestion],
//                     });

//                     interaction.client.on("interactionCreate", async (ButtonInteraction) => {
//                         if (!ButtonInteraction.isButton()) return;
//                         const buttonId = ButtonInteraction.customId;
//                         const questionId = buttonId;
//                         console.log(questionId, "questionId")
//                         if (!questionId) {
//                             ButtonInteraction.reply("La question n'existe pas.");
//                             return;
//                         }

//                         db.get("SELECT * FROM Questions WHERE id = ?", [questionId], function (err, questionRow) {
//                             if (err) {
//                                 console.error(err);
//                                 ButtonInteraction.reply("Une erreur s'est produite lors de la récupération de la question.");
//                                 return;
//                             }

//                             if (!questionRow) {
//                                 ButtonInteraction.reply("La question n'existe pas.");
//                                 return;
//                             }

//                             ButtonInteraction.reply({
//                                 content: `La question que vous souhaitez mettre à jour est: **${questionRow.question}**. Entrez la nouvelle question.`,
//                                 ephemeral: true,
//                             });

                            


//                         }); 

//                     })
//                 })
            
//             } catch (err) {
//                 console.error(err);
//                 interaction.reply(
//                     "Une erreur s'est produite lors de la récupération des questions."
//                 );
//             }
//         }
// }