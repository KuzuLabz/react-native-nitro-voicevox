import { View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ParentView = (props: ViewProps) => {
    const {top} = useSafeAreaInsets();
    return <View {...props} style={[{paddingTop: top}, props.style]} />
};