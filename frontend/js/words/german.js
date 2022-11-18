let textData = {}
$(document).ready(() => {
    $.getJSON( "/wordsjson/german.json", (data) => {
        const text = data[Math.floor(Math.random()*data.length)];
        textData = text;
        $("#text").text(text.wordPolish);
    });
});
$("#done").click(() => {
    if (($("#answer").val()).toLowerCase() === textData.allowed) alert("dopuszczono");
    else if (($("#answer").val()).toLowerCase() === textData.wordGerman) alert("poprawnie");
    else if (($("#answer").val()).toLowerCase() != textData.wordGerman) alert("źle");
});