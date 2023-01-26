---
title: "「A tour of go」前半の学習メモ"
date: "2023-01-25"
thumbnail: "/images/gopher.jpg"
---

ポストのiconは[ここ](https://github.com/egonelbre/gophers)から


## 背景
Goを勉強したいと思って色々探した。[公式のチュートリアル](https://go-tour-jp.appspot.com/list)が良さそうだったのでこれを使って学習した。
今回は前半部分の下記のメモを書く

**前半**
- Basics
    - Packages, variables, and functions.(17ページ)
    - Flow control statements: for, if, else, switch and defer(14ページ)
    - More types: structs, slices, and maps.(27ページ)
- Methods and interfaces(26ページ)

**後半**
- Generics
- Concurrency

後半は後日、感想を投稿予定。

---


## Basics
### Packages, variables, and functions.(17ページ)
#### [Imports](https://go-tour-jp.appspot.com/basics/2)
factored:要素化、グループ化、整理済み　という意味。
factored importは()で囲った下記のようなもの
```
import (
    "fmt"
    "math"
)
```
#### [Exported names](https://go-tour-jp.appspot.com/basics/3)
Goでは外部パッケージから使える関数、定数は大文字で始まる。
```
// main package内(=fmt, mathパッケージ外)
fmt.Println // fmtパッケージの関数Println
math.Pi　// mathパッケージの定数Pi
```
#### [Functions continued](https://go-tour-jp.appspot.com/basics/5)
	関数の２つ以上の引数が同じ型のときは最後の型だけ残して省略可能
```
func add(x, y int) int {
    return x + y
}
```
#### [Named return values](https://go-tour-jp.appspot.com/basics/7)
戻り値に変数名をつけられる。複数の戻り値がある時便利。

注意： *短い関数でのみ利用すべき。長い関数だと読みやすさ悪影響*
#### [Short variable declarations](https://go-tour-jp.appspot.com/basics/10)
	関数外では暗黙的な変数宣言(:=)は使えない
#### [Basic types](https://go-tour-jp.appspot.com/basics/11)
charがない。複素数(complex64, complex128)がある。
intはあるのに**float**がない(float32, float64はある)
整数は基本的に**int**使う。
built-inの型の一覧は[こちら](https://golang.google.cn/pkg/builtin/)にある。
型を知りたいときは　    
```
fmt.Printf("%T", x) // xの型名
```
#### [Zero values](https://go-tour-jp.appspot.com/basics/12)
変数を初期値なしで宣言した際の値をZero valueという。初期値みたいな。

interfaceはnil
#### [Type conversions](https://go-tour-jp.appspot.com/basics/13)
*型名()* でキャスト可能
明示的な変換が必要。

負の整数をuintに変換したコンパイルエラー出なかった。
```
x := -34 // -34
y := uint(x) // 18446744073709551582 <- 何の値？
```

---


### Flow control statements: for, if, else, switch and defer(14ページ)
#### [For](https://go-tour-jp.appspot.com/flowcontrol/1)
ifやforの条件式を格好()で囲う必要なし。
#### [For is Go’s “while”](https://go-tour-jp.appspot.com/flowcontrol/3)
while文は無い。代わりにforを使う。
#### [Forever](https://go-tour-jp.appspot.com/flowcontrol/4)
for文に条件式を空で無限ループ作れる。
#### [If](https://go-tour-jp.appspot.com/flowcontrol/5)
for文同様に条件を格好()で囲う必要なし

#### [If with a short statement](https://go-tour-jp.appspot.com/flowcontrol/6)
golangには三項演算子がない。if文に条件の前に式をかける。式が複数のときは **;** で区切る
#### [Switch](https://go-tour-jp.appspot.com/flowcontrol/9)
break文は自動で付く。意図的にbreakさせたくないときは、 **fallthrough** をつけてbreakさせないこともできる。
#### [Switch with no condition](https://go-tour-jp.appspot.com/flowcontrol/11)
長くなるif-then-elseを書く際は条件の無いswitchでかける。便利
#### [Defer](https://go-tour-jp.appspot.com/flowcontrol/12)
#### [Stacking defers](https://go-tour-jp.appspot.com/flowcontrol/13)
defer(遅延実行)はreturn文の後に実行される。defer内の実行順はstack
```
func main() {
    for i := 0; i <3; i++ {
        defer fmt.Println(i)
    }
    fmt.Println("hello")
}
// output
// hello
// 2
// 1
// 0
```

---

### More types: structs, slices, and maps.(27ページ)

#### [Pointers](https://go-tour-jp.appspot.com/moretypes/1)
何もポインターに値が入っていないと、nilになる。
C言語と異なりポインタ演算はない
#### [Structs](https://go-tour-jp.appspot.com/moretypes/2)
struct(構造体)はフィールドの集まり
#### [Pointers to structs](https://go-tour-jp.appspot.com/moretypes/4)
	
structのフィールドへのアクセスの2つの方法
```
type Vertex struct {
    X int
    Y int
}

func main() {
    v := Vertex{X: 1, Y: 2}

    // ①直接参照
    fmt.Println(v.X) // 1
    // ②Pointer経由で参照
    p := &v
    fmt.Println(p.X)    // 1
    fmt.Println((&v).X) // 1
}
```
#### [Arrays](https://go-tour-jp.appspot.com/moretypes/6)
サイズ固定、型固定、sliceよりパフォーマンスは良い
#### [Slices](https://go-tour-jp.appspot.com/moretypes/7)
サイズ非固定、型固定

まとめ

|   |Arrays   |Slices   |
|---|---|---|
| サイズ |固定   | 柔軟  |
|  要素の型 | 固定  | 固定  |
|  パフォーマンス | ◯  | △  |

#### [Slices are like references to arrays](https://go-tour-jp.appspot.com/moretypes/8)
	
配列から取り出したSliceは配列のアドレスを保持しているだけ＝＞スライスの変更は配列にも反映される(shallow copy)
#### [Slice length and capacity](https://go-tour-jp.appspot.com/moretypes/11)
	
要素数はlen(), 容量はcap()で取得可能。cap()は長さが増えると自動で増える
```
slice := []int{1,2,3}
len(slice)
cap(slice)
```
#### [Creating a slice with make](https://go-tour-jp.appspot.com/moretypes/13)
スライスは[make関数](https://pkg.go.dev/builtin#make)で作れる。map, channelもmake()で作れる。

#### [Appending to a slice](https://go-tour-jp.appspot.com/moretypes/15)
built-in関数(importなしで使える。全部で15個)は小文字で始まる。一覧は[こちら](https://pkg.go.dev/builtin#pkg-functions)

#### [Range](https://go-tour-jp.appspot.com/moretypes/16)
rangeは関数ではなく **キーワード**
	
[こちら](https://go.dev/ref/spec#For_statements)の「For statements with range clause」に詳細あり


|   | 1st velue  | 2nd value  |
|---|---|---|
| array/slice  |  index | value  |
| string  | index  | rune  |
| map  | key  | value  |
| channel  | element  | 無し  |
#### [Exercise: Slices](https://go-tour-jp.appspot.com/moretypes/18)
	
ローカル環境で試したが拡張子がわからないため画像ファイルの表示が出来なかった。	go tourサーバー上でしか見ることができない？？

ローカルで実行したところ *IMAGE:iVBORw0KGgoAAAANSUhEUgAAAQAAA……* から始まるファイルが生成された。

#### [Maps](https://go-tour-jp.appspot.com/moretypes/19)
辞書型みたいな。キーとバリューからなる。

#### [Mutating Maps](https://go-tour-jp.appspot.com/moretypes/22)
	
mapの存在しないキーにアクセスした際、値は初期値を変えす(エラーにはならない)。存在するかどうかはm[“key”]の第二戻り値がboolで返してくれる。
elem, ok = m[key]

#### [Exercise: Maps](https://go-tour-jp.appspot.com/moretypes/23)
```
func WordCount(s string) map[string]int {
	words := strings.Fields(s)
	result := make(map[string]int)

	for _, val := range words {
		_, ok := result[val]
		if ok {
			result[val] += 1
		} else {
			result[val] = 1
		}
	}
	return result
}
```
#### [Function values](https://go-tour-jp.appspot.com/moretypes/24)
関数は変数。だから関数の引数にもなる。

#### [Function closures](https://go-tour-jp.appspot.com/moretypes/25)
クロージャは、それ自身の外部から変数を参照する関数値	

--- 

## Methods and interfaces(26ページ)
#### [Methods](https://go-tour-jp.appspot.com/methods/1)
クラスの仕組みはない。代わりにstructを使う。メソッドはfuncの後にレシーバー引数をつけることでできる。
#### [Methods are functions](https://go-tour-jp.appspot.com/methods/2)
	
通常の関数としても記述可能
#### [Methods continued](https://go-tour-jp.appspot.com/methods/3)
自作した型にメソッドをつけることができる。ただし、**他のパッケージで定義された型に対してはレシーバを伴うメソッド宣言出来ない。**
#### [Pointer receivers](https://go-tour-jp.appspot.com/methods/4)
ポインターレシーバを使うことで元の値を変更出来る。
レシーバーの種類は２つある。valueレシーバとpointerレシーバ。valueレシーバーはdeep copyでポインタレシーバはshallow copy
#### [Methods and pointer indirection](https://go-tour-jp.appspot.com/methods/6)
	
メソッドがポインタレシーバーのとき、呼び出し側は変数、ポインタどちらでもコンパイルエラーにはならない。変数のときは自動でポインタに変換して解釈してくれる。

#### [Choosing a value or pointer receiver](https://go-tour-jp.appspot.com/methods/8)
	
ポインタレシーバーを使う2つの理由
1. メソッドがレシーバの指す先の変数を変更するため
2. メソッドの呼び出すたびに値のコピーを避けるため
注意、一般に２種のレシーバーを混合すべきではない

```
// ポインタレシーバーは(v *Vertex)の部分
func (v *Vertex) Scale(f float64) {
	v.X = v.X * f
	v.Y = v.Y * f
}
```
#### [Interfaces](https://go-tour-jp.appspot.com/methods/9)
	
interfaceはメソッドのシグニチャの集まり。

※structはフィールドの集まり。

#### [Interfaces are implemented implicitly](https://go-tour-jp.appspot.com/methods/10)
	
golangではimplementsキーなどでinterfaceの実装は明示的にする必要なし。

#### [Interface values with nil underlying values](https://go-tour-jp.appspot.com/methods/12)
	
```
y := &T{} // yはnilにならない
var y *T // yはnilになる
```
Interfaceの具体的な値がnilのことを考慮してメソッドを記述する必要あり。例はサイトのfunc (t *T) M() 参照。
考慮しないと *”runtime error: invalid memory address or nil pointer dereference”* 発生する

#### [Nil Interface values](https://go-tour-jp.appspot.com/methods/13)
	
nilインターフェイス(変数をインターフェイスで宣言しただけ)には何も値や型が保持していないため、インターフェイスのメソッドを呼び出すとランタイムエラー出る。 *”runtime error: invalid memory address or nil pointer dereference”*

#### [The empty interface](https://go-tour-jp.appspot.com/methods/14)
	
ゼロ個のメソッドを指定したインターフェイルは **emptyインターフェース** と呼ぶ。
emptyインターフェースはどんな型でも保持出来る。（全ての型は少なくともゼロ個以上のメソッドを実装しているから）Emptyインターフェイスは未知の型の値を扱うコードで利用される。

下記ではEmptyインターフェイス　Anyを宣言してsliceで利用している。
```
type Any interface{}
func main() {
    slice := []Any{"hello", 3}
    fmt.Println(slice) // [hello 3]
}
```
#### [Type assertions](https://go-tour-jp.appspot.com/methods/15)
	
型アサーションはインターフェイスの基の値を利用する際に利用する。
マップのキーアクセスm[key]のように、
```
// Tは任意の型
t := i.(T) // tはゼロ値(Tが異なっているとき) tは基の値(Tが合っているとき）例外はどちらにせよ発生しない
t, ok := i.(T)　// tはゼロ値(ok=falseのとき) tは基の値(ok=trueのとき)
```
#### [Type switches](https://go-tour-jp.appspot.com/methods/16)
	
**.(type)** はswitchの条件式でないと次のコンパイルエラーになる。

*invalid AST: use of .(type) outside type switch (exit status 2)*
	
switch外でも使えたら便利だと思った。

#### [Stringers](https://go-tour-jp.appspot.com/methods/17)
	
[Stringerインターフェイス](https://pkg.go.dev/fmt#Stringer)はよく使う。Printlnしたときの表示を定義できる
	
#### [Exercise: Stringers](https://go-tour-jp.appspot.com/methods/18)
```
func (ip IPAddr) String() string {
    return fmt.Sprintf("%v.%v.%v.%v", ip[0], ip[1], ip[2], ip[3])
}
```
#### [Errors](https://go-tour-jp.appspot.com/methods/19)
	
built-inのインターフェイス　[error](https://pkg.go.dev/builtin#error) 

エラー文のフォーマットはこのinterfaceのError() stringを実装することで変更可能。
関数はよくerrorを戻り値として持つ。errorがnilのとき成功、nilではないとき失敗を意味する

#### [Readers](https://go-tour-jp.appspot.com/methods/21)
	
ioパッケージの[Readerインタフェース](https://pkg.go.dev/io#Reader)はファイルなどからテキスト読み込む際に使う。




## 感想
- 誤訳が多かったので最初から英語版を使えばよかったと後悔。

    日本語版は修正依頼を[こちら](https://github.com/atotto/go-tour-jp/issues)で受け付けているみたい。ただ、更新が止まってる....

- Appleのメモアプリで記載していたが、最初からmarkdownで書いておけばよかったと後悔

- Golangの公式ドキュメントは読みやすい

