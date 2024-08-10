import Table, { ColumnsType } from "antd/es/table"
import { FriendRequest } from "./types"

// eslint-disable-next-line @typescript-eslint/ban-types
export const getToMeColumns: ({ agree, reject, }: { agree: Function; reject: Function; }) => ColumnsType<FriendRequest> = ({
    agree,
    reject,
}) => [
    {
        title: '用户',
        render: (_, record) => {
            return <div>
                <img src={record.fromUser.headPic} width={30} height={30} />
                {' ' + record.fromUser.nickName + ' 请求加你为好友'}
            </div>
        }
    },
    {
        title: '理由',
        dataIndex: 'reason'
    },
    {
        title: '请求时间',
        render: (_, record) => {
            return new Date(record.createTime).toLocaleString()
        }
    },
    {
        title: '操作',
        render: (_, record) => {
            if (record.status === 0) {
                return <div>
                    <a onClick={() => agree(record.fromUserId)}>同意</a><br />
                    <a onClick={() => reject(record.fromUserId)}>拒绝</a>
                </div>
            } else {
                const map: Record<string, any> = {
                    1: '已通过',
                    2: '已拒绝'
                }
                return <div>
                    {map[record.status]}
                </div>
            }
        }
    }
]

// eslint-disable-next-line @typescript-eslint/ban-types
export const getFromMeColumns: () => ColumnsType<FriendRequest> = () => [
    {
        title: '用户',
        render: (_, record) => {
            return <div>
                {' 请求添加好友 ' + record.toUser.nickName}
                <img src={record.toUser.headPic} width={30} height={30} />
            </div>
        }
    },
    {
        title: '理由',
        dataIndex: 'reason'
    },
    {
        title: '请求时间',
        render: (_, record) => {
            return new Date(record.createTime).toLocaleString()
        }
    },
    {
        title: '状态',
        render: (_, record) => {
            const map: Record<string, any> = {
                0: '申请中',
                1: '已通过',
                2: '已拒绝'
            }
            return <div>
                {map[record.status]}
            </div>
        }
    }
]