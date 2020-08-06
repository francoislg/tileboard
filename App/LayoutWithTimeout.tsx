import * as React from "react";
import { getLayoutElement } from "./factories";
import "./LayoutWithTimeout.scss";
import { useTileLastUpdateTimestamp } from "./useTileLastUpdateTimestamp";

export const LayoutWithTimeout: React.FunctionComponent<{
  id: string;
  timeInMs: number;
  title: string;
  layout?: string;
  layoutProps?: any;
  defaultLastTimestamp?: number;
}> = ({ id, timeInMs, defaultLastTimestamp, title, layout, layoutProps, children }) => {
  const [lastUpdate] = useTileLastUpdateTimestamp(id, defaultLastTimestamp || Date.now());
  const [timeoutInstance, setTimeoutInstance] = React.useState<number>();
  const [timeoutReached, setTimeoutReached] = React.useState<boolean>(false);

  const clearTimeout = React.useCallback(() => {
    self.clearTimeout(timeoutInstance);
  }, [timeoutInstance]);

  React.useEffect(() => {
    clearTimeout();
    const timeUntilTimeout = lastUpdate ? Math.max((lastUpdate + timeInMs) - Date.now(), 0) : 0;
    if (timeUntilTimeout === 0) {
      setTimeoutReached(true);
    } else {
      setTimeoutReached(false);
      const instance = self.setTimeout(() => {
        setTimeoutReached(true);
      }, timeUntilTimeout);
      setTimeoutInstance(instance);
    }
  }, [timeInMs, lastUpdate]);

  const Layout = getLayoutElement(layout);

  return (
    <Layout tileId={id} title={title} {...layoutProps}>
      {timeoutReached && (
        <div className="timeout-overlay">
          <div>Timeout reached</div>
          <div>⌛</div>
        </div>
      )}
      {children}
    </Layout>
  );
};
