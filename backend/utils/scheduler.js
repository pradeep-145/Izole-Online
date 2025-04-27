const {
  CreateScheduleCommand,
  SchedulerClient,
  DeleteScheduleCommand
} = require('@aws-sdk/client-scheduler');

const moment = require('moment-timezone');
const scheduler = new SchedulerClient({
  region: process.env.AWS_REGION
});

const createScheduler = async (orderId) => {
  console.log(process.env.LAMBDA_ARN); // Ensure this environment variable is set
  try {
      const scheduleName = `schedule-${orderId}`;
      const scheduleTime = moment.tz('Asia/Kolkata').add(10, 'minutes').toDate();

      const scheduleCommand = new CreateScheduleCommand({
          Name: scheduleName,
          GroupName: 'OrderTimeouts',
          ScheduleExpression: `at(${scheduleTime.toISOString().split('.')[0]})`,
          Target: {
              Arn: process.env.LAMBDA_ARN, // ARN of your Lambda function
              RoleArn: process.env.SCHEDULER_ROLE_ARN, // IAM role for EventBridge Scheduler
              Input: JSON.stringify({
                  orderId: orderId, // Pass any data your Lambda handler needs
                  action: 'processOrderTimeout' // Specify the action for the handler
              }),
              RetryPolicy: {
                  MaximumRetryAttempts: 3,
                  MaximumEventAgeInSeconds: 3600
              }
          },
          ActionAfterCompletion: 'DELETE',
          FlexibleTimeWindow: {
              Mode: 'OFF'
          }
      });

      const response = await scheduler.send(scheduleCommand);
      return scheduleName;
  } catch (error) {
      console.log("Error at createScheduler", error);
      throw error;
  }
};

const deleteOrderScheduler = async (scheduleName) => {
  console.log(scheduleName);
  try {
      const deleteCommand = new DeleteScheduleCommand({
          Name: scheduleName,
          GroupName: 'OrderTimeouts'
      });

      await scheduler.send(deleteCommand);
      return true;
  } catch (error) {
      console.error('Error deleting schedule:', error);
      throw error;
  }
};

module.exports = {
  createScheduler,
  deleteOrderScheduler
};