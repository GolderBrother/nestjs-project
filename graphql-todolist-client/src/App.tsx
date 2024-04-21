import { gql, useMutation, useQuery } from "@apollo/client";
import { useMemo } from "react";
interface TodoItem {
  id: number;
  content: string;
}

interface TodoList {
  todolist: Array<TodoItem>;
}

/**
 * 获取todo列表 
 */
const getTodoList = gql`
  query Todolist {
    todolist {
      id
      content
    }
  }
`;

/**
 * 创建todo
 */
const createTodoItem = gql`
  mutation Mutation($todoItem: CreateTodoItemInput!) {
    createTodoItem(todoItem: $todoItem) {
      id
      content
    }
  }
`;

function App() {
  const { loading, data, error } = useQuery<TodoList>(getTodoList);
  // 用 useMutation 的 hook，指定 refetchQueries 也就是修改完之后重新获取数据
  const [createTodo] = useMutation(createTodoItem, {
    refetchQueries: [getTodoList]
  });
  const createTodoHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation?.();
    e.preventDefault?.();
    createTodo({
      variables: {
        todoItem: {
          content: Date.now().toString()
        }
      }
    });
  }
  const todoList = useMemo(() => data?.todolist || [],  [data]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <button onClick={createTodoHandler}>增加todo</button>
      <ul>
        {
          todoList.map((item, index) => (
            <li key={index}>{item.content}</li>
          ))
        }
      </ul>
    </>
  );
}

export default App;