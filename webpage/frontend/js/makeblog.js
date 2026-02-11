const BlogId = 'blog-' + Date.now();
let blogEditor;

function UploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return {
            upload: async () => {
                try {
                    const file = await loader.file;
                    const data = new FormData();
                    data.append('upload', file);

                    const response = await fetch(`/makeblog/upload/${BlogId}`, {
                        method: 'POST',
                        body: data
                    });

                    if (!response.ok) throw new Error('Upload failed');

                    const result = await response.json();
                    
                    return {
                        default: result.url
                    };
                } catch (error) {
                    console.error('Błąd uploadu:', error);
                    throw error;
                }
            }
        };
    };
}

async function initEditor() {
    try {
        const editor = await ClassicEditor.create(document.querySelector('#editor'), {
            extraPlugins: [ UploadAdapterPlugin ]
        });
        blogEditor = editor;
        console.log("Edytor gotowy");
    } catch (error) {
        console.error("Błąd tworzenia edytora:", error);
    }
}

initEditor();

async function saveBlog() {
    const title = document.getElementById('blogTitle').value;
    const description = document.getElementById('blogDescription').value;
    const content = blogEditor.getData();
    const fileInput = document.getElementById('blogThumbnail');

    if (!title || !content) {
        alert("Wypełnij tytuł i treść!");
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('content', content);
    formData.append('blogId', BlogId);
    if (fileInput.files.length > 0) {
        formData.append('thumbnail', fileInput.files[0]);
    }

    try {
        const response = await fetch('/blog/save', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            alert("Blog zapisany pomyślnie!");
            window.location.href = "/blogs";
        } else {
            const errData = await response.json();
            alert("Błąd: " + (errData.error || "Błąd serwera"));
        }
    } catch (err) {
        console.error("Błąd wysyłki:", err);
    }
}

function previewThumbnail(event) {
    const reader = new FileReader();
        reader.onload = function() {
            const output = document.getElementById('thumbnailPreview');
            output.src = reader.result;
            document.getElementById('thumbnailContainer').style.display = 'block';
    };
    reader.readAsDataURL(event.target.files[0]);
}