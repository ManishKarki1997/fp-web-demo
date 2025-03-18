import { Bar, BarChart, CartesianGrid, LabelList, Legend, Line, LineChart, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CalendarIcon, FilterIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { BestPerformingTagsChartShemaType } from '../../types/AppTypes'
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import React from 'react'
import Spinner from '@/components/ui/spinner';
import { TransactionTypes } from '@/features/transactions/constants/TransactionConstants';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useBestPerformingTagsChartQuery } from '../../api/appApi'
import { useTranslation } from 'react-i18next'

const BestPerformingTagsChart = () => {

  const [filters, setFilters] = React.useState<BestPerformingTagsChartShemaType>({
    fromDate: '',
    toDate: '',
    type: "Loan",
    maxTags: 10
  })

  const { t } = useTranslation()
  const { data: entityDetailChartsObj = {}, isFetching: isFetchingEntityDetailCharts } = useBestPerformingTagsChartQuery({ ...filters, type: filters.type == 'ALL' ? undefined : filters.type })
  const chartData = entityDetailChartsObj?.chartData ?? []

  const renderCustomizedLabel = (props: any) => {
    const totalAmount = chartData?.find((cd: { name: string }) => cd.name === props?.name)?.totalTransactions
    const { x, y, width, height, value } = props;
    const radius = 20;

    return (
      <g>
        <circle cx={x + width / 2} cy={y - radius} r={radius} fill="#8884d8" />
        <text x={x + width / 2} y={y - radius} fill="#fff" textAnchor="middle" dominantBaseline="middle" className='text-xs whitespace-pre-wrap'>
          {/* {value.split(' ')[1]} */}
          {totalAmount}
        </text>
      </g>
    );
  };

  return (
    <div>



      <div className='mb-4 flex items-center justify-between gap-2'>
        <div className=" bg-sidebar text-primary border border-input px-6 py-2 rounded flex items-center gap-2">
          <h2 className='font-medium'>{t("Highest transacted tags")} <span className='text-orange-500 underline'>{t(filters.type)}</span> </h2>
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
                  <SelectItem value={"ALL"}>{t("ALL")}</SelectItem>
                  {
                    TransactionTypes.map(type => (
                      <SelectItem key={type} value={type}>{t(type)}</SelectItem>

                    ))
                  }
                </SelectContent>
              </Select>
            </div>


            <div>
              <p className='font-medium'>Max Tags</p>
              <Select
                value={String(filters.maxTags ?? "")}
                onValueChange={_type => {
                  setFilters(prev => ({
                    ...prev,
                    maxTags: +_type
                  }))
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Max Entities" />
                </SelectTrigger>
                <SelectContent>
                  {
                    [2, 5, 10, 15].map(maxTags => (
                      <SelectItem key={maxTags} value={String(maxTags)}>{maxTags}</SelectItem>

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


        {/* <BarChart
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
          <XAxis dataKey="name" interval={!filters?.maxTags ? 0 : filters?.maxTags >= 15 ? 1 : 0} fontSize={!filters?.maxTags ? 0 : filters?.maxTags >= 8 ? 12 : 18} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar name="Name" dataKey="name" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
          <Bar name="Total Transactions" dataKey="totalTransactions" fill="#0077b6" activeBar={<Rectangle fill="gold" stroke="purple" />} />
          <Bar name="Total Amount" dataKey="totalAmount" fill="#0077b6" activeBar={<Rectangle fill="gold" stroke="purple" />} />
        </BarChart> */}

        <BarChart
          width={500}
          height={300}
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis name="Name" dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar name="Total Transactions" dataKey="totalTransactions" fill="#0077b6" minPointSize={5}>
            <LabelList dataKey="name" content={renderCustomizedLabel} />
          </Bar>
          <Bar name="Total Amount" dataKey="totalAmount" fill="#2a9d8f" minPointSize={10} />
        </BarChart>
      </ResponsiveContainer >
    </div>
  )
}

export default BestPerformingTagsChart