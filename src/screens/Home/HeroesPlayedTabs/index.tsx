import React from 'react';
import { View } from 'react-native';
import { HeroesPlayedComponent } from './HeroesPlayedComponent';
import { HeroesPlayed } from '../../../../src/services/props';

type Props = {
    heroesPlayedList: HeroesPlayed[];
}

export function HeroesPlayedTabs({ heroesPlayedList, }: Props) {
    return (
        <HeroesPlayedComponent
            HeroesPlayedList={heroesPlayedList}
        />
    );
}