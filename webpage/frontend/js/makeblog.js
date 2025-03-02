ClassicEditor
.create(document.querySelector("#editor"),
{
    simpleUpload: {
        uploadUrl: "/makeblog/upload",
    }
})
.then(editor => {
    console.log("Editor was initialized", editor);
})
.catch(error => {
    console.error(error);
});