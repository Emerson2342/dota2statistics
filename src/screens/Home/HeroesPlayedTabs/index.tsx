import React from 'react';
import { View } from 'react-native';
import { HeroesPlayedComponent } from './HeroesPlayedComponent';
import { HeroesPlayed } from '../../../../src/services/props';

type Props = {
    heroesPlayedList: HeroesPlayed[];
    successPlayerAccount: boolean;
    setSteamIdComponent: React.ComponentType;
}

export function HeroesPlayedTabs({ heroesPlayedList, setSteamIdComponent, successPlayerAccount }: Props) {
    return (
        <HeroesPlayedComponent
            HeroesPlayedList={heroesPlayedList}
            successPlayerAccount={
                successPlayerAccount
            }
            SetSteamId={setSteamIdComponent}
        />
    );
}