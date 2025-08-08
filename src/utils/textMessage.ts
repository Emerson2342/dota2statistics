
export function getErro404Message(englishLanguage: boolean) {
   return englishLanguage
      ? "Please, make sure the Steam Id is correct and the profile is set to public!"
      : "Por favor, certifique-se de que o Id da Steam esteja correto e que o perfil esteja com visibilidade para o público!";
}

export function getSetProfile(englishLanguage: boolean) {
   return englishLanguage
      ? "To see the list of heroes played, add your Steam ID on My Profile tabs."
      : "Para ver a lista de heróis jogados, adicione o ID da Steam na aba Meu Perfil"
}
