import { j } from "./jstack";
import { imageRouter } from "./routers/image-router";
import { postRouter } from "./routers/post-router";
import { textRouter } from "./routers/text-router";

/**
 * This is your base API.
 * Here, you can handle errors, not-found responses, cors and more.
 *
 * @see https://jstack.app/docs/backend/app-router
 */
const api = j
  .router()
  .basePath("/api")
  .use(j.defaults.cors)
  .onError(j.defaults.errorHandler);

/**
 * This is the main router for your server.
 * All routers in /server/routers should be added here manually.
 */
const appRouter = j.mergeRouters(api, {
  post: postRouter,
  text: textRouter,
  image: imageRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;
