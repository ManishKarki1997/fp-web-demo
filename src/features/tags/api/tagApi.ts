import { baseApi } from "@/store/api/baseApi"

// Define a service using a base URL and expected endpoints
export const tagApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTag: builder.mutation({
      query: payload => ({
        url: '/tags',
        method: 'POST',
        body: payload,
        credentials: "include"
      }),
      invalidatesTags: [
        { type: 'Tags', id: 'MY_TAGS' },        
      ]
    }),
    editTag: builder.mutation({
      query: payload => ({
        url: `/tags/${payload.id}`,
        method: 'PUT',
        body: payload,
        credentials: "include"
      }),
      invalidatesTags: [
        { type: 'Tags', id: 'MY_TAGS' },        
      ]
    }),
    listMyTags: builder.query({
      query: params => ({
        url: `/tags`,
        method: 'GET',
        params: params,
        credentials: "include"
      }),
      providesTags: [
        { type: 'Tags', id: 'MY_TAGS' }
      ]
    }),
    listMyTagsMinimal: builder.query({
      query: params => ({
        url: `/tags/minimal`,
        method: 'GET',
        params: params,
        credentials: "include"
      }),
      providesTags: [
        { type: 'Tags', id: 'MY_TAGS' },
        { type: 'Tags', id: 'MY_TAGS_MINIMAL' }
      ]
    }),
    getTagDetail: builder.query({
      query: params => ({
        url: `/tags/${params.id}`,
        method: 'GET',
        params: params,
        credentials: "include"
      }),
      providesTags: (_, err, params) => [
        { type: 'Tags', id: `ENTITY_DETAIL_${params.id}` }
      ]
    }),
    softDeleteTag: builder.mutation({
      query: params => ({
        url: `/tags/${params.id}`,
        method: 'DELETE',
        params: params,
        body: params,
        credentials: "include"
      }),
      invalidatesTags: (_, err, params) => [
        { type: 'Tags', id: `ENTITY_DETAIL_${params.id}` },
        { type: 'Tags', id: 'MY_TAGS' },        

      ]
    }),
    restoreTag: builder.mutation({
      query: body => ({
        url: `/tags/${body.id}/restore`,
        method: 'PUT',
        body,
        credentials: "include"
      }),
      invalidatesTags: (_, err, body) => [
        { type: 'Tags', id: `ENTITY_DETAIL_${body.id}` },
        { type: 'Tags', id: 'MY_TAGS' },        

      ]
    }),   
  }),
})


export const {
  useCreateTagMutation,
  useEditTagMutation,
  useListMyTagsQuery,
  useLazyListMyTagsQuery,  
 useSoftDeleteTagMutation,
 useRestoreTagMutation,
  useGetTagDetailQuery,
  useLazyGetTagDetailQuery,
  useListMyTagsMinimalQuery,
  useLazyListMyTagsMinimalQuery
} = tagApi