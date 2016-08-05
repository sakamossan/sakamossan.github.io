# 単純に遷移させる

単純に遷移させるだけ

```js
window.location.href = "fb://profile";
```

## fbアプリだけ入ってるiPodTouch

- fb.html
  - アプリへ遷移出来る
- tw.html
  - エラー: `ページが開けません アドレスが無効です`
- dummy.html
  - エラー: `ページが開けません アドレスが無効です`


## fb, twアプリ両方入ってるiPhone6

- fb.html
  - アプリへ遷移出来る
- tw.html
  - アプリへ遷移出来る
- dummy.html
  - エラー: `ページが開けません アドレスが無効です`



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
