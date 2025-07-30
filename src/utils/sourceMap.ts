// 找到以.js结尾的fileName
function matchStr(str: string) {
    if (str.endsWith('.js')) return str.substring(str.lastIndexOf('/') + 1);
}


export function loadSourceMap(fileName: string) {
    let file = matchStr(fileName);
    if (!file) return;
    return new Promise((resolve) => {
        fetch(`http://localhost:8083/getmap?fileName=${file}`).then((response) => {
            resolve(response.json());
        });
    });
}