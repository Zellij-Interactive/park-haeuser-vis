<template>
    <v-app>
        <div class="toggle-theme">
            <v-btn @click="toggleTheme" color="primary" density="compact"
                ><v-icon>mdi-theme-light-dark</v-icon></v-btn
            >
        </div>
        <DashboardView :dark-mode-on="darkModeOn" />
    </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import DashboardView from './views/DashboardView.vue';
import { useTheme } from 'vuetify';

const theme = useTheme();

const darkModeOn = computed(() => theme.global.current.value.dark);

function toggleTheme() {
    theme.global.name.value = darkModeOn.value ? 'light' : 'dark';
}
</script>

<style scoped>
.toggle-theme {
    position: absolute;
    top: 40px;
    left: 70px;
    z-index: 1;
}
</style>
