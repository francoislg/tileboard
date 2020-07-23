import * as React from "react";

export const EmojiCheckbox: React.FunctionComponent<{value?: boolean}> = ({value}) => {
    const valueAsString = `${value}`;
    return <span>
        {valueAsString === "true" && "✔️"}
        {valueAsString === "false" && "🔴"}
        {valueAsString !== "true" && valueAsString !== "false" && "❓"}
    </span>
};
