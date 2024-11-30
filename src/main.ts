import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';

// Vuetify
import 'vuetify/styles';
import { createVuetify, type ThemeDefinition } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { parkingGarageApi } from './parkingGarage/parkingGarageFakeApi';
import colors from 'vuetify/util/colors';
import 'vuetify/styles';

const customLightTheme: ThemeDefinition = {
    dark: false,
    colors: {
        primary: colors.cyan.darken4, // #006064
        secondary: colors.blueGrey.lighten5, // #ECEFF1
    },
};

const customDarkTheme: ThemeDefinition = {
    dark: true,
    colors: {
        primary: colors.cyan.darken2, // #0097A7
        secondary: colors.blueGrey.darken4, // #263238
    },
};

const app = createApp(App);
const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light',
        themes: {
            light: customLightTheme,
            dark: customDarkTheme,
        },
    },
});

app.use(createPinia());
app.use(vuetify);

await parkingGarageApi.loadCSVData();

app.mount('#app');
