import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone' 

// schema 类型定义
const typeDefs = `
  type Student {
    id: String,
    name: String,
    sex: Boolean
    age: Int
  }

  type Teacher {
    id: String,
    name: String,
    age: Int,
    subject: [String],
    students: [Student]
  }

  type Query {
    students: [Student],
    teachers: [Teacher],
    studentsByTeacherName(name: String!): [Student]
  }

  type Res {
    success: Boolean
    id: String
   }

    type Mutation {
        addStudent(name:String! age:Int! sex:Boolean!): Res

        updateStudent(id: String! name:String! age:Int! sex:Boolean!): Res

        deleteStudent(id: String!): Res
    }

    schema {
        mutation: Mutation
        query: Query
    }


  schema {
    query: Query
  }
`;


const students = [
    {
      id: '1',
      name: async () => {
        await '取数据';
        return 'james'
      },
      sex: true,
      age: 12
    },
    {
      id: '2',
      name:'zhang',
      sex: true,
      age: 13
    },
    {
      id: '3',
      name:'小红',
      sex: false,
      age: 11
    },
];

const teachers = [
  {
    id: '1',
    name: 'jamesezhang',
    sex: true,
    subject: ['体育', '数学'],
    age: 28,
    students: students
  }
]

// 取对象类型对应的数据
async function addStudent (_, { name, age, sex }) {
    students.push({
        id: '一个随机 id',
        name,
        age,
        sex
    });
    return {
      success: true,
      id: 'xxx'
    }
}

async function updateStudent (_, { id, name, age, sex }) {

    return {
      success: true,
      id: 'xxx'
    }
}

async function deleteStudent (_, { id }) {
    return {
      success: true,
      id: 'xxx'
    }
}
  
// query 查询语言
const resolvers = {
    Query: {
      students: () => students,
      teachers: () => teachers,
      studentsByTeacherName: async (...args) => {
        console.log(args);

        await '执行了一个异步查询'
        return students
      }
    },
    Mutation: {
        addStudent: addStudent,
        updateStudent: updateStudent,
        deleteStudent: deleteStudent
    }
};



// 跑起 graphql 服务
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
  
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});
  
console.log(`🚀  Server ready at: ${url}`);
