import { IsNotEmpty } from "class-validator";

export class ChatroomCreateOneToOneDto {

    @IsNotEmpty({
        message: "聊天好友的 id 不能为空"
    })
    friendId: number   
}
