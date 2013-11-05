# 后端手册
----
backend/index.php/ajax/article/$article=-1
获取一篇文章
    返回值
    JSON
    |- id 文章编号
    |- publish 是否发表，总是1
    |- title 文章标题
    |- author 作者
    |- aid 作者编号
    |- date 创建日期
    |- category 分类
    |- cid 分类编号
    |- content 内容

backend/index.php/ajax/category/$category=-1/$page=1/$app=10
获取一个category中的文章列表
    返回值
    JSON
    |- cid category编号
    |- category category名
    |- page 第几页
    |- posts[] 文章数组
        |- id publish title author aid date category cid content 意义见上，其中content截止到<!-- MORE -->标签

backend/index.php/ajax/categories
获取category的列表
    返回值
    JSON[]
    |-  id : category编号
        name : category名
        description : 简介
        posts : 文章数量
