import { useTileListener } from "./useTileListener";
import * as React from "react";

export const TileWithTimeout: React.FunctionComponent<{
  id: string;
  timeInMs: number;
}> = ({ id, timeInMs, children }) => {
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

  return (
    <>
      {timeoutReached && <div>Tile timeout</div>}
      <span style={{ display: timeoutReached ? "none" : "inline-block" }}>
        {children}
      </span>
    </>
  );
};
