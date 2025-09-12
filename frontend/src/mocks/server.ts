import { setupServer } from "msw/node";
import { activityStatsHandlers } from "./handlers/activityStats";

// Combine all handlers
const handlers = [...activityStatsHandlers];

export const server = setupServer(...handlers);
