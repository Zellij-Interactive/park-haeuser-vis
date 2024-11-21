import type { Ref } from 'vue';

export async function usingIndicator(
    isLoading: Ref<boolean>,
    operation: () => Promise<void>
): Promise<void> {
    isLoading.value = true;
    await operation().finally(() => {
        isLoading.value = false;
    });
}
