import { IsNotEmpty } from "class-validator";

export class QuitChatRoomDto {

    @IsNotEmpty({
        message: "chatroom id 不能为空"
    })
    id: number
    @IsNotEmpty({
        message: "quitUserId 不能为空"
    })
    quitUserId: number
}
