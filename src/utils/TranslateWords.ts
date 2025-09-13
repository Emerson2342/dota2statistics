type Languages = {
  en: string;
  pt: string;
};

const Dictionary: Record<string, Languages> = {
  scepter: {
    en: "Aghanim's Scepter",
    pt: "Cetro de Aghanim",
  },
  shard: {
    en: "Aghanim's Shard",
    pt: "Fragmento de Aghanim",
  },
  ability: {
    en: "Ability",
    pt: "Habilidade",
  },
  No: {
    en: "No",
    pt: "Não",
  },
  Yes: {
    en: "Yes",
    pt: "No",
  },
  pierceBkb: {
    en: "Pierce BKB",
    pt: "Ignora BKB",
  },
  damageType: {
    en: "Damage Type",
    pt: "Tipo de Dano",
  },
  dispellable: {
    en: "Dispellable",
    pt: "Dissipável",
  },
  magical: {
    en: "Magical",
    pt: "Mágico",
  },
  physical: {
    en: "Physical",
    pt: "Físico",
  },
  pure: {
    en: "Pure",
    pt: "Puro",
  },
};

export function Words(key: keyof typeof Dictionary, isEnglish: boolean) {
  return isEnglish ? Dictionary[key].en : Dictionary[key].pt;
}
