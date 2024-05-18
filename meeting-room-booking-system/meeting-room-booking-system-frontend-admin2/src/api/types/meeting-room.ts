
export interface CreateMeetingRoom {
	name: string;
	capacity: number;
	location: string;
	equipment: string;
	description: string;
}

export interface UpdateMeetingRoom extends CreateMeetingRoom {
	id: number;
}