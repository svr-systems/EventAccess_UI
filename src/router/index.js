import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";

const base = import.meta.env.BASE_URL || "/";
const history = createWebHistory(base);

const router = createRouter({ history, routes });

const normalizeMiddleware = (mw) => (Array.isArray(mw) ? mw : mw ? [mw] : []);

const runPipeline =
  (to, from, next, chain, index = 0) =>
  (params) => {
    if (params) return next(params);

    const current = chain[index];
    if (!current) return next();

    const nextStep = runPipeline(to, from, next, chain, index + 1);

    if (typeof current === "function") {
      return current(to, from, nextStep);
    }

    if (current && typeof current.guard === "function") {
      return current.guard(to, from, nextStep);
    }

    return nextStep();
  };

router.beforeEach((to, from, next) => {
  const chain = normalizeMiddleware(to.meta?.middleware);

  if (chain.length === 0) return next();

  return runPipeline(to, from, next, chain)();
});

const appName = import.meta.env.VITE_APP_NAME || "App";

router.afterEach((to) => {
  document.title = to.meta?.title ? `${appName} | ${to.meta.title}` : appName;
});

export default router;
