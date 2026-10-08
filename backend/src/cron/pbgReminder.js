const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

cron.schedule('0 9 * * *', async () => {
  console.log('Running PBG Reminder Cron Job...');
  // Logic to find PBG approaching deadline and send WhatsApp reminder
});
