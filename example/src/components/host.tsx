import { Host, UniversalHostProps } from "@expo/ui";
import { Theme } from "../constants/theme";

export const ThemedHost = (props: UniversalHostProps) => {
    return <Host seedColor={Theme.primary} {...props} />
};