import { baseApi } from "./baseApi"

// Define a service using a base URL and expected endpoints
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: payload => ({
        url: '/auth/register',
        method: 'POST',
        body: payload,
      }),
    }),
    login: builder.mutation({
      query: payload => ({
        url: '/auth/login',
        method: 'POST',
        body: payload,
        credentials: "include"
      }),
      invalidatesTags:[
        { type: 'User', id: 'ProfileInfo' }
      ]
    }),
    logout: builder.mutation({
      query: payload => ({
        url: '/auth/logout',
        method: 'POST',
        body: payload,
        credentials: "include"
      }),
    }),
    myInfo: builder.query({
      query: params => ({
        url: '/auth/me',
        method: 'GET',
        params,
        credentials: "include"
      }),
      providesTags: [
        { type: 'User', id: 'ProfileInfo' }
      ]
    }),
    updateProfile: builder.mutation({
      query: payload => ({
        url: `/auth/profile`,
        method: 'PUT',
        body: payload,
        credentials: "include"
      }),
      invalidatesTags: [
        { type: 'User', id: 'ProfileInfo' }
      ]
    }),
  }),
})


export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useMyInfoQuery,
  useUpdateProfileMutation
} = authApi