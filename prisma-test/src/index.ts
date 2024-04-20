import { PrismaClient } from '@prisma/client'
// 执行 prisma migrate dev，会生成并执行建表 sql 文件，而且在 node_modules 下生成了 client 代码。
const prisma = new PrismaClient({
    // 开启了 prisma 的 log，会打印 sql。
    log: [
        {
          emit: 'stdout',
          level: 'query'
        },
      ],
});

/**
 * 创建 PrismaClient，用 create 方法创建了 2 个 user，然后查询出来。
 */
async function create() {
    await prisma.user.create({
        data: {
            name: 'james',
            email: '111@james.com'
        }
    });

    await prisma.user.create({
        data: {
            name: 'zhang',
            email: '222@zhang.com'
        }
    });

    const users = await prisma.user.findMany();
    console.log(users);
}

async function create2() {
    const user = await prisma.user.create({
        data: {
            name: 'james3',
            email: 'james3@james.com',
            posts: {
                create: [
                    {
                        title: 'aaa3',
                        content: 'aaaa3'
                    },
                    {
                        title: 'bbb3',
                        content: 'bbbb3'
                    }
                ]
            },
        },
    });
    console.log(user);
}

async function update() {
    await prisma.post.update({
        where: {
            id: 3
        },
        data: {
            content: 'new aaa3'
        }
    });
}

async function remove() {
    await prisma.post.delete({
        where: {
            id: 3
        }
    });
}

// create();
// create2();
// update();
remove();
