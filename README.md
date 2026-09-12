# Video Transcripts

密碼入口的中英對照影片學習站。入口列出影片，點進去可邊看 YouTube、邊對照分段逐字稿。

## 本機預覽

不要用 `file://` 開，YouTube 內嵌與 `fetch` 會不穩。在專案根目錄：

```bash
python3 -m http.server 4173
```

然後開 <http://127.0.0.1:4173/>。

## 新增影片

1. 在 `videos/` 新增資料夾，放入 `index.html` 與 `transcript.json`。
2. 把該片資料加進根目錄 `videos.json`。
3. `transcript.json` 的每個段落需要 `start`（秒）、`zh`、`en`。

密碼不要寫進 README、issue 或公開貼文。
