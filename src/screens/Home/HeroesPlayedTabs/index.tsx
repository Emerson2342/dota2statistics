import React from 'react';
import { View } from 'react-native';
import { HeroesPlayedComponent } from './HeroesPlayedComponent';
import { HeroesPlayed } from '../../../../src/services/props';

type Props = {
    PlayerId: string;
    heroesPlayedList: HeroesPlayed[];
}

export function HeroesPlayedTabs({ heroesPlayedList, PlayerId }: Props) {
    return (
        <HeroesPlayedComponent
            HeroesPlayedList={heroesPlayedList}
            PlayerId={PlayerId}
        />
    );
}