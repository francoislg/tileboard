import { useTileListener } from "./useTileListener";
import * as React from "react";
import { getLayoutElement } from "./factories";

export const LayoutWithTimeout: React.FunctionComponent<{
  id: string;
  timeInMs: number;
  layout?: string;
}> = ({ id, timeInMs, layout, children }) => {
  const [timeoutInstance, setTimeoutInstance] = React.useState<number>();
  const [timeoutReached, setTimeoutReached] = React.useState<boolean>(false);

  const resetTimeout = React.useCallback(() => {
    setTimeoutReached(false);
    const instance = self.setTimeout(() => {
      setTimeoutReached(true);
    }, timeInMs);
    setTimeoutInstance(instance);
  }, [timeInMs]);

  const clearTimeout = React.useCallback(() => {
    self.clearTimeout(timeoutInstance);
  }, [timeoutInstance]);

  useTileListener(id, () => {
    clearTimeout();
    resetTimeout();
  });

  React.useEffect(() => {
    resetTimeout();
  }, []);

  const Layout = getLayoutElement(layout);

  return (
    <Layout id={id}>
      {timeoutReached && <span>Timeout reached</span>}
      <span style={timeoutReached ? {display: 'none' } : {}}>{children}</span>
    </Layout>
  );
};
