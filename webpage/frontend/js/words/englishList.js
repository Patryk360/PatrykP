$(document).ready(() => {
    $.getJSON( "/wordsjson/english.json", (data) => {
        let html = "";
        let i = 1;
        for (const word of data) {
            html += `<a>${i}. ${word.wordEnglish} - ${word.wordPolish}</a><br>`;
            i++;
        }
        $("#text").html(html);
    });
});