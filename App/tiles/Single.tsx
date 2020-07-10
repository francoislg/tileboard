import React from "react";
import { useTileUpdate } from "./useTileUpdate";

export interface ISingleProps {
    id: string;
}

export const Single: React.FunctionComponent<ISingleProps> = ({id}) => {
    const [value, _] = useTileUpdate(id, '');

    return <div>
        TILE:
        {value}
    </div>
}