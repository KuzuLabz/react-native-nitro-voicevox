import { TextInputProps } from '@expo/ui';
import { OutlinedTextField, Text, TextField } from '@expo/ui/jetpack-compose';
import { fillMaxWidth } from '@expo/ui/jetpack-compose/modifiers';

export const TextInput = (props: TextInputProps & {label?: string}) => {
    return(
        <OutlinedTextField
            {...props}
            modifiers={[fillMaxWidth()]}
        >
            {props.label && <OutlinedTextField.Label><Text>{props.label}</Text></OutlinedTextField.Label>}
        </OutlinedTextField>
    );
};