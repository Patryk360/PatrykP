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
        $("#points").text("Punkty: "+points);
        $("#text").text(text.wordPolish.charAt(0).toUpperCase()+text.wordPolish.slice(1));
    });
}
$("#done").click(() => {
    if (($("#answer").val()).toLowerCase() === textData.allowed) {
        alert("dopuszczono");
        points += 0.5;
    }
    else if (($("#answer").val()).toLowerCase() === textData.wordGerman) {
        alert("poprawnie");
        points += 1;
    }
    else if (($("#answer").val()).toLowerCase() != textData.wordGerman) alert("Źle! Poprawna odpowiedź: "+textData.article.join(", ")+" "+textData.wordGerman.charAt(0).toUpperCase()+textData.wordGerman.slice(1));
    next();
});