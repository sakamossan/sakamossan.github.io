

# 単純に遷移させる

単純に遷移させるだけ

```js
window.location.href = "fb://profile";
```


## iOS9 (iPhone6) fb, twアプリ両方入ってる

- fb.html
  - アプリへ遷移出来る
- tw.html
  - アプリへ遷移出来る
- dummy.html
  - エラー: `ページが開けません アドレスが無効です`


## Android6 (xperia) fb, twアプリ両方入ってる

- fb.html
  - アプリへ遷移出来る
- tw.html
  - アプリへ遷移出来る
- dummy.html
  - 何も表示されない
  - エラーのmodalもなし


## iOS6 (iPodTouch) fbアプリだけ入ってる

- fb.html
  - アプリへ遷移出来る
- tw.html
  - エラー: `ページが開けません アドレスが無効です`
- dummy.html
  - エラー: `ページが開けません アドレスが無効です`


# try & fallback

アプリに遷移させようとして、遷移しなかったらWeb面に遷移させる方式

```js
location.href = webUri;
setTimeout(() => { location.href = appUri }, 500);
```

実際のコード: https://github.com/sakamossan/sakamossan.github.io/blob/813c3f483a/deeplink/deeplink.js


## iOS9 (iPhone6) twアプリ入り

- try-tw-and-fallback.html
  - アプリへ遷移出来る
  - ただし、ブラウザに戻った後に`ブロックしたポップアップ`と出てしまう
    - clearTimeoutが効いてない?
- try-dummy-and-fallback.html
  - webページに遷移できる


## Android6 (xperia) twアプリ入り

- try-tw-and-fallback.html
  - アプリへの遷移とwebページのポップアップが同時に起こってしまう
- try-dummy-and-fallback.html
  - webページに遷移できる


## ポップアップのブロック

- クリックの伴わない`window.open`を呼ぶとポップアップと判断される
- setTimeoutを長くしてクリックの2秒後とかにしてもポップアップと判断された(iOS, android両方)


### iOS9.2ではiframeでアプリ遷移ができなくなっている

https://github.com/hampusohlsson/browser-deeplink/issues/16

iOS9のプライバシーポリシー変更の一環っぽい

https://developer.apple.com/videos/play/wwdc2015/703/

![image](https://cloud.githubusercontent.com/assets/5309672/17427461/cf88826c-5b1b-11e6-9b5a-516d943db9a1.png)


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
-
