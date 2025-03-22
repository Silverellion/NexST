document.getElementById('sidebarToggle').addEventListener('click', function() {
    const sidebar = document.getElementById('filterSidebar');
    sidebar.classList.toggle('sidebar-collapsed');
    
    const mainContent = document.getElementById('mainContent');
    mainContent.classList.toggle('main-content-expanded');
    
    this.classList.toggle('sidebar-toggle-shifted');
    
    const icon = document.getElementById('toggleIcon');
    if (sidebar.classList.contains('sidebar-collapsed')) {
        icon.innerHTML = '&#9654;'; 
    } else {
        icon.innerHTML = '&#9664;'; 
    }
});

function toggleSection(id) {
    const section = document.getElementById(id);
    section.classList.toggle('filter-expanded');
    
    const icon = section.previousElementSibling.querySelector('.dropdown-icon');
    if (section.classList.contains('filter-expanded')) {
        icon.innerHTML = '&#9660;';
    } else {
        icon.innerHTML = '&#9650;'; 
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const pageLinks = document.querySelectorAll('.pagination .page-link[data-page]');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const totalPages = pageLinks.length;
    let currentPage = 1;
    
    function showPage(pageNumber) {
        document.querySelectorAll('.product-grid').forEach(page => {
            page.classList.remove('active');
        });
        
        const pageToShow = document.getElementById(`page-${pageNumber}`);
        if (pageToShow) {
            pageToShow.classList.add('active');
        }
        
        document.querySelectorAll('.pagination .page-item').forEach(item => {
            item.classList.remove('active');
        });
        
        document.querySelector(`.pagination .page-link[data-page="${pageNumber}"]`)
            .parentElement.classList.add('active');
        
        currentPage = pageNumber;
        
        prevButton.classList.toggle('disabled', currentPage === 1);
        nextButton.classList.toggle('disabled', currentPage === totalPages);
    }
    
    pageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageNumber = parseInt(this.getAttribute('data-page'));
            showPage(pageNumber);
        });
    });
    
    prevButton.addEventListener('click', function(e) {
        e.preventDefault();
        if (currentPage > 1) {
            showPage(currentPage - 1);
        }
    });
    
    nextButton.addEventListener('click', function(e) {
        e.preventDefault();
        if (currentPage < totalPages) {
            showPage(currentPage + 1);
        }
    });
    
    showPage(1);
});