import { reactive } from 'vue';

export const store = reactive({
  api_key: import.meta.env.VITE_API_KEY,

})