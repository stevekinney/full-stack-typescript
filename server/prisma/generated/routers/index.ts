import { t } from "./helpers/createRouter";
import { tasksRouter } from "./Task.router";

export const appRouter = t.router({
  task: tasksRouter
})

