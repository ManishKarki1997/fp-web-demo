import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { APP_CONFIG } from "@/config/config";

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: `${APP_CONFIG.VITE_APP_BACKEND_API_URL}/api` }),
  endpoints: () => ({}),
  tagTypes:['User',"Alert","Entity","Transaction","Tags","App"]
})