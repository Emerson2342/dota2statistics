import React, { useEffect, useState } from 'react';
import { Button, Platform, StatusBar, View } from 'react-native';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-4117477719356991/7268753952';

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
    keywords: ['fashion', 'clothing'],
});
export function InterstitialAds() {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
            setLoaded(true);
        });

        const unsubscribeOpened = interstitial.addAdEventListener(AdEventType.OPENED, () => {
            if (Platform.OS === 'ios') {
                // Prevent the close button from being unreachable by hiding the status bar on iOS
                StatusBar.setHidden(true);
            }
        });

        const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
            if (Platform.OS === 'ios') {
                StatusBar.setHidden(false);
            }
        });

        // Start loading the interstitial straight away
        interstitial.load();

        // Unsubscribe from events on unmount
        return () => {
            unsubscribeLoaded();
            unsubscribeOpened();
            unsubscribeClosed();
        };
    }, []);



    return (
        <Button
            title="Show Interstitial"
            onPress={() => {
                interstitial.show();
            }}
        />
    );
}