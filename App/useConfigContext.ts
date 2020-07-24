import * as React from "react";
import { IAppConfig } from "./TileConfig";

const ConfigContext = React.createContext<IAppConfig>({
    tiles: []
});

export const ConfigContextProvider = ConfigContext.Provider;
export const useConfigContext = () => React.useContext(ConfigContext);