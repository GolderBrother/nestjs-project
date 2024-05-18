import axiosInstance from "../request";

export interface UserBookingData {
  userId: string;
  username: string;
  bookingCount: string;
}

export interface MeetingRoomUsedData {
  meetingRoomName: string;
  meetingRoomId: number;
  usedCount: string;
}

/**
 * 会议室使用情况
 * @param startTime 
 * @param endTime 
 * @returns 
 */
export async function meetingRoomUsedCount(startTime: string, endTime: string) {
  return await axiosInstance.get('/statistic/meetingRoomUsedCount', {
    params: {
      startTime,
      endTime
    }
  });
}

/**
 * 用户预订情况
 * @param startTime 
 * @param endTime 
 * @returns 
 */
export async function userBookingCount(startTime: string, endTime: string) {
  return await axiosInstance.get('/statistic/userBookingCount', {
    params: {
      startTime,
      endTime
    }
  });
}
