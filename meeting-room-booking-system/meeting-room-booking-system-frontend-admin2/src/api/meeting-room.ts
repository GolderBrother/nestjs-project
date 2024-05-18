import request from "../request/index";
import { CreateMeetingRoom, UpdateMeetingRoom } from "./types/meeting-room";

export async function getMeetingRoomList(name: string, capacity: number, equipment: string, pageNo: number, pageSize: number) {
	return await request.get('/meeting-room/list', {
		params: {
			name,
			capacity,
			equipment,
			pageNo,
			pageSize
		}
	});
}

export async function deleteMeetingRoom(id: number) {
  return await request.delete('/meeting-room/' + id);
}


export async function createMeetingRoom(meetingRoom: CreateMeetingRoom) {
    return await request.post('/meeting-room/create', meetingRoom);
}

export async function updateMeetingRoom(meetingRoom: UpdateMeetingRoom) {
    return await request.put('/meeting-room/update', meetingRoom);
}

export async function findMeetingRoom(id: number) {
    return await request.get('/meeting-room/' + id);
}
