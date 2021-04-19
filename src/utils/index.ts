import dayjs, { Dayjs } from 'dayjs'

interface TParams {
  type?: string | boolean,
  money?: string | number,
  [params: string]: any
}

export function formatParams(params: TParams) {
  if (typeof params.type === 'string') {
    params.type = params.type === 'false' ? false : true
  }
  if (typeof params.money === 'string') {
    params.money = parseFloat(params.money)
  }
  return params
}

export function fetchDateSec(dateSec: any) {
  let [foreDate, lastDate] = dateSec.split('-')
  foreDate = dayjs(foreDate)
  lastDate = dayjs(lastDate)
  let data = []
  while (foreDate.isBefore(lastDate) || foreDate.isSame(lastDate)) {
    data.push(foreDate)
    foreDate = foreDate.add(1, 'day')
  }
  data = data.map(day => {
    return day.format('YYYY-MM-DD');
  })
  return data
}

