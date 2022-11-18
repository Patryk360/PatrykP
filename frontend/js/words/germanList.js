$(document).ready(() => {
    $.getJSON( "/wordsjson/german.json", (data) => {
        let html = "";
        let i = 1;
        for (const word of data) {
            html += `<a>${i}. ${word.wordPolish.charAt(0).toUpperCase()+word.wordPolish.slice(1)} - ${word.article.join(", ")} ${word.wordGerman.charAt(0).toUpperCase()+word.wordGerman.slice(1)}</a><br>`;
            i++;
        }
        $("#text").html(html);
    });
});