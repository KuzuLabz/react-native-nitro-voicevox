import { TextInput as NativeTextInput, TextInputProps } from '@expo/ui';

export const TextInput = (props: TextInputProps & { label?: string }) => {
    return(
        <NativeTextInput
            {...props}
            style={{ 
                padding: 12, 
                borderRadius: 8, 
                borderWidth: 0.5, 
                borderColor: '#000000', 
                ...props.style
            }} 
        />
    );
};