let points = 0;
let textData = {}
$(document).ready(() => {
    $.getJSON( "/wordsjson/english.json", (data) => {
        const text = data[Math.floor(Math.random()*data.length)];
        textData = text;
        $("#points").text("Punkty: "+points);
        $("#text").text(text.wordPolish.charAt(0).toUpperCase()+text.wordPolish.slice(1));
    });
});
const next = () => {
    $.getJSON( "/wordsjson/english.json", (data) => {
        const text = data[Math.floor(Math.random()*data.length)];
        textData = text;
        $("#answer").val("");
        $("#points").text("Punkty: "+points);
        $("#text").text(text.wordPolish.charAt(0).toUpperCase()+text.wordPolish.slice(1));
    });
}
$("#done").click(() => {
    const answerRaw = ($("#answer").val()).toLowerCase();
    if (answerRaw == textData.wordEnglish) {
        alert("poprawnie");
        points += 1;
    }
    else if (answerRaw != textData.wordEnglish) alert("Źle! Poprawna odpowiedź: "+textData.wordEnglish);
    next();
});