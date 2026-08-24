import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { VectorIcon } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLingui } from "@lingui/react/macro";
import { Theme } from '@/src/constants/theme';
import { Platform } from 'react-native';

const TabLayout = () => {
    const { t } = useLingui();
    return(
        <NativeTabs iconColor={{selected: Theme.icon}} backgroundColor={'#edeee9'} indicatorColor={Theme.ripple} rippleColor={Theme.ripple} labelStyle={{selected: {color: "#000"}}}>
            <NativeTabs.Trigger name="index">
                <NativeTabs.Trigger.Label>{t`Basic`}</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf={{selected: 'house.fill', default: 'house'}} md='home' />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="synth">
                <NativeTabs.Trigger.Label>{t`Synth`}</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf={{selected: 'wrench.fill', default: 'wrench'}} md='mobile_wrench' />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="sing">
                <NativeTabs.Trigger.Label>{t`Sing`}</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf={'music.note'} md='music_note' />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="dictionary">
                <NativeTabs.Trigger.Label>{t`User Dict`}</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf={{selected: 'book.fill', default: 'book'}} md='book' />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="misc">
                <NativeTabs.Trigger.Label>{t`Misc`}</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf={Platform.OS === 'ios' ? {selected: 'ellipsis', default: 'ellipsis'} : undefined} src={Platform.OS === 'android' ? <VectorIcon family={MaterialCommunityIcons} name="dots-horizontal" /> : undefined} />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
};

export default TabLayout;