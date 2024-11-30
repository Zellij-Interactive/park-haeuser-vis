import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { parkingGarageApi } from './parkingGarage/parkingGarageFakeApi';
import colors from 'vuetify/util/colors';
import 'vuetify/styles';

const app = createApp(App);
const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                dark: false,
                colors: {
                    primary: colors.cyan.darken4, // #006064
                    secondary: colors.blueGrey.lighten5, // #ECEFF1
                },
            },
            dark: {
                dark: true,
                colors: {
                    primary: colors.cyan.darken2, // #0097A7
                    secondary: colors.blueGrey.darken4, // #263238
                },
            },
        },
    },
});

app.use(createPinia());
app.use(vuetify);

await parkingGarageApi.loadCSVData();

app.mount('#app');
