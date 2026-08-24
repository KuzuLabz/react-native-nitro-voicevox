import { Host, UniversalHostProps } from "@expo/ui";
import { Theme } from "../constants/theme";
import { Appearance } from "react-native";

export const ThemedHost = (props: UniversalHostProps) => {
    return <Host colorScheme={Appearance.getColorScheme() === 'dark' ? 'dark' : 'light'} seedColor={Theme.primary} {...props} />
};