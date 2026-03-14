import { Stack } from "expo-router";
import { VoicevoxProvider } from "../providers/voicevox";
import { I18nProvider, TransRenderProps } from "@lingui/react";
import { i18n } from "@lingui/core";
import { Text } from "react-native";
import { getLocales } from 'expo-localization';
import { messages } from '@/locales/en/messages.po';
import { messages as messagesJa } from '@/locales/ja/messages.po';

const getDeviceLocale = () => {
    const deviceLang = getLocales()[0].languageCode;
    return deviceLang === 'ja' || deviceLang === 'ja-JP' ? 'ja' : 'en';
};
const locale = getDeviceLocale();
i18n.loadAndActivate({locale: locale, messages: locale === 'en' ? messages : messagesJa});

const DefaultComponent = (props: TransRenderProps) => {
  return <Text>{props.children}</Text>;
};

export default function RootLayout() {
  return <VoicevoxProvider>
    <I18nProvider i18n={i18n} defaultComponent={DefaultComponent}>
        <Stack screenOptions={{headerShown: false, animation: 'slide_from_left'}}>
            <Stack.Screen name="(tabs)" />
        </Stack>
    </I18nProvider>
  </VoicevoxProvider>;
}
