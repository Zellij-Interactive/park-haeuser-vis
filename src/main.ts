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
                    background: colors.grey.lighten5,
                    primary: colors.teal.darken3,
                    secondary: colors.grey.lighten5,
                },
            },
            dark: {
                dark: true,
                colors: {
                    background: colors.grey.darken4,
                    primary: colors.teal.darken2,
                    secondary: colors.grey.darken3,
                },
            },
        },
    },
});

app.use(createPinia());
app.use(vuetify);

await parkingGarageApi.loadCSVData();

app.mount('#app');
