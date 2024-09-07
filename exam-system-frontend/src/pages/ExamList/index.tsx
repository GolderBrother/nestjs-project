import { Button, message, Popconfirm, Popover, Radio } from "antd";
import "./index.css";
import { useEffect, useMemo, useState } from "react";
import { Exam } from "../../api/types";
import { examDelete, examPublish, examUnPublish, getExamList as getExamListApi } from "../../api";
import { ExamAddModal } from "./ExamAddModal";
import { Link } from "react-router-dom";
import { RankingModal } from "./RankingModal";

export function ExamList() {
    const [examList, setExamList] = useState<Array<Exam>>([])
    const getExamList = async () => {
        try {
            const res = await getExamListApi();
            if (res.status === 201 || res.status === 200) {
                // 过滤出未删除的
                setExamList(Array.isArray(res.data) ? res.data.filter(item => !item.isDelete) : [])
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            message.error(e.response?.data?.message || '系统繁忙，请稍后再试');
        }
    }
    useEffect(() => {
        getExamList();
    }, [])

    const [isExamAddModalOpen, setIsExamAddModalOpen] = useState(false);
    const openExamAddMode = () => {
        setIsExamAddModalOpen(true)
    }
    const closeExamAddMode = () => {
        setIsExamAddModalOpen(false)
    }
    const onExamAddModalClose = () => {
        closeExamAddMode()
        getExamList();
    }
    const changePublishState = async (id: number, isPublish: boolean) => {
        try {
            const res = isPublish ? await examUnPublish(id) : await examPublish(id);
            if (res.status === 201 || res.status === 200) {
                message.success(isPublish ? '已取消发布' : '已发布');
                getExamList();
            }
        } catch (error: any) {
            message.error(error.response?.data?.message || '系统繁忙，请稍后再试');
        }

    }
    const deleteExam = async (id: number) => {
        try {
            const res = await examDelete(id);
            if (res.status === 201 || res.status === 200) {
                message.success('已删除');
                getExamList();
            }
        } catch (error: any) {
            message.error(error.response?.data?.message || '系统繁忙，请稍后再试');
        }
    }
    const [bin, setBin] = useState(false)
    const showExamList = useMemo(() => {
        const examListData = Array.isArray(examList) ? examList : [];
        return examListData.filter(item => bin ? item.isDelete === true : item.isDelete === false)
    }, [bin, examList])

    const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
    // 记录当前的考试 id
    const [curExamId, setCurExamId] = useState<number>();
    const onRankingModalClose = () => {
        setIsRankingModalOpen(false);
    }

    return <div id="ExamList-container">
        <div className="header">
            <h1>考试系统</h1>
        </div>
        <div className="body">
            <div className="operate">
                <Button type="primary" onClick={openExamAddMode}>新建试卷</Button>
                {/* 回收站就是根据 isDelete 来过滤列表里的数据 */}
                <Radio.Button type="primary" value={bin} onChange={() => setBin(!bin)}>回收站</Radio.Button>
            </div>
            <div className="list">
                {
                    showExamList?.map(item => {
                        return <div className="item">
                            <p>{item.name}</p>
                            <div className="btns">
                                <Button className="btn" type="primary" style={{ background: 'darkblue' }} onClick={() => changePublishState(item.id, item.isPublish)}>{item.isPublish ? '停止' : '发布'}</Button>
                                <Button className="btn" type="primary" style={{ background: 'green' }}>
                                    <Link to={`/edit/${item.id}`}>编辑</Link>
                                </Button>
                                <Popover content={window.location.origin + '/exam/' + item.id} trigger="click">
                                    <Button type="default">
                                        考试链接
                                    </Button>
                                </Popover>
                                <Button className="btn" type="primary" style={{ background: 'orange' }} onClick={() => {
                                    setIsRankingModalOpen(true)
                                    setCurExamId(item.id);
                                }}>
                                    排行榜
                                </Button>
                                <a href={`http://localhost:3003/answer/export?examId=${item.id}`}>导出所有答卷</a>
                                <Popconfirm
                                    title="试卷删除"
                                    description="确认放入回收站吗？"
                                    onConfirm={() => deleteExam(item.id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button className="btn" type="primary" style={{ background: 'darkred' }}>删除</Button>
                                </Popconfirm>
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
        <ExamAddModal
            isOpen={isExamAddModalOpen}
            handleClose={onExamAddModalClose}
        />
        <RankingModal
            isOpen={isRankingModalOpen}
            examId={curExamId}
            handleClose={onRankingModalClose}
        />

    </div>
}
