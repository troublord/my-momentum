import { setupWorker } from "msw/browser";
import { activityStatsHandlers } from "./handlers/activityStats";

// Combine all handlers
const handlers = [...activityStatsHandlers];

export const worker = setupWorker(...handlers);
