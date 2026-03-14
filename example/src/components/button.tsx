import { ActivityIndicator, Pressable, PressableProps, Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ComponentProps } from "react";
import { Theme } from "../constants/theme";

export const Button = ({ isLoading = false, ...props}: PressableProps & {title: string, isLoading?: boolean, icon?: ComponentProps<typeof MaterialCommunityIcons>['name']}) => {
    return <Pressable 
        {...props} 
        style={{ 
            backgroundColor: props.disabled ? Theme.secondary : Theme.primary, 
            borderRadius: 6, 
            padding: 12, 
            minWidth: 110, 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexDirection: 'row',
        }}>
            <Text style={{fontWeight: '500', fontSize: 14}}>{props.title}</Text>
            <View style={{alignItems: 'center'}}>
                {props.icon && !isLoading ? <MaterialCommunityIcons name={props.icon} size={18} /> : <ActivityIndicator animating={isLoading} />}
            </View>
        </Pressable>
};