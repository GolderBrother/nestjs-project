-- 这里 --file 就是指定 sql 文件的。
-- 而 --schema 指定 schema 文件，主要是从中拿到数据库连接信息。
-- prisma db execute --file prisma/test.sql --schema prisma/schema.prisma
delete from Post WHERE id = 2;
