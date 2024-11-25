<template>
    <v-app>
        <DashboardView :dark-mode-on="darkModeOn" @toggle-theme="toggleTheme()" />
    </v-app>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import DashboardView from './views/DashboardView.vue';
import { useTheme } from 'vuetify';

const theme = useTheme();

const darkModeOn = computed(() => theme.global.current.value.dark);

function toggleTheme() {
    theme.global.name.value = darkModeOn.value ? 'light' : 'dark';
}
</script>

<style scoped>
</style>
