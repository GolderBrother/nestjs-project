import { Button, Card, Form, Input, message, Popconfirm } from 'antd';
import './index.css';
import { useEffect, useState } from 'react';
import { deleteBook as deleteBookApi, getBookList as getBookListApi } from '../../api';
import { CreateBookModal } from './CreateBookModal';
import { UpdateBookModal } from './UpdateBookModal';

interface Book {
    id: number;
    name: string;
    author: string;
    description: string;
    cover: string;
}

export function BookManage() {
    const [bookList, setBookList] = useState<Array<Book>>([]);
    const [search, setSearch] = useState('');

    async function getBookList() {
        try {
            const data = await getBookListApi({
                name: search
            });

            if (data.status === 201 || data.status === 200) {
                setBookList(data.data);
            }
        } catch (e: any) {
            message.error(e.response.data.message);
        }
    }
    async function searchBook(values: { name: string }) {
        console.log('searchBook', values);
        setSearch(values.name);
    }
    useEffect(() => {
        getBookList();
    }, [search]);

    const [isCreateBookModalOpen, setCreateBookModalOpen] = useState(false);
    const addBook = () => {
        setCreateBookModalOpen(true);
    }
    const handleAddBookComplete = async () => {
        setCreateBookModalOpen(false);
        getBookList();
    }

    const [isUpdateBookModalOpen, setUpdateBookModalOpen] = useState(false);
    const [updateId, setUpdateId] = useState(0);
    const onEditBook = (id: number) => {
        setUpdateBookModalOpen(true);
        setUpdateId(id);
    }
    const handleUpdateBookComplete = async () => {
        setUpdateBookModalOpen(false);
        getBookList();
    }

    const [isBookDetailModalOpen, setBookDetailModalOpen] = useState(false)
    const [bookId, setBookId] = useState(0);
    const onBookDetail = (id: number) => {
        setBookDetailModalOpen(true);
        setBookId(id);
    }
    const handleBookDetailComplete = async () => {
        setBookDetailModalOpen(false);
    }


    async function handleDelete(id: number) {
        try {
            await deleteBookApi(id);
            message.success('删除成功');
            getBookList();
        } catch (e: any) {
            message.error(e.response.data.message);
        }
    }


    return <div id="bookManage">
        <h1>图书管理系统</h1>
        <div className="content">
            <div className='book-search'>
                <Form
                    name="search"
                    layout='inline'
                    colon={false}
                    onFinish={searchBook}
                >
                    <Form.Item label="图书名称" name="name">
                        <Input />
                    </Form.Item>
                    <Form.Item label=" ">
                        <Button type="primary" htmlType="submit">
                            搜索图书
                        </Button>
                        <Button type="primary" style={{ background: 'green' }} onClick={addBook}>
                            添加图书
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <div className="book-list">
                {
                    bookList.map(book => {
                        return <Card
                            className='card'
                            hoverable
                            style={{ width: 300 }}
                            cover={<img alt="example" src={`http://localhost:3000/${book.cover}`} />}
                        >
                            <h2>{book.name}</h2>
                            <div>{book.author}</div>
                            <div className='links'>
                                <a href="#" onClick={() => onBookDetail(book.id)}>详情</a>
                                <a href="#" onClick={() => onEditBook(book.id)}>编辑</a>
                                <Popconfirm
                                    title="图书删除"
                                    description="确认删除吗？"
                                    onConfirm={() => handleDelete(book.id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <a href="#">删除</a>
                                </Popconfirm>
                            </div>
                        </Card>
                    })
                }
            </div>

        </div>
        {/* 创建 */}
        <CreateBookModal isOpen={isCreateBookModalOpen} handleClose={handleAddBookComplete}></CreateBookModal>
        {/* 更新 */}
        <UpdateBookModal key={'UpdateBookModal'} id={updateId} isOpen={isUpdateBookModalOpen} handleClose={handleUpdateBookComplete}></UpdateBookModal>
        {/* 详情 */}
        <UpdateBookModal key={'BookDetailModal'} id={bookId} disabled isOpen={isBookDetailModalOpen} handleClose={handleBookDetailComplete}></UpdateBookModal>
    </div>
}
