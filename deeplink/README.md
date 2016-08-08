

# 単純に遷移させる

単純に`location.href`を使用して遷移させる

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

- [ソースコード iframe-redirect.js](https://github.com/sakamossan/sakamossan.github.io/blob/1b34ddf/deeplink/src/iframe-redirect.js)
- [iframe-redirect-tw.html](https://github.com/sakamossan/sakamossan.github.io/blob/master/deeplink/html/iframe-redirect-tw.html)ではtwitterアプリを起動させている


### iOS9.3 x Safari

エラーにはなっていないが遷移しない

↓のissueで書かれてるとおり
https://github.com/hampusohlsson/browser-deeplink/issues/16

iOS8までだと遷移できていたがのプライバシーポリシー変更の一環で遷移できなくなっている模様
https://developer.apple.com/videos/play/wwdc2015/703/
![image](https://cloud.githubusercontent.com/assets/5309672/17427461/cf88826c-5b1b-11e6-9b5a-516d943db9a1.png)


### Android6.0 x Chrome

- アプリに遷移する
- ただし、`iframe.onload`イベントが発生しない
- androidの場合, URLをintentスキームに書き換えると`iframe.onload`イベントが呼ばれるかもしれない(要確認)
  -  [参考: browser-deeplink/browser-deeplink.js at master · hampusohlsson/browser-deeplink](https://github.com/hampusohlsson/browser-deeplink/blob/master/browser-deeplink.js#L206)


# ポップアップのブロックについて

`window.open`は適切なタイミングで呼ばないとスパムみたいな扱いを受ける

- クリックの伴わない`window.open`を呼ぶとポップアップと判断される
- その場合「ポップアップを表示しますか」といったconfirmが出てしまう
- クリックイベント内で`window.open`を呼んだ場合はconfirmは出ない
- ただし、クリックイベント内でもあんまり時間差があるとポップアップと判断される
  - setTimeoutを長くしてクリックの2秒後とかにしたらconfirmが出た(iOS, android両方)


## androidにおけるintentスキームについて


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

- [URLスキーム・独自ディープリンク実装に代わる、Universal Links(iOS 9で導入)でより良いUXを実現 - Qiita](http://qiita.com/mono0926/items/2bf651246714f20df626)
