
export const LogEvent = (eventName: string, screenName: string, printToConsole: boolean) => {
    // Implement External Logger(s)
    if(printToConsole){
        console.log(`Event - Event: ${eventName}, Screen: ${screenName}`);
    }
}