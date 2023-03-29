---
title: '[Udemy]Building Modern Web Application with Go (Golang)を受講した'
excerpt: 'excerpt.'
coverImage: '/assets/blog/post/gopher.jpg'
date: '2023-02-27T05:35:07.322Z'
author:
  name: JJ Kasper
  picture: '/assets/blog/authors/jj.jpeg'
ogImage:
  url: '/assets/blog/dynamic-routing/cover.jpg'
---

[uyutaka](https://twitter.com/uE8B18A)です。

GoでWeb アプリ開発をできるようになりたかったためUdemyの[Building Modern Web Application with Go (Golang)](https://www.udemy.com/course/building-modern-web-applications-with-go/)を受講した。
テストコードの記載方法も含めて解説があり評価も高かったのでこちらを選んだ。一部はtour of goと重複などしていたためスキップした。Section 15以降は同じ講師の別講義でカバーするため受講をやめた。


# 講座の内容
```
- Section 1: Introduction
- Section 2: Overview of the Go Language (一部スキップ)
- Section 3: Building a Basic Web Application
- Section 4: Improved Routing & Middleware
- Section 5: State Management with Sessions
- Section 6: Choosing a Project, and Working With Forms
- Section 7: JavaScript & CSS (スキップ)
- Section 8: Converting our HTML to Go Templates, and creating handlers (スキップ)
- Section 9: Writing Tests
- Section 10: Improved Error Handling
- Section 11: Persisting Data with PostgreSQL
- Section 12: Designing the Database Structure
- Section 13: Connecting our Application to the Database
- Section 14: Updating our tests
- Section 15: Sending Mail using Go (ここ以降スキップ)
- Section 16: Authentication
- Section 17: Setting up secure back end administration
- Section 18: Updating our applications to accept command line parameters
- Section 19: Deploying Our Application to a Server
- Section 20: Finishing Touches
- Section 21: Where to go next
```




# 進め方
[レポジトリ](https://github.com/Uyutaka/bookings-go)を作って基本的には写経を行った。[コミットメッセージ](https://github.com/Uyutaka/bookings-go/commits/main)には対象の動画タイトルを入れた。

独自に工夫したのは、ローカル環境を汚したくなかったので、コンテナ内で全て開発出来るようにした([設定ファイル](https://github.com/Uyutaka/bookings-go/tree/main/.devcontainer))。

# 全体の感想
## 良かった点
- テストコードを含め解説があること
- 割と丁寧に一つづつ解説しているところ

## イマイチだった点
- Go templateを使っているところ
- 一部、動画ごとにはコードが公開されていないところ。講師のレポジトリは[こちら](https://github.com/tsawler/bookings-udemy)

これら点を解消するため同じ講師の[別講座](https://www.udemy.com/course/working-with-vue-3-and-go/)を受講することにした。

# メモ

## Section 2: Overview of the Go Language

### 16. Packages

Githubとかにpushする可能性あるならpackage名はユニークなのをつけたほうが良い

```bash
$ go mod init github.com/xxx/xxx
```

### 17. Channels

channelを作った後はclose()するのが良い。他のパッケージとのやり取りの際に使う

```go
func main(){
	intChan := make(chan int)
	defer close(intChan)
	// do somethong....
}
```

### 18. Reading and Writing JSON

 
標準パッケージ encoding/json で実現できる。型がきっちりしているにもかかわらずjsonの扱いが容易で好感をもてた。

Marshalという単語知らなかった。

```go
import (
	"encoding/json"
	"fmt"
)
type Person struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	HairColor string `json:"hair_color"`
	HasDog    bool   `json:"has_dog"`
}

func main() {
	// JSON(string)->struct
	myJson := `
	[
		{
			"first_name": "name",
			"last_name": "name2",
			"hair_color": "black",
			"has_dog": true

		}
	]`
	var unmarshalled []Person
	err := json.Unmarshal([]byte(myJson), &unmarshalled)
	if err != nil {
		log.Println("Error unmarshalling json", err)
	}

	log.Println(unmarshalled) //[{name name2 black true}]

	// struct->JSON(string)
	var mySlice []Person
	var m1 Person
	m1.FirstName = "Y"
	m1.LastName = "N"
	m1.HairColor = "red"
	m1.HasDog = false

	mySlice = append(mySlice, m1)
	newJson, err := json.MarshalIndent(mySlice, "", "	")
	if err != nil {
		log.Println("error mashallIndent:", err)
	}
	fmt.Println(string(newJson))
}
```

### 19. Writing Testing in Go

標準ツールでtestケース作成、実行、カバレッジ表示(HTMLでも!)出来る。とても便利。下記は割り算をする関数のユニットテスト記述例。

```go
// main.go
package main

import (
	"errors"
	"log"
)
// main.go
func main() {
	result, err := divide(100.0, 0)
	if err != nil {
		log.Println(err)
		return
	}
	log.Println("result off division is", result)

}

func divide(x, y float32) (float32, error) {
	var result float32

	if y == 0 {
		return result, errors.New("cannot divide by 0")
	}
	result = x / y
	return result, nil
}
```

```go
// main_test.go
package main

import "testing"

// table driven tests
// https://github.com/golang/go/wiki/TableDrivenTests
var tests = []struct {
	name     string
	dividend float32
	divisor  float32
	expected float32
	isErr    bool
}{
	{"valid-data", 100.0, 10.0, 10.0, false},
	{"invalid-data", 100.0, 0.0, 0.0, true},
	{"expected-5", 50.0, 10.0, 5.0, false},
}

func TestDivision(t *testing.T) {
	for _, tt := range tests {
		got, err := divide(tt.dividend, tt.divisor)
		if tt.isErr {
			if err == nil {
				t.Error("expected an error but did not get one")
			}
		} else {
			if err != nil {
				t.Error("did not expected an error but gone one", err.Error())
			}
		}
		if got != tt.expected {
			t.Errorf("expected %f but got %f", tt.expected, got)
		}
	}
}
```

```bash
# test実行、カバレッジ表示
$ go test -cover
PASS
coverage: 50.0% of statements
ok      go_prac 0.002s

# test実行、カバレッジ表示 & HTML生成
# コンテナ内で開発していないなら最後の -o coverage.htmlは必要なし、自動でブラウザが立ち上がる。
$ go test -coverprofile=coverage.out && go tool cover -html=coverage.out -o coverage.html
PASS
coverage: 50.0% of statements
ok      go_prac 0.002s
```

## Section3: Building a Basic Web Application

### 20. How web applications work: the request/response lifecycle

標準パッケージだけでHello Worldを返すAPIは下記で出来る。

```go
package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		n, err := fmt.Fprintf(w, "Hello world")
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println("number of bytes written:", n)
	})

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println(err)
	}
}
```

### 25. Serving HTML Templates

********"text/template”を使ってhtmlファイルをパース、レンダーさせる。********[https://pkg.go.dev/text/template#hdr-Examples](https://pkg.go.dev/text/template#hdr-Examples)

```go
func Home(w http.ResponseWriter, r *http.Request) {
	renderTemlpate(w, "home.page.tmpl")
}

func renderTemlpate(w http.ResponseWriter, tmpl string) {
	parsedTemplate, _ := template.ParseFiles("./templates/" + tmpl)
	err := parsedTemplate.Execute(w, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
}
```

### 28. Enabling Go Modules and refactoring our code to use packages

最初にすることmodule作成

```go
go mod init <module名>

-> github.com/uyutaka/<repo>

```

構成

```go
cmd
|-web
|  |- main.go
|-pkg
|  |- handlers
|  |   |- handers.go
|  |- render
|      |- render.go
|
|- templates
   |- about.page.tmpl
   |- home.page.tmpl
```

```go
// main.go
package main

import (
	"fmt"
	"main/pkg/handlers"
	"net/http"
)

func main() {
	http.HandleFunc("/", handlers.Home)
	http.HandleFunc("/about", handlers.About)

	err := http.ListenAndServe(":8082", nil)
	if err != nil {
		fmt.Println(err)
	}
}

```

```go
// handlers.go
package handlers

import (
	"main/pkg/render"
	"net/http"
)

// Home is the home page handler
func Home(w http.ResponseWriter, r *http.Request) {
	render.RenderTemlpate(w, "home.page.tmpl")
}

func About(w http.ResponseWriter, r *http.Request) {
	render.RenderTemlpate(w, "about.page.tmpl")
}
```

```go
// render.go
package render

import (
	"fmt"
	"net/http"
	"text/template"
)

func RenderTemlpate(w http.ResponseWriter, tmpl string) {
	parsedTemplate, errParse := template.ParseFiles("../../templates/" + tmpl)

	if errParse != nil {
		fmt.Println(errParse)
		return
	}
	err := parsedTemplate.Execute(w, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
}
```

### 30. Building a simple template cache

現状、毎回ストレージにアクセスしてレンダーしている。シンプルなキャッシュは下記

```go
var tc = make(map[string]*template.Template) //temp cache
func RenderTemplate(w http.ResponseWriter, t string) {
	var tmpl *template.Template
	var err error

	// check to see if we already have the template in our chache
	_, inMap := tc[t]
	if !inMap {
		log.Println("creating template and adding to cache")
		// need to create the template
		err = createTemplateCache(t)
		if err != nil {
			log.Println(err)
		}
	} else {
		// we have the template in the cache
		log.Println("using chached template")
	}
	tmpl = tc[t]

	err = tmpl.Execute(w, nil)
	if err != nil {
		log.Println(err)
	}
}

func createTemplateCache(t string) error {
	templates := []string{
		fmt.Sprintf("../../templates/%s", t),
		"../../templates/base.layout.tmpl",
	}

	// parse the template
	tmpl, err := template.ParseFiles(templates...)
	if err != nil {
		return err
	}

	tc[t] = tmpl
	return nil
}
```

## Section 4: Improved Routing & Middleware

### 38. Using pat for routing

今まではmain.goにルーティングがあった。切り出し。

外部ライブラリ[pat](https://github.com/bmizerany/pat)を利用　結構シンプルで標準ライブラリのみ利用している。

### 39. Using chi for routing

外部ライブラリ[chi](https://github.com/go-chi/chi)を利用

ユーザー認証系も対応

loggerなどのmiddlewareも豊富で自作も可能

使わなくなった。moduleを自動で消してくれる

go mod tidy

### 40. Developing our own middleware

CSRF [https://github.com/justinas/nosurf](https://github.com/justinas/nosurf) 用ライブラリ

## Section 5: State Management with Sessions

### 41. Installing and setting up a sessions package

[セッション管理ライブラリ](https://github.com/alexedwards/scs)

## Section 8: Converting our HTML to Go Templates, an

### 61. Creating handlers for our forms & adding CSRF Protection

CSRF トークンをrender時にわたすようにRenderTemplateを修正

### 62. Creating a handler that return JSON

GETのAPI作成　ハードコードしたjsonを返す

### 69. Server Side form validation 4

[https://github.com/asaskevich/govalidator](https://github.com/asaskevich/govalidator) emailのバリデーション用に利用

## Section 9: Writing Tests

internal/handlers/setup_test.go, internal/render/setup_test.goの重複が気になる。main.goからのコピペが多いことが気になっている。

## Section 11: Persisting Data with PostgreSQL

Container化するために[https://github.com/microsoft/vscode-dev-containers/tree/main/containers/go-postgres](https://github.com/microsoft/vscode-dev-containers/tree/main/containers/go-postgres)を参考にした。

pgadminのコンテナ　[https://towardsdatascience.com/how-to-run-postgresql-and-pgadmin-using-docker-3a6a8ae918b5](https://towardsdatascience.com/how-to-run-postgresql-and-pgadmin-using-docker-3a6a8ae918b5)　

```bash
# コンテナのIPアドレス確認方法
docker inspect {container_id} | grep IPAddress
```

## Section 12: Designing the Database Structure

講師は有料の[https://www.malcolmhardie.com/sqleditor/](https://www.malcolmhardie.com/sqleditor/)　を使ってER作成していた。

CLIツールSoda CLI [https://gobuffalo.io/documentation/database/soda/](https://gobuffalo.io/documentation/database/soda/) を使ってmigrateする。

### 92. Creating the users table using migrations

./database.ymlにアクセス情報を記述

```bash
# ./migrations にup, downのマイグレーションファイルを作成
soda generate fizz CreateUserTable 
# ./migrationsを基にmigrate
soda migrate
```

## Section 13: Connecting our Application to the Database

postgresへのドライバーとして　[https://github.com/jackc/pgx](https://github.com/jackc/pgx)　を利用

MSのGo & Postgresのdevcontainerのサンプルでは　[https://github.com/lib/pq](https://github.com/lib/pq)　を利用していた。

### 98. How to connect a Go application to a database

### 104. Setting up database functions: inserting a reservation

Goのtime変換はユニーク

[https://www.pauladamsmith.com/blog/2011/05/go_time.html](https://www.pauladamsmith.com/blog/2011/05/go_time.html)
