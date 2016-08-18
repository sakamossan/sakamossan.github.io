# Deeplinkメモ

やりたいこと

- アプリがインストールされてたらアプリに遷移する
- アプリがインストールされてなかったらWeb面に遷移する
- エラーやポップアップは表示させたくない

確認したのは下記の2ステップ

1. 単純にブラウザからアプリに遷移させるところ
1. 次に、ブラウザからアプリに遷移させようとして無理だったらブラウザにフォールバック遷移させる

ソースコードはこちら [sakamossan.github.io/deeplink at master · sakamossan/sakamossan.github.io](https://github.com/sakamossan/sakamossan.github.io/tree/master/deeplink)


# 単純にブラウザからアプリに遷移

まず単純に`location.href`を使用して遷移させてみる

```js
window.location.href = "twitter://profile";
```

### iOS9.3 x Safari

- アプリがインストールされてる場合はアプリへ遷移出来る
- インストールされてないアプリに遷移させようとした場合エラーになる
  - エラー: `ページが開けません アドレスが無効です`


### Android6.0 x Chrome

- アプリがインストールされてる場合はアプリへ遷移出来る
- インストールされてないアプリに遷移させようとした場合エラーになる
  - リアクションなし、iOSと違ってモーダルも出なかった


# iframeを使用して遷移させる

- 見えないiframeを画面に差し込んで遷移を発生させる方式
- `location.href`を直接いじらないのでUIに影響が少なく最近まで重宝されていた
  - `最近まで`というのは後述

```js
var iframe = document.createElement('iframe');
iframe.src = appDeeplinkURL;
iframe.setAttribute("style", "display:none;");
document.body.appendChild(iframe);
```

- [実装: iframe-redirect.js](https://github.com/sakamossan/sakamossan.github.io/blob/1b34ddf/deeplink/src/iframe-redirect.js)


### iOS9.3 x Safari

- アプリが入ってても入ってなくても遷移が起こらない
- ただし、エラーメッセージなども表示されない
- [Doesn't work on iOS 9 · Issue #16 · hampusohlsson/browser-deeplink](https://github.com/hampusohlsson/browser-deeplink/issues/16)で書かれてるとおりの挙動
- プライバシーポリシー変更の一環で遷移できなくなっている模様
  - [Privacy and Your App - WWDC 2015 - Videos - Apple Developer](https://developer.apple.com/videos/play/wwdc2015/703/)
- iOS8までだと遷移できていたかは未確認

なお、iOS9上のGoogleChromeでも同じ挙動。iOS9以上だとアプリに遷移しないと考えたほうが良さそう。

AppleはDeeplinkの代わりにUniversalLinkのほうを推進していく方針

- [URLスキーム・独自ディープリンク実装に代わる、Universal Links(iOS 9で導入)でより良いUXを実現 - Qiita](http://qiita.com/mono0926/items/2bf651246714f20df626)

iframe方式はiOS9.2から使えなくなっており、現在ではオワコン化している

### Android6.0 x Chrome

Androidの場合は遷移が発生するが、`iframe.onload`問題が浮上してる状態

- アプリがインストールされている場合はアプリに遷移する
- インストールされていない場合はなにも起こらない


##### `iframe.onload`問題

iframe方式だとユーザーがアプリに遷移したかどうかがわからなくなっている

- iframe.srcのURLスキームがhttpじゃないと`iframe.onload`が発火しない
- 以前はこのイベントが発生するか否かでアプリに遷移できたかどうかを判定していた
- フォールバック(web面に飛ばす)すべきか否かの判断ができない

「フォールバックすべきか否かの判断ができない」という点に置いてiOSと同様使い物にならなくなっている


# location.hrefを使用して遷移 & フォールバックさせる

`iframe`方式ではフォールバックするかが判定できないため、遷移部分は`location.href`に代入する方式で実装する

[実装: inject-href-or-fallback.js](https://github.com/sakamossan/sakamossan.github.io/blob/8f3d395/deeplink/src/inject-href-or-fallback.js)


### iOS9.3 x Safari

- アプリが入っている場合
  - アプリを開いて良いかダイアログが出る
  - ただし1秒後には問答無用でWeb面に遷移してしまう
  - `アプリを開いていいかダイアログ`がnon-blockingになっていて、返事をまたずにweb面への遷移が発生してしまう
- アプリが入っていない場合
  - エラーダイアログが出てしまう
  - `ページが開けません アドレスが無効です`

遷移部分は先に試した通りの挙動になる。  
またダイアログがノンブロッキングになっているのでフォールバックもできない

*結論: iOSだとやりたいことはできなくなっている, UniversalLinkを使う必要がある*


### Android6.0 x Chrome

期待通りの挙動をしてくれる

- アプリが入っている場合
  - アプリ面に遷移する
- アプリが入っていない場合
  - Web面に遷移する

*結論: Androidならやりたいことができる*


# その他

## ポップアップのブロックについて

`window.open`は適切なタイミングで呼ばないとスパムみたいな扱いを受ける

- クリックの伴わない`window.open`を呼ぶとポップアップと判断される
- その場合「ポップアップを表示しますか」といったconfirmが出てしまう
- クリックイベント内で`window.open`を呼んだ場合はconfirmは出ない
- ただし、クリックイベント内でもあんまり時間差があるとポップアップと判断される
  - setTimeoutを長くしてクリックの2秒後とかにしたらconfirmが出た(iOS, android両方)


## androidにおけるintentスキームについて

- androidではスキーマ部をintentにすることで遷移の挙動を少し変えることが出来る
- スキーマ部をintentにして、且つURLハッシュ部にアプリIDを含めると「アプリが入ってたら開く,入ってなかったらインストール画面に遷移する」という挙動になる


## テストについて

- テスト/動作確認が自動化出来ないとつらい
- 端末 x OS x ブラウザの組み合わせ数が多い


### browerstack

browerstackはdeeplinkのテストはできない

> At this time, the mobile devices are available exclusively for cross-browser testing. Mobile app testing is on our roadmap for a later date.

https://www.browserstack.com/question/655


### device-farm

> 前提となるアプリのインストールについて設定してテスト環境を細かく調整し、

https://aws.amazon.com/jp/device-farm/

試していないが出来そうな感じ

- device-farmではappiumを使ってテストを実行する
- [appiumにはアプリをインストールするAPIがある](
https://github.com/appium/python-client/blob/47cc892d78bb87293563f50c0439c202f1b6d8ce/appium/webdriver/webdriver.py#L502)


## あわせて読みたい

- [javascript - Deeplinking mobile browsers to native app - Issues with Chrome when app isn't installed - Stack Overflow](http://stackoverflow.com/questions/27151806/deeplinking-mobile-browsers-to-native-app-issues-with-chrome-when-app-isnt-in)
  - iframe以外のやり方を提示している
- [URLスキーム・独自ディープリンク実装に代わる、Universal Links(iOS 9で導入)でより良いUXを実現 - Qiita](http://qiita.com/mono0926/items/2bf651246714f20df626)
- [javascript - Is it secure to use window.location.href directly without validation - Stack Overflow](http://stackoverflow.com/questions/24078332/is-it-secure-to-use-window-location-href-directly-without-validation)
  - location.href使う場合はなんらかのvalidationが必要
