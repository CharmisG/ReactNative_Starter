import { Events } from "../constants/EventConstants";

export const LogEvent = (options: {
  eventName: Events;
  screenName: string;
  printToConsole: boolean;
}) => {
  // Implement External Logger(s)
  if (options.printToConsole) {
    console.log(
      `EVENTLOG - Event: ${options.eventName?.toString()}, Screen: ${options.screenName}`,
    );
  }
};
