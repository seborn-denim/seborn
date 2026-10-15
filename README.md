# Denim Fabric Catalog

牛仔布料商品展示网站，包含公开商品九宫格首页、独立商品详情页和管理员商品维护界面。

## 在线访问

GitHub Pages：<https://lj789520.github.io/denim-fabric-catalog/>

## 页面

- `index.html`：商品九宫格首页和管理员后台入口。
- `product.html?id=商品ID`：商品独立详情页。
- 管理员演示账号：`admin`
- 管理员演示密码：`admin123`

## 本地预览

在项目目录执行：

```bash
python -m http.server 4173
```

然后访问 `http://127.0.0.1:4173/`。

## 说明

当前版本是前端静态原型，商品和管理员状态保存在浏览器 `localStorage` 中。正式公开运营时，需要接入服务端登录鉴权、数据库和图片存储服务。
