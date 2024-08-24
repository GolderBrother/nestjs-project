import { Button, Card, Form, Input, message } from 'antd';
import './index.css';
import { useEffect, useState } from 'react';
import { getBookList as getBookListApi } from '../../api';

interface Book {
    id: number;
    name: string;
    author: string;
    description: string;
    cover: string;
}

export function BookManage(){
    const [bookList, setBookList] = useState<Array<Book>>([]);
    const [search, setSearch] = useState('');

    async function getBookList() {
        try {
            const data = await getBookListApi({
                name: search
            });
            
            if(data.status === 201 || data.status === 200) {
                setBookList(data.data);
            }
        } catch(e: any) {
            message.error(e.response.data.message);
        }
    }
    async function searchBook(values: { name: string}) {
        console.log('searchBook', values);
        setSearch(values.name);
    }
    useEffect(() => {
        getBookList();
    }, [search]);

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
                        <Button type="primary" htmlType="submit" style={{background: 'green'}} >
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
                                <a href="#">详情</a>
                                <a href="#">编辑</a>
                                <a href="#">删除</a>
                            </div>
                        </Card>
                    })
                }     
            </div>
            
        </div>
    </div>
}
