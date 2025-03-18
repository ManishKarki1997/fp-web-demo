import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CalendarIcon, FilterIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDashboardEntityRankChartQuery, useDebtsVsRepaymentsChartQuery } from '../../api/appApi'

import AppHeaderPortal from '@/components/layout/AppHeaderPortal';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { EntityRankChartShemaType } from '../../types/AppTypes'
import React from 'react'
import Spinner from '@/components/ui/spinner';
import { TransactionTypes } from '@/features/transactions/constants/TransactionConstants';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next'

const DebtsVsRepaymentsChart = () => {

  const [filters, setFilters] = React.useState<EntityRankChartShemaType>({
    fromDate: '',
    toDate: '',
    type: "Payment",
    maxEntities: 10
  })

  const { t } = useTranslation()
  const { data: entityDetailChartsObj = {}, isFetching: isFetchingEntityDetailCharts } = useDebtsVsRepaymentsChartQuery({ ...filters })
  const chartData = entityDetailChartsObj?.chartData ?? []

  return (
    <div>



      <div className='mb-4 flex items-center justify-between gap-2'>
        <div className=" bg-sidebar text-primary border border-input px-6 py-2 rounded  flex items-center gap-2">
          <h2 className='font-medium'>{t("Debt Vs Repayments")}</h2>
          {
            isFetchingEntityDetailCharts &&
            <Spinner size={24} />
          }
        </div>


        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "gap-2 min-w-max"
              )}
            >
              <FilterIcon size={16} />
              {t("Filters")}
            </Button>
          </PopoverTrigger>

          <PopoverContent className='space-y-6'>

            <div>
              <p className='font-medium'>Type</p>
              <Select
                value={filters.type}
                onValueChange={_type => {
                  setFilters(prev => ({
                    ...prev,
                    type: _type
                  }))
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {
                    TransactionTypes.map(type => (
                      <SelectItem key={type} value={type}>{t(type)}</SelectItem>

                    ))
                  }
                </SelectContent>
              </Select>
            </div>


            <div>
              <p className='font-medium'>Top Entities</p>
              <Select
                value={String(filters.maxEntities ?? "")}
                onValueChange={_type => {
                  setFilters(prev => ({
                    ...prev,
                    maxEntities: +_type
                  }))
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Max Entities" />
                </SelectTrigger>
                <SelectContent>
                  {
                    [2, 5, 10, 15].map(maxEntities => (
                      <SelectItem key={maxEntities} value={String(maxEntities)}>{maxEntities}</SelectItem>

                    ))
                  }
                </SelectContent>
              </Select>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <div>
                  <p className='font-medium'>From</p>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal !mt-0",
                      !filters.fromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.fromDate ? format(filters.fromDate, "PPP") : <span>{t("From Date")}</span>}
                  </Button>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.fromDate ? new Date(filters.fromDate) : new Date()}
                  onSelect={date => {
                    setFilters(prev => ({
                      ...prev,
                      fromDate: date?.toString()
                    }))
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>


            <Popover>
              <PopoverTrigger asChild>
                <div>
                  <p className='font-medium'>To</p>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal !mt-0",
                      !filters.toDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.toDate ? format(filters.toDate, "PPP") : <span>{t("To Date")}</span>}
                  </Button>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.toDate ? new Date(filters.toDate) : new Date()}
                  onSelect={date => {
                    setFilters(prev => ({
                      ...prev,
                      toDate: date?.toString()
                    }))
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </PopoverContent>
        </Popover>


      </div>

      <ResponsiveContainer width={"100%"} height={500}>

        <BarChart
          width={500}
          height={300}
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalPaidSoFar" name="Total Paid So Far" stackId="a" fill="#2a9d8f" />
          {/* <Bar dataKey="remainingBalance" name="Remaining" stackId="a" fill="gray" /> */}
          <Bar dataKey="totalLoanAmt" name="Total Loan Amount" stackId="a" fill="#fb8500" />
        </BarChart>

      </ResponsiveContainer >
    </div>
  )
}

export default DebtsVsRepaymentsChart