import { ref } from "vue";

// To control the loading spinner
export const controlLoading = () => {
  // The loading ref
  const loading = ref(false);

  // To start the loading
  const startLoading = () => {
    loading.value = true;
  }

  // To stop the loading
  const stopLoading = () => {
    loading.value = false;
  }

  return { loading, startLoading, stopLoading };
}