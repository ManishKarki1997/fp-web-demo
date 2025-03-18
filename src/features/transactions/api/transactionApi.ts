import { baseApi } from "@/store/api/baseApi"

// Define a service using a base URL and expected endpoints
export const transactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTransaction: builder.mutation({
      query: payload => ({
        url: '/transactions',
        method: 'POST',
        body: payload.payload,
        credentials: "include"
      }),
      invalidatesTags: [
        { type: 'Transaction', id: 'MY_TRANSACTIONS' },    
        { type: 'Entity', id: 'MY_ENTITES' },    
        { type: 'Transaction', id: 'MY_LOAN_TRANSACTIONS' },
        { type: 'Transaction', id: 'MY_LOAN_TRANSACTIONS_MINIMAL' }
      ]
    }),
    editTransaction: builder.mutation({
      query: payload => ({
        url: `/transactions/${payload.id}`,
        method: 'PUT',
        body: payload.payload,
        credentials: "include"
      }),
      invalidatesTags: [
        { type: 'Transaction', id: 'MY_TRANSACTIONS' },  
        { type: 'Entity', id: 'MY_ENTITES' },      
        { type: 'App', id: `App_Charts` },    
        { type: 'Transaction', id: 'MY_LOAN_TRANSACTIONS' },
        { type: 'Transaction', id: 'MY_LOAN_TRANSACTIONS_MINIMAL' }    
      ]
    }),
    listMyTransactions: builder.query({
      query: params => ({
        url: `/transactions`,
        method: 'GET',
        params: params,
        credentials: "include"
      }),
      providesTags: [
        { type: 'Transaction', id: 'MY_TRANSACTIONS' }
      ]
    }),
    listMyTransactionsMinimal: builder.query({
      query: params => ({
        url: `/transactions/minimal`,
        method: 'GET',
        params: params,
        credentials: "include"
      }),
      providesTags: [
        { type: 'Transaction', id: 'MY_TRANSACTIONS' },
        { type: 'Transaction', id: 'MY_TRANSACTIONS_MINIMAL' }
      ]
    }),
    listLoanTransactionsMinimal: builder.query({
      query: params => ({
        url: `/transactions/minimal-loan`,
        method: 'GET',
        params: params,
        credentials: "include"
      }),
      providesTags: [
        { type: 'Transaction', id: 'MY_LOAN_TRANSACTIONS' },
        { type: 'Transaction', id: 'MY_LOAN_TRANSACTIONS_MINIMAL' }
      ]
    }),
    getTransactionDetail: builder.query({
      query: params => ({
        url: `/transactions/${params.id}`,
        method: 'GET',
        params: params,
        credentials: "include"
      }),
      providesTags: (_, err, params) => [
        { type: 'Transaction', id: `ENTITY_DETAIL_${params.id}` }
      ]
    }),
    deleteTransaction: builder.mutation({
      query: params => ({
        url: `/transactions/${params.id}`,
        method: 'DELETE',
        params: params,
        body: params,
        credentials: "include"
      }),
      invalidatesTags: (_, err, params) => [
        { type: 'Transaction', id: `ENTITY_DETAIL_${params.id}` },
        { type: 'Transaction', id: 'MY_TRANSACTIONS' },  
        { type: 'Entity', id: 'MY_ENTITES' },      
        { type: 'App', id: `App_Charts` },        

      ]
    }),   
    markTransactionLoanAsCompleted: builder.mutation({
      query: params => ({
        url: `/transactions/${params.id}/complete`,
        method: 'PUT',        
        body: params,
        credentials: "include"
      }),
      invalidatesTags: (_, err, params) => [
        { type: 'Transaction', id: `ENTITY_DETAIL_${params.id}` },
        { type: 'Transaction', id: 'MY_TRANSACTIONS' },  
        { type: 'Entity', id: 'MY_ENTITES' },      
        { type: 'App', id: `App_Charts` },        

      ]
    }),   
  }),
})


export const {
  useCreateTransactionMutation,
  useEditTransactionMutation,
  useListMyTransactionsQuery,
  useLazyListMyTransactionsQuery,  
 useDeleteTransactionMutation,
  useGetTransactionDetailQuery,
  useLazyGetTransactionDetailQuery,
  useListMyTransactionsMinimalQuery,
  useLazyListMyTransactionsMinimalQuery,
  useListLoanTransactionsMinimalQuery,
  useLazyListLoanTransactionsMinimalQuery,
  useMarkTransactionLoanAsCompletedMutation
} = transactionApi