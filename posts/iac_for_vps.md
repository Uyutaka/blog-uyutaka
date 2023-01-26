---
title: "[WIP] VPSのセットアップ"
date: "2023-01-19"
thumbnail: "/images/thumbnail01.jpg"
---


## Why VPS?
全てコントロールしたいから
## Why docker?
- 開発環境と本番環境の差異を減らしたいから
- VPSの移動を簡単にしたいから

## Next Action
- ブログデータのpush後はCI/CDパイプラインで更新
- セキュリティグループ等の設定

### コマンド
certificate更新方法
- 証明書の更新
```
docker compose -f <absolute path to folder>/docker-compose-le.yaml up
```

- 更新した証明書をnginxで使う
```
docker exec -it nginx-service nginx -s reload
```

- Blog更新後
```
docker compose up  --force-recreate blog -d
```

### 参考URL
- [Simplest HTTPS setup: Nginx Reverse Proxy+ Letsencrypt+ AWS Cloud + Docker](https://leangaurav.medium.com/simplest-https-setup-nginx-reverse-proxy-letsencrypt-ssl-certificate-aws-cloud-docker-4b74569b3c61)
- [↑のGitHubレポジトリ](https://github.com/leangaurav/nginx_https_docker)
- [VPS + Docker で トレンド技術を使いこなす【 第1回： コマンド1行でアプリが動く Docker 】](https://www.kagoya.jp/howto/cloud/container/vps-docker-01/)
VPSにDockerをインストールするまで
