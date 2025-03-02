const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app); // サーバーの作成
const io = new Server(server); // Socket.IO サーバーの作成
const PORT = process.env.PORT || 3000;

let cards = [
    { id: 1, info: "カード1の秘密情報" },
    { id: 2, info: "カード2の秘密情報" },
    { id: 3, info: "カード3の秘密情報" },
    { id: 4, info: "カード4の秘密情報" },
    { id: 5, info: "カード5の秘密情報" },
    { id: 6, info: "カード6の秘密情報" },
];

let drawnCardsCount = 0;

// Socket.IO サーバーの設定
io.on('connection', (socket) => {
    console.log('プレイヤーが接続しました:', socket.id);

    // 初期化リクエスト
    socket.on('initGame', () => {
        socket.emit('initCards', cards); // 初期カードをクライアントに送信
    });

    // カードを引くリクエスト
    socket.on('drawCard', (index) => {
        if (drawnCardsCount < 3 && cards[index]) {
            const card = cards[index];
            cards[index] = null; // カードを引いたことにする
            drawnCardsCount++;
            socket.emit('cardInfo', { index, info: card.info }); // カード情報を送信
        }
    });

    // ゲームリセット
    socket.on('resetGame', () => {
        cards = [
            { id: 1, info: "藤崎 莉緒と話すとき、あなたは胸の鼓動が早くなるのを感じた。" },
            { id: 2, info: "長谷川 創と話すとき、あなたはイライラとする感情を自身に感じた。" },
            { id: 3, info: "桐生 夏音と話すとき、あなたはガッカリとした感情を自身に感じた。" },
            { id: 4, info: "あなたは、落合 竜の写真を見たとき、恐怖の感情を自身に感じた。" },
            { id: 5, info: "あなたの傷跡はひどく、抵抗力が低下した患者専用のクリーンルームの病室にいる。" },
            { id: 6, info: "あなたの体には、火傷以外の打撲等の傷がある。" },
        ];
        drawnCardsCount = 0;
        socket.emit('gameReset', { cards }); // 初期化カードを送信
    });
});

// 静的ファイルの提供
app.use(express.static(__dirname + '/public'));

// サーバーの起動 (server.listen を使用)
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
