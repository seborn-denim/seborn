# Denim Fabric Catalog

牛仔布料商品展示网站，包含公开商品九宫格首页、独立商品详情页和管理员商品维护界面。

## 在线访问

GitHub Pages：<https://lj789520.github.io/denim-fabric-catalog/>

## 页面

- `index.html`：商品九宫格首页和管理员后台入口。
- `product.html?id=商品ID`：商品独立详情页。

## 本地预览

在项目目录执行：

```bash
python -m http.server 4173
```

然后访问 `http://127.0.0.1:4173/`。

## Supabase 初始化

1. 打开 Supabase 项目的 `SQL Editor`。
2. 执行 `supabase/setup.sql`。
3. 进入 `Authentication` → `Users`，创建管理员账号：
   - 邮箱：`3034642030@qq.com`
   - 密码：按项目管理员约定设置
   - 创建时开启 `Auto Confirm User`
4. 确认 Storage 中出现公开存储桶 `product-images`。

## 说明

网站优先从 Supabase 读取和保存商品数据，浏览器 `localStorage` 仅作为临时缓存和离线回退。管理员登录使用 Supabase Auth 校验，公开访问只能读取已上架商品。
