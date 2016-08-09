# Deeplinkメモ

やりたいこと

- アプリがインストールされてたらアプリに遷移する
- アプリがインストールされてなかったらWeb面に遷移する
- エラーやポップアップは表示させたくない


# まず単純に遷移させる

単純に`location.href`を使用して遷移させてみる

```js
window.location.href = "fb://profile";
```

ここらへんはまだ直感通りに動作してくれる

### iOS9 (iPhone6) fb, twアプリ両方入ってる

- fb.html
  - アプリへ遷移出来る
- tw.html
  - アプリへ遷移出来る
- dummy.html
  - エラー: `ページが開けません アドレスが無効です`


### Android6 (xperia) fb, twアプリ両方入ってる

- fb.html
  - アプリへ遷移出来る
- tw.html
  - アプリへ遷移出来る
- dummy.html
  - リアクションなし、iOSと違ってモーダルも出なかった


# iframeを使用して遷移させる

見えないiframeを画面に差し込んで遷移を発生させる方式

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

[issue](https://github.com/hampusohlsson/browser-deeplink/issues/16)で書かれてるとおりの挙動
iOS8までだと遷移できていた?(未確認) プライバシーポリシー変更の一環で遷移できなくなっている模様

- [Doesn't work on iOS 9 · Issue #16 · hampusohlsson/browser-deeplink](https://github.com/hampusohlsson/browser-deeplink/issues/16)
- [Privacy and Your App - WWDC 2015 - Videos - Apple Developer](https://developer.apple.com/videos/play/wwdc2015/703/)
![image](https://cloud.githubusercontent.com/assets/5309672/17427461/cf88826c-5b1b-11e6-9b5a-516d943db9a1.png)

なお、iOS9上のGoogleChromeでも同じ挙動。iOS9以上だとアプリに遷移しないと考えたほうが良さそう。

AppleはDeeplinkの代わりにUniversalLinkのほうを推進していく方針

- [URLスキーム・独自ディープリンク実装に代わる、Universal Links(iOS 9で導入)でより良いUXを実現 - Qiita](http://qiita.com/mono0926/items/2bf651246714f20df626)


### Android6.0 x Chrome

- アプリがインストールされている場合はアプリに遷移する
- インストールされていない場合はなにも起こらない


### `iframe.onload`

- iframe.srcのURLスキームがhttpじゃないと`iframe.onload`が発火しない
- 以前はこのイベントが発生するか否かでアプリに遷移したかどうかを判定していた
- フォールバック(web面に飛ばす)すべきか否かの判断ができない


# location.hrefを使用して遷移 & フォールバックさせる

`iframe`方式ではフォールバックするかが判定できないため、`location.href`に代入する方式で実装する

[実装: inject-href-or-fallback.js](https://github.com/sakamossan/sakamossan.github.io/blob/8f3d395/deeplink/src/inject-href-or-fallback.js)


### iOS9.3 x Safari

先に試した通りの挙動になる

#### アプリが入っている場合

- アプリを開いて良いかダイアログが出る
- ただし1秒後には問答無用でWeb面に遷移してしまう

`アプリを開いていいかダイアログ`がnon-blockingになっていて、返事をまたずにweb面への遷移が発生してしまう

#### アプリが入っていない場合


### Android6.0 x Chrome

エラーダイアログが表示されない分まだ希望が

- アプリが入っている場合
  - アプリ面に遷移する
- アプリが入っていない場合
  - Web面に遷移する


# ポップアップのブロックについて

`window.open`は適切なタイミングで呼ばないとスパムみたいな扱いを受ける

- クリックの伴わない`window.open`を呼ぶとポップアップと判断される
- その場合「ポップアップを表示しますか」といったconfirmが出てしまう
- クリックイベント内で`window.open`を呼んだ場合はconfirmは出ない
- ただし、クリックイベント内でもあんまり時間差があるとポップアップと判断される
  - setTimeoutを長くしてクリックの2秒後とかにしたらconfirmが出た(iOS, android両方)


## androidにおけるintentスキームについて

- androidではスキーマ部をintentにすることで遷移の挙動を少し変えることが出来る
- スキーマ部をintentにして、且つURLハッシュ部にアプリIDを含めると「アプリが入ってたら開く,入ってなかったらインストール画面に遷移する」という挙動になる


# テストについて

- テスト/動作確認が自動化出来ないとつらい
- 端末 x OS x ブラウザの組み合わせ数が多い


### browerstack

https://www.browserstack.com/question/655

### device-farm

> 提となるアプリのインストールについて設定してテスト環境を細かく調整し、

https://aws.amazon.com/jp/device-farm/

試していないが大丈夫そう

- device-farmではappiumを使ってテストを実行する
- [appiumにはアプリをインストールするAPIがある](
https://github.com/appium/python-client/blob/47cc892d78bb87293563f50c0439c202f1b6d8ce/appium/webdriver/webdriver.py#L502)


# 参考リンク

- [javascript - Deeplinking mobile browsers to native app - Issues with Chrome when app isn't installed - Stack Overflow](http://stackoverflow.com/questions/27151806/deeplinking-mobile-browsers-to-native-app-issues-with-chrome-when-app-isnt-in)
  - iframe以外のやり方を提示している
- [URLスキーム・独自ディープリンク実装に代わる、Universal Links(iOS 9で導入)でより良いUXを実現 - Qiita](http://qiita.com/mono0926/items/2bf651246714f20df626)
- [javascript - Is it secure to use window.location.href directly without validation - Stack Overflow](http://stackoverflow.com/questions/24078332/is-it-secure-to-use-window-location-href-directly-without-validation)
  - location.href使う場合はなんらかのvalidationが必要
