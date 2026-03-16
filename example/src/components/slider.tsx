import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Slider } from "@react-native-assets/slider";
import { ComponentProps } from "react";
import { Text, View } from "react-native";
import { Theme } from "../constants/theme";

export const ThemedSlider = ({title, ...props}: ComponentProps<typeof Slider> & {title: string; onReset: () => void}) => {
    return(
        <View style={{gap: 8}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',}}>
                <View style={{gap: 4}}>
                    <Text style={{fontSize: 18}}>{title}</Text>
                    <Text>{props.value?.toFixed(2)}</Text>
                </View>
                <MaterialCommunityIcons name="reload" onPress={props.onReset} size={18} />
            </View>
            <Slider {...props} trackHeight={6} thumbTintColor={Theme.primary} maximumTrackTintColor={Theme.secondary} minimumTrackTintColor={Theme.primary} />
        </View>
    );
};