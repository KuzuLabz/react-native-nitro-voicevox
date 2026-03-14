import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Icon, VectorIcon } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLingui } from "@lingui/react/macro";
import { Theme } from '@/src/constants/theme';

const TabLayout = () => {
    const { t } = useLingui();
    return(
        <NativeTabs iconColor={{selected: Theme.primary}} labelStyle={{selected: {color: "#000"}}}>
            <NativeTabs.Trigger name="index">
                <NativeTabs.Trigger.Label>{t`Basic`}</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf={{selected: 'house.fill', default: 'house'}} md='home' />
                {/* <Icon src={<VectorIcon family={MaterialCommunityIcons} name="home" />} /> */}
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="synth">
                <NativeTabs.Trigger.Label>{t`Synth`}</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf={{selected: 'wrench.fill', default: 'wrench'}} md='mobile_wrench' />
                {/* <Icon src={{"default": <VectorIcon family={MaterialCommunityIcons} name="wrench-outline" />, "selected": <VectorIcon family={MaterialCommunityIcons} name="wrench" />}} /> */}
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="sing">
                <NativeTabs.Trigger.Label>{t`Sing`}</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf={'music.note'} md='music_note' />
                {/* <Icon src={{"default": <VectorIcon family={MaterialCommunityIcons} name="music-note-outline" />, "selected": <VectorIcon family={MaterialCommunityIcons} name="music-note" />}} /> */}
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="dictionary">
                <NativeTabs.Trigger.Label>{t`User Dict`}</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf={{selected: 'book.fill', default: 'book'}} md='book' />
                {/* <Icon src={{"default": <VectorIcon family={MaterialCommunityIcons} name="book-outline" />, "selected": <VectorIcon family={MaterialCommunityIcons} name="book" />}} /> */}
            </NativeTabs.Trigger>
            {/* <NativeTabs.Trigger name="settings">
                <Label>{t`Settings`}</Label>
                <Icon src={{"default": <VectorIcon family={MaterialCommunityIcons} name="cog-outline" />, "selected": <VectorIcon family={MaterialCommunityIcons} name="cog" />}} />
            </NativeTabs.Trigger> */}
        </NativeTabs>
    );
};

export default TabLayout;