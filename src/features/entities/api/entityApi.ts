import { baseApi } from "@/store/api/baseApi"

// Define a service using a base URL and expected endpoints
export const entityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createEntity: builder.mutation({
      query: payload => ({
        url: '/entities',
        method: 'POST',
        body: payload,
        credentials: "include"
      }),
      invalidatesTags: [
        { type: 'Entity', id: 'MY_ENTITES' },        
        { type: 'App', id: `App_Charts` },                
      ]
    }),
    editEntity: builder.mutation({
      query: payload => ({
        url: `/entities/${payload.id}`,
        method: 'PUT',
        body: payload,
        credentials: "include"
      }),
      invalidatesTags: [
        { type: 'Entity', id: 'MY_ENTITES' },        
        { type: 'App', id: `App_Charts` },        
      ]
    }),   
    listMyEntities: builder.query({
      query: params => ({
        url: `/entities`,
        method: 'GET',
        params: params,
        credentials: "include"
      }),
      providesTags: [
        { type: 'Entity', id: 'MY_ENTITES' }
      ]
    }),
    listMyEntitiesMinimal: builder.query({
      query: params => ({
        url: `/entities/minimal`,
        method: 'GET',
        params: params,
        credentials: "include"
      }),
      providesTags: [
        { type: 'Entity', id: 'MY_ENTITES' },
        { type: 'Entity', id: 'MY_ENTITES_MINIMAL' }
      ]
    }),
    getEntityDetail: builder.query({
      query: params => ({
        url: `/entities/${params.id}`,
        method: 'GET',
        params: params,
        credentials: "include"
      }),
      providesTags: (_, err, params) => [
        { type: 'Entity', id: `ENTITY_DETAIL_${params.id}` }
      ]
    }),
    getEntityDetailCharts: builder.query({
      query: params => ({
        url: `/entities/${params.id}/charts`,
        method: 'GET',
        params: params,
        credentials: "include"
      }),
      providesTags: (_, err, params) => [
        { type: 'Entity', id: `ENTITY_DETAIL_${params.id}_Charts` },
        { type: 'Entity', id: `ENTITY_DETAIL_${params.id}` }
      ]
    }),
    softDeleteEntity: builder.mutation({
      query: params => ({
        url: `/entities/${params.id}`,
        method: 'DELETE',
        params: params,
        body: params,
        credentials: "include"
      }),
      invalidatesTags: (_, err, params) => [
        { type: 'Entity', id: `ENTITY_DETAIL_${params.id}` },
        { type: 'Entity', id: 'MY_ENTITES' },        
        { type: 'App', id: `App_Charts` },        

      ]
    }),
    restoreEntity: builder.mutation({
      query: body => ({
        url: `/entities/${body.id}/restore`,
        method: 'PUT',
        body,
        credentials: "include"
      }),
      invalidatesTags: (_, err, body) => [
        { type: 'Entity', id: `ENTITY_DETAIL_${body.id}` },
        { type: 'Entity', id: 'MY_ENTITES' },        
        { type: 'App', id: `App_Charts` },        

      ]
    }),   
    updateAvatar: builder.mutation({
      query: body => ({
        url: `/entities/${body.id}/avatar`,
        method: 'PUT',
        body: body.formData,
        credentials: "include",
      }),
      invalidatesTags: (_, err, body) => [
        { type: 'Entity', id: `ENTITY_DETAIL_${body.id}` },
        { type: 'Entity', id: 'MY_ENTITES' },        
        { type: 'App', id: `App_Charts` },        

      ]
    }),   
  }),
})


export const {
  useCreateEntityMutation,
  useEditEntityMutation,
  useListMyEntitiesQuery,
  useLazyListMyEntitiesQuery,  
 useSoftDeleteEntityMutation,
 useRestoreEntityMutation,
  useGetEntityDetailQuery,
  useLazyGetEntityDetailQuery,
  useListMyEntitiesMinimalQuery,
  useLazyListMyEntitiesMinimalQuery,
  useUpdateAvatarMutation,
  useGetEntityDetailChartsQuery,
  useLazyGetEntityDetailChartsQuery
} = entityApi