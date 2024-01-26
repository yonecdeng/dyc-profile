import DefaultTheme from "vitepress/theme";

import * as Sentry from "@sentry/vue";
import "./custom.css";
console.log("import.meta.env.SSR", import.meta.env.SSR);
DefaultTheme.enhanceApp = async ({ app, router, siteData }) => {
  if (!import.meta.env.SSR) {
    const { closeGlobalLoading, showGlobalLoading } = await import(
      "../../src/utils/loading"
    );
    router.onBeforeRouteChange = () => {
      showGlobalLoading();
    };
    router.onAfterRouteChanged = () => {
      closeGlobalLoading();
    };
    Sentry.init({
      app,
      dsn: "https://68809e9594034cc563582ab1eb84df8c@o4506629750718464.ingest.sentry.io/4506629776015360",
      integrations: [new Sentry.BrowserTracing({}), new Sentry.Replay()],

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,

      // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: [
        "localhost",
        /^https:\/\/dyc-profile\.vercel\.app/,
      ],

      // Capture Replay for 10% of all sessions,
      // plus for 100% of sessions with an error
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  }
};
export default DefaultTheme;
