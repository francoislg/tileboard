import { ITileConfig, IAppConfig } from "../TileConfig";

export interface IDefaultLayoutProps {
    tileId: string;
    appConfig: IAppConfig;
    title?: string;
    width?: number;
    height?: number;
    break?: boolean;
}