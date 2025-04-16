$(document).ready(async function() {
    // Load header
    await fetch('../html/header1.html')
        .then(response => response.text())
        .then(data => {
            $("#header-placeholder").html(data);
        })
        .catch(error => console.error('Lỗi khi đọc header:', error));

    // Load footer
    await fetch('../html/footer.html')
        .then(response => response.text())
        .then(data => {
            $("#footer-placeholder").html(data);
        })
        .catch(error => console.error('Lỗi khi đọc footer:', error));

        
});
