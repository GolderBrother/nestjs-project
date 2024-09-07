import { useCallback, useEffect, useState } from "react";
import { getRanking } from "../../../api";
import { message, Modal, Table, TableColumnsType } from "antd";

interface RankingModalProps {
    isOpen: boolean;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    handleClose: Function
    examId?: number
}
export function RankingModal(props: RankingModalProps) {
    const [list, setList] = useState([])
    const queryRankList = async () => {
        if (!props.examId) return;

        try {
            const res = await getRanking(props.examId);

            if (res.status === 201 || res.status === 200) {
                setList(res.data);
            }
        } catch (e: unknown) {
            message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
        }

    }
    const columns: TableColumnsType = [
        {
            title: '名字',
            key: 'name',
            render: (_, record) => (
                <div>
                    {record.answerer.username}
                </div>
            )
        },
        {
            title: '分数',
            dataIndex: 'score',
            key: 'score',
        }
    ]

    useEffect(() => {
        queryRankList()
    }, [props.examId])

    return <Modal
        title="排行榜"
        open={props.isOpen}
        onOk={() => props.handleClose()}
        onCancel={() => props.handleClose()}
        okText={'确认'}
        cancelText={'取消'}
    >

        <Table dataSource={list} columns={columns} />;

    </Modal>
}