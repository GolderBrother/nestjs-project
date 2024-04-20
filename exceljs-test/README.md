# Excel 的导入导出

Excel 的导入导出是后台管理系统的常见功能，我们一般用 exceljs 来实现。

excel 文件分为 workbook、worksheet、row、cell 这 4 层，解析和生成都是按照这个层次结构来。

解析就是 readFile 之后，遍历 worksheet、row，拿到 cell 中的数据 。

生成就是 addWorkSheet、addRow 添加数据，然后 writeFile 来写入文件。

如果是在浏览器里，就把 readFile 换成 load，把 writeFile 换成 writeBuffer 就好了。

浏览器里生成 excel 之后，可以通过 a 标签触发下载，设置 download 属性之后，触发点击就好了。

这样，我们就分别在 node 和浏览器里完成了 excel 的解析和生成。