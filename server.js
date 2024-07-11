// deno.landに公開されているモジュールをimport
// denoではURLを直に記載してimportできます
import { serveDir } from "https://deno.land/std@0.223.0/http/file_server.ts";

let previousWord = "しりとり";

// localhostにDenoのHTTPサーバーを展開
Deno.serve(async (request) => {
    // パス名を取得する
    // http://localhost:8000/hoge に接続した場合"/hoge"が取得できる
    const pathname = new URL(request.url).pathname;
    console.log(`pathname: ${pathname}`);

    if(request.method === "GET" && pathname === "/shiritori"){
        return new Response(previousWord);
    }//直前の単語を返す

    //次の単語の入力
    if(request.method === "POST" && pathname === "/shiritori"){
        const requestJson = await request.json();
        const nextWord = requestJson["nextWord"];//jsonからnextwordの取得

        if(previousWord.slice(-1) === nextWord.slice(0,1)){
            //前の単語の末尾と次の単語の先頭が同じ文字か
            previousWord = nextWord;
        }else{
            return new Response(
                JSON.stringify({
                    "errorMessage": "正しい単語を入力してください",
                    "errorCode": "10001"
                }),
                {
                    status: 400,
                    headers: {"Content-Type": "application/json; charset=utf-8" },
                }
            );
        }

        return new Response(previousWord);
    }
    // ./public以下のファイルを公開
    return serveDir(request, {
        /*
        - fsRoot: 公開するフォルダを指定
        - urlRoot: フォルダを展開するURLを指定。今回はlocalhost:8000/に直に展開する
        - enableCors: CORSの設定を付加するか
        */
        request,
        fsRoot: "./public/",
        urlRoot: "",
        enableCors: true,
    });
});

