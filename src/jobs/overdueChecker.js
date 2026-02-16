const cron = require("node-cron");
const taskModel = require("../models/task.model");
const logger = require("../utils/logger");

function startOverdueJob() {
  // Runs every 5 minutes (for demo; in production use hourly or daily)
  cron.schedule("*/5 * * * *", async () => {
    try {
      const overdueTasks = await taskModel.find({
        status: { $ne: "done" },
        dueDate: { $lt: new Date() },
      });

      logger.info({
        message: `Overdue job executed. Found ${overdueTasks.length} overdue tasks.`,
      });
    } catch (error) {
      logger.error({
        message: "Error running overdue job",
        error: error.message,
      });
    }
  });

  console.log("Overdue task checker started");
}

module.exports = startOverdueJob;
