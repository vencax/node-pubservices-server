angular.module("app")

.config(['$translateProvider', function ($translateProvider) {
  $translateProvider.translations('en', {
    TITLE: 'Hello',
    LOADING: 'This is a paragraph',
    HOME: 'Hom',
    BUY: 'Buy',
    REMAINING: 'Remaining',
    EXPIRES: 'Expires',
    DESC: 'Description',
    SETTINGS: 'Settings',
    VALID_TICKETS: 'Valid tickets',
    NO_VALID_TICKETS: 'You have no valid ticket!',
    HISTORY: 'History',
    HISTORY_TITLE: 'Credit history',
    HISTORY_NOTYET: 'You have no history yet',
    IFYOUCANNOTLOGIN: 'If you cannot login, please contact us',
    INPUTPWD: 'Please input your password',
    INPUTUSERNAME: 'Please input your username',
    LOGIN: 'Log in',
    LOGOUT: 'Logout',
    REGISTER_H1: 'Please fill in the form',
    REGISTER_NAME_REQ: 'Please input your name',
    REGISTER_EMAIL_REQ: 'Please input your email',
    REGISTER_EMAIL_INVALID: 'Email is invalid',
    REGISTER_EMAIL_ALREADYREG: 'Email is already registered',
    REGISTER_PWD_REQ: 'Please input your password',
    REGISTER_PWD_REPEAT_VALID: 'Please input your password once again for sure',
    REGISTER_PWD_REPEAT_NOTMATCH: 'Both passwords doesnot match',
    RIGHTSREMOVED: 'all rights removed'
  });

  $translateProvider.translations('cs', {
    TITLE: 'Hallo',
    LOADING: 'Nahrávám',
    HOME: 'Domů',
    BUY: 'Nákup',
    EXPIRES: 'Vyprší',
    REMAINING: 'Zbývá',
    DESC: 'Popis',
    SETTINGS: 'Nastavení',
    CREDIT: 'Kredit',
    VALID_TICKETS: 'Platné jízdenky',
    NO_VALID_TICKETS: 'Nemáte žádné platné jízdenky!!',
    HISTORY: 'Historie',
    HISTORY_TITLE: 'Historie změn kreditu',
    HISTORY_NOTYET: 'Ještě se nic nestalo :)',
    LOGIN: 'Přihlásit',
    LOGOUT: 'Odhlásit',
    REGISTER: 'Zaregistrovat',
    IFYOUCANNOTLOGIN: 'Nejde-li se přihlásit, kontaktuj nás!',
    INPUTPWD: 'Prosím, zadej svoje platné heslo',
    INPUTUSERNAME: 'Prosím, zadej svoje uživatelské jmého',
    REGISTER_H1: 'Registrační formulář',
    REGISTER_NAME_REQ: 'Prosím, zadej své jmého',
    REGISTER_EMAIL_REQ: 'Prosím, zadej svůj email',
    REGISTER_EMAIL_INVALID: 'Zadaný email je neplatný',
    REGISTER_EMAIL_ALREADYREG: 'Email je již registrován',
    REGISTER_PWD_REQ: 'Prosím, zadej heslo',
    REGISTER_PWD_REPEAT_VALID: 'Zadej heslo znovu, pro kontrolu',
    REGISTER_PWD_REPEAT_NOTMATCH: 'Zadaná hesla nesouhlasí',
    RIGHTSREMOVED: 'všechna práva vyhlazena'
  });

  $translateProvider.preferredLanguage('cs');
  moment.locale('cs');
}]);
