import { CalendarIcon, FilterIcon } from 'lucide-react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { EntityDetailChartShemaType } from '@/features/entities/types/EntityTypes';
import React from 'react'
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useGetEntityDetailChartsQuery } from '@/features/entities/api/entityApi';
import { useTranslation } from 'react-i18next';

type Props = {
  entityId: number;
}

const EntityOverviewChart = ({ entityId }: Props) => {


  const [filters, setFilters] = React.useState<EntityDetailChartShemaType>({
    fromDate: '',
    toDate: '',
    id: entityId
  })

  const { t } = useTranslation()
  const { data: entityDetailChartsObj = {}, isLoading: isLoadingEntityDetailCharts } = useGetEntityDetailChartsQuery({ ...filters })
  const chartData = entityDetailChartsObj?.chartData ?? []

  return (
    <div className='w-full h-full'>

      <div className="flex items-center justify-end gap-2 mb-8">

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
        <LineChart
          width={400}
          height={400}
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timePeriod" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line name={t("Total Sale")} type="monotone" dataKey="totalSales" stroke="#2a9d8f" activeDot={{ r: 8 }} />
          <Line name={t("Total Purchase")} type="monotone" dataKey="totalPurchases" stroke="blue" />
          <Line name={t("Total Payment")} type="monotone" dataKey="totalPayments" stroke="#e33333" />
        </LineChart>
      </ResponsiveContainer >
    </div >
  )
}

export default EntityOverviewChart