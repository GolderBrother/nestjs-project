import dayjs from "dayjs";
import { SearchBooking } from "../pages/BookingManage/BookingManage";
import axiosInstance from "../request";

export async function bookingList(searchBooking: SearchBooking, pageNo: number, pageSize: number) {

  let bookingTimeRangeStart;
  let bookingTimeRangeEnd;

  if (searchBooking.rangeStartDate && searchBooking.rangeStartTime) {
    const rangeStartDateStr = dayjs(searchBooking.rangeStartDate).format('YYYY-MM-DD');
    const rangeStartTimeStr = dayjs(searchBooking.rangeStartTime).format('HH:mm');
    bookingTimeRangeStart = dayjs(rangeStartDateStr + ' ' + rangeStartTimeStr).valueOf()
  }

  if (searchBooking.rangeEndDate && searchBooking.rangeEndTime) {
    const rangeEndDateStr = dayjs(searchBooking.rangeEndDate).format('YYYY-MM-DD');
    const rangeEndTimeStr = dayjs(searchBooking.rangeEndTime).format('HH:mm');
    bookingTimeRangeEnd = dayjs(rangeEndDateStr + ' ' + rangeEndTimeStr).valueOf()
  }

  return await axiosInstance.get('/booking/list', {
    params: {
      username: searchBooking.username,
      meetingRoomName: searchBooking.meetingRoomName,
      meetingRoomPosition: searchBooking.meetingRoomPosition,
      bookingTimeRangeStart,
      bookingTimeRangeEnd,
      pageNo: pageNo,
      pageSize: pageSize
    }
  });
}

/**
 * 通过申请
 * @param id 
 * @returns 
 */
export async function apply(id: number) {
  return await axiosInstance.get('/booking/apply/' + id);
}

/**
 * 驳回申请
 * @param id 
 * @returns 
 */
export async function reject(id: number) {
  return await axiosInstance.get('/booking/reject/' + id);
}

/**
 * 解除申请
 * @param id 
 * @returns 
 */
export async function unbind(id: number) {
  return await axiosInstance.get('/booking/unbind/' + id);
}