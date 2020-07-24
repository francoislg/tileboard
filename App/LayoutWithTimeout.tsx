import { useTileListener } from "./useTileListener";
import * as React from "react";
import { getLayoutElement } from "./factories";
import "./LayoutWithTimeout.scss";
import { IAppConfig } from "./TileConfig";

export const LayoutWithTimeout: React.FunctionComponent<{
  id: string;
  timeInMs: number;
  title: string;
  appConfig: IAppConfig;
  layout?: string;
  layoutProps?: any;
}> = ({ id, timeInMs, title, appConfig, layout, layoutProps, children }) => {
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
    <Layout tileId={id} appConfig={appConfig} title={title} {...layoutProps}>
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
