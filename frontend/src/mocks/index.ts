export const enableMocking = async () => {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  if (process.env.REACT_APP_USE_MOCK === "false") {
    return;
  }

  const { worker } = await import("./browser");
  return worker.start({
    onUnhandledRequest: "bypass",
  });
};
