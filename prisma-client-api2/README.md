## model 关联的时候涉及到多个表的 CRUD 方法

还是 `findXxx、updateXxx、deleteXxx、createXxx` 那些方法，只不过查询的时候可以通过 `include` 包含关联记录，新增修改的时候可以通过 `create、connect、connectOrCreate` 来关**联或者插入记录**。

此外，还可以直接执行 sql。