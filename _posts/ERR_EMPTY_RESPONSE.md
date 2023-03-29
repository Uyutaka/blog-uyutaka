---
title: 'ERR_EMPTY_RESPONSEでハマった'
excerpt: 'excerpt.'
coverImage: '/assets/blog/post/thumbnail_010623.jpg'
date: '2023-01-06T05:35:07.322Z'
author:
  name: JJ Kasper
  picture: '/assets/blog/authors/jj.jpeg'
ogImage:
  url: '/assets/blog/dynamic-routing/cover.jpg'
---

色々調べたが、1時間程度ハマったのでメモ

# 問題
ローカル環境で動作しているアプリ(Containerで立ち上げたNextJSアプリ)へChrome, Braveでlocalhost:3000へアクセスすると下記のエラーが出る。


![alt text](/assets/blog/post/thumbnail_010623.jpg "ERR_EMPTY_RESPONSE")

下記でアプリを立ち上げて成功していることを確認した
``` bash
    root@a6ec78e1c004:/workspaces/blog-uyutaka# npm run dev

    > blog-uyutaka@0.1.0 dev
    > next dev

    ready - started server on 0.0.0.0:3000, url: http://localhost:3000
    event - compiled client and server successfully in 393 ms (165 modules)
```

# 確認したこと
- curlでレスポンスが返ってくる
``` bash
    > curl localhost:3000
    <!DOCTYPE html><html lang="en"><head><style data-next-hide-fouc="true">body{display:none}</style><noscript data-next-hide-fouc="true"><style>body{display:block}</style></noscript><meta charSet="utf-8"/><meta......以下略
```
- Chromiumベースのブラウザ(Chrome, Brave)のプライベートモードでも同様の問題が発生する
- Firefoxでは発生しない

# 試したこと
だいたい、下記の順で試したと思う。

- ググって同様の現象が起きている人がいないか

    [ローカル開発で「ERR_EMPTY_RESPONSE」のエラーを対処したい](https://teratail.com/questions/202028)が近かった.
    CloudFlareやESETを使うとERR_EMPTY_RESPONSEが起こることがあるらしい。[参考](https://miz2403.com/err_empty_response/)
- Chrome関係
    - キャッシュの削除
    - Chrome自体の再起動
    - Chrome DNS キャッシュの削除

        方法は[こちら](https://helpdeskgeek.com/help-desk/how-to-fix-an-err_empty_response-error-in-google-chrome/)

        ※アクセス先がlocalhost & Braveでも同様の問題が発生しているためDNSは関係ないと思っていたが念の為実施
- PCの再起動
- Docker Desktopで他の動作中のコンテナを確認(後述)

# 分かったこと
PCの再起動後、ふとDocker Desktopを開いたところ同じポートを利用しているコンテナが動いていることが判明した。オレンジで囲っているコンテナのみを動かしていると考えていた。赤で囲っているのが裏で動いていたコンテナ。
![alt text](/assets/blog/post/010623_docker_desktop.jpg "Docker Desktop")
利用しているポート(3000)がバッティングしているため何故かChromiumベースのブラウザではERR_EMPTY_RESPONSEが発生した。

# 解決方法
別で動いていたコンテナの停止で解決した。

# 感想
これってChromiumベースのブラウザのバグでは。。今度[バグレポート](https://www.chromium.org/for-testers/bug-reporting-guidelines/)してみようと思う。
