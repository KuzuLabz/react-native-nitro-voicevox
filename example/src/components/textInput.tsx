import { TextInput, TextInputProps } from "react-native";

export const VvTextInput = (props: TextInputProps) => {
    return <TextInput {...props} style={[{width: '100%', borderRadius: 8, borderWidth: 1, padding: 8, fontSize: 16}, props.style]} />
};