var regex = /[^a-zA-Z0-9|\$|\@]|\^/g;
var splitRegex = /\b/;
var placeHolder = "*";
var replaceRegex = /\w/g;
var exclude:Array<string> = [];

function isProfane(blackListedWords: Array<string>, string: string):boolean {
    console.log("The black", blackListedWords)
    return (
        blackListedWords.filter((word) => {
            const wordExp = new RegExp(
                `\\b${word.replace(/(\W)/g, "\\$1")}\\b`,
                "gi"
            );
            return (
                !exclude.includes(word.toLowerCase()) && wordExp.test(string)
            );
        }).length > 0 || false
    );
}

function replaceWord(string:string):string {
    return string.replace(regex, "").replace(replaceRegex, placeHolder);
}

export function clean(blackListedWords: Array<string>, string: string) {
    return string
        .split(splitRegex)
        .map((word) => {
            return isProfane(blackListedWords, word) ? replaceWord(word) : word;
        })
        .join(splitRegex.exec(string)![0]);
}
