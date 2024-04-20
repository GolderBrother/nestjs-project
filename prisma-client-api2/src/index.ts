import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    log: [
        {
            emit: 'stdout',
            level: 'query'
        }
    ],
});

async function main() {
    console.log('start');
    await test8();
    console.log('end');
}
main();

async function test1() {
    const aaa = await prisma.department.create({
        data: {
            name: '技术部',
            employees: {
                // 插入关联 model 的数据的时候，用 create 指定
                create: [{
                    name: '张三',
                    phone: '12345678'
                }, {
                    name: '李四',
                    phone: '87654321'
                }]
            }
        }
    })
    console.log('aaa', aaa);
}

async function test2() {
    const bbb = await prisma.department.create({
        data: {
            name: '技术部',
            employees: {
                createMany: {
                    data: [{
                        name: '王五',
                        phone: '11111111'
                    }, {
                        name: '赵六',
                        phone: '22222222'
                    }]
                }
            }
        }
    })
    console.log('bbb', bbb);
}


async function test3() {
    // 查询 department 的时候，通过 include 指定关联查询出 employees。
    // const res1 = await prisma.department.findUnique({
    //     where: {
    //         id: 1
    //     },
    //     include: {
    //         employees: true
    //     }
    // })
    // include 还可以指定 where 等查询的参数，进一步过滤。
    // const res2 = await prisma.department.findUnique({
    //     where: {
    //         id: 1
    //     },
    //     include: {
    //         employees: {
    //             where: {
    //                 id: 1
    //             },
    //             select: {
    //                 id: true,
    //                 name: true,
    //                 phone: true,
    //             }
    //         }
    //     }
    // })
    // 可以在查出 department 后调用 empolyees() 方法来查询。
    const res3 = await prisma.department.findUnique({
        where: {
            id: 1
        }
    }).employees();
    // console.log('res1', res1);
    // console.log('res2', res2);
    console.log('res3', res3);
}

// update 的时候可以通过 create、connect、connectOrCreate 来插入新的关联 model 的记录或者关联已有的记录。
async function test4() {
    const res = await prisma.department.update({
        where: {
            id: 1
        },
        data: {
            name: '销售部',
            employees: {
                create: [{
                    name: '七七',
                    phone: '1212121221'
                }]
            }
        }
    })
    console.log('res', res);
}

async function test5() {
    // update 的时候使用 connect 和它关联
    const res = await prisma.department.update({
        where: {
            id: 1
        },
        data: {
            name: '销售部总部',
            employees: {
                connect: [{
                    id: 4
                }]
            }
        }
    })
    console.log('res', res);
}

async function test6() {
    const res = await prisma.department.update({
        where: {
            id: 1
        },
        data: {
            name: '销售部',
            employees: {
                // 某个 id 的数据存在就 connect，不存在就 create
                // 第一次跑，执行的是 insert，第二次是update
                connectOrCreate: [{
                    where: {
                        id: 6
                    },
                    create: {
                        id: 6,
                        name: '初八',
                        phone: '121212121'
                    }
                }]
            }
        }
    })
    console.log('res', res);
}


async function test7() {
    // 删除 id 为 1 的 department 的所有 empolyee
    const res = await prisma.employee.deleteMany({
        where: {
            department: {
                id: 1
            }
        }
    })
    console.log('res', res);
}

// 可以直接执行 sql
// 当上面的 api 都不能满足需求的时候，就可以直接执行 sql。
async function test8() {
    const res = await prisma.$executeRaw`TRUNCATE TABLE Employee`;
    const res2 = await prisma.$queryRaw`select * from Department`;
    console.log('res', res);
    console.log('res2', res2);
}