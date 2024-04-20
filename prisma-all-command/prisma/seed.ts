import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
	log: [
		{
			emit: 'stdout',
			level: 'query'
		},
	],
});
// 初始化脚本
// seed 命令是执行脚本插入初始数据到数据库
async function main() {
	const user = await prisma.user.create({
		data: {
			name: 'zhangzhang',
			email: 'zhangzhang@zhang.com',
			Post: {
				create: [
					{
						title: 'aaa',
						content: 'aaaa'
					},
					{
						title: 'bbb',
						content: 'bbbb'
					}
				]
			},
		},
	})
	console.log(user)
}

main();
