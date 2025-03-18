import { baseApi } from "./baseApi"

// Define a service using a base URL and expected endpoints
export const alertApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAlert: builder.mutation({
      query: payload => ({
        url: '/alerts',
        method: 'POST',
        body: payload,
        credentials: "include"
      }),
      invalidatesTags: [
        { type: 'Alert', id: 'MY_ALERTS' },
        { type: 'Alert', id: 'MY_ALERT_LOGS' }
      ]
    }),
    listMyAlerts: builder.query({
      query: params => ({
        url: `/alerts/my-alerts`,
        method: 'GET',
        params: params,
        credentials: "include"
      }),
      providesTags: [
        { type: 'Alert', id: 'MY_ALERTS' }
      ]
    }),
    getAlertDetail: builder.query({
      query: params => ({
        url: `/alerts/${params.id}`,
        method: 'GET',
        params: params,
        credentials: "include"
      }),
      providesTags: (_, err, params) => [
        { type: 'Alert', id: `ALERT_DETAIL_${params.id}` }
      ]
    }),
    updateAlertDetail: builder.mutation({
      query: body => ({
        url: `/alerts/${body.id}`,
        method: 'PUT',
        body: body,
        credentials: "include"
      }),
      invalidatesTags: (_, err, body) => [
        { type: 'Alert', id: `ALERT_DETAIL_${body.id}` },
        { type: 'Alert', id: 'MY_ALERTS' },
        { type: 'Alert', id: 'MY_ALERT_LOGS' }
      ]
    }),
    deleteAlert: builder.mutation({
      query: params => ({
        url: `/alerts/${params.id}`,
        method: 'DELETE',
        params: params,
        credentials: "include"
      }),
      invalidatesTags: (_, err, params) => [
        { type: 'Alert', id: `ALERT_DETAIL_${params.id}` },
        { type: 'Alert', id: 'MY_ALERTS' },
        { type: 'Alert', id: 'MY_ALERT_LOGS' }

      ]
    }),
    testAlert: builder.mutation({
      query: body => ({
        url: `/alerts/${body.id}/test`,
        method: 'POST',
        body: body,
        credentials: "include"
      }),      
      invalidatesTags:[
        { type: 'Alert', id: 'MY_ALERT_LOGS' }
      ]
    }),
    listMyAlertLogs: builder.query({
      query: params => ({
        url: `/alerts/my-alert-logs`,
        method: 'GET',
        params: params,
        credentials: "include"
      }),
      providesTags: [
        { type: 'Alert', id: 'MY_ALERT_LOGS' }
      ]
    }),
  }),
})


export const {
  useCreateAlertMutation,
  useListMyAlertsQuery,
  useLazyListMyAlertsQuery,
  useListMyAlertLogsQuery,
  useLazyListMyAlertLogsQuery,
  useGetAlertDetailQuery,
  useLazyGetAlertDetailQuery,
  useUpdateAlertDetailMutation,
  useDeleteAlertMutation,
  useTestAlertMutation
} = alertApi