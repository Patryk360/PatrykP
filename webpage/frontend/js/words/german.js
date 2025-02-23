let points = 0;
let textData = {}
$(document).ready(() => {
    $.getJSON( "/wordsjson/german.json", (data) => {
        const text = data[Math.floor(Math.random()*data.length)];
        textData = text;
        $("#points").text("Punkty: "+points);
        $("#text").text(text.wordPolish.charAt(0).toUpperCase()+text.wordPolish.slice(1));
    });
});
const next = () => {
    $.getJSON( "/wordsjson/german.json", (data) => {
        const text = data[Math.floor(Math.random()*data.length)];
        textData = text;
        $("#answer").val("");
        $("#points").text("Punkty: "+points);
        $("#text").text(text.wordPolish.charAt(0).toUpperCase()+text.wordPolish.slice(1));
    });
}
$("#done").click(() => {
    const answerRaw = ($("#answer").val()).toLowerCase();
    const answer = answerRaw.split(" ")[1];
    const splitAnswer = answerRaw.split(" ")[0];
    if (textData.article.includes(splitAnswer.toLowerCase())&&(answer === textData.allowed)) {
        alert("dopuszczono");
        points += 0.5;
    }
    else if (textData.article.includes(splitAnswer.toLowerCase())&&(answer === textData.wordGerman)) {
        alert("poprawnie");
        points += 1;
    }
    else if (!(textData.article.includes(splitAnswer.toLowerCase()))||answer != textData.wordGerman) alert("Źle! Poprawna odpowiedź: "+textData.article.join(" lub ")+" "+textData.wordGerman.charAt(0).toUpperCase()+textData.wordGerman.slice(1)+" Pamiętaj o rodzajnikach :D");
    next();
});