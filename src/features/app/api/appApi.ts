import { baseApi } from "@/store/api/baseApi"

// Define a service using a base URL and expected endpoints
export const appApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    dashboardEntityRankChart: builder.query({
      query: params => ({
        url: `/app/reports/entity-rank`,
        method: 'GET',
        params: params,
        credentials: "include"
      }),
      providesTags: (_, err, params) => [
        { type: 'App', id: `App_Charts` },
        { type: 'App', id: `EntityRankChart` },
      ]
    }),

    debtsVsRepaymentsChart: builder.query({
      query: params => ({
        url: `/app/reports/debts-vs-repayments`,
        method: 'GET',
        params: params,
        credentials: "include"
      }),
      providesTags: (_, err, params) => [
        { type: 'App', id: `App_Charts` },
        { type: 'App', id: `DebtsVsRepayments` },
      ]
    }),

    entityLoansTableData: builder.query({
      query: params => ({
        url: `/app/tables/entity-loans`,
        method: 'GET',
        params: params,
        credentials: "include"
      }),
      providesTags: (_, err, params) => [
        { type: 'App', id: `App_Charts` },
        { type: 'App', id: `EntityLoansTable` },
      ]
    }),
    entityLoansDetail: builder.query({
      query: params => ({
        url: `/app/tables/entity-loans/${params.id}`,
        method: 'GET',
        params,
        credentials: "include"
      }),
      providesTags: (_, err, params) => [
        { type: 'App', id: `EntityLoansTable_${params.id}` },
      ]
    }),
    bestPerformingTagsChart: builder.query({
      query: params => ({
        url: `/app/reports/best-performing-tags`,
        method: 'GET',
        params: params,
        credentials: "include"
      }),
      providesTags: (_, err, params) => [
        { type: 'App', id: `App_Charts` },
        { type: 'App', id: `BestPerformingTags` },
      ]
    }),
  })
})


export const {
  useDashboardEntityRankChartQuery,
  useLazyDashboardEntityRankChartQuery,
  useDebtsVsRepaymentsChartQuery,
  useEntityLoansTableDataQuery,
  useEntityLoansDetailQuery,
  useBestPerformingTagsChartQuery
} = appApi