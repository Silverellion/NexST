// NAVBAR TOGGLER

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

//PAGE HANDLER

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

// SORT FUNCTION

document.addEventListener('DOMContentLoaded', function() {
    function sortProductsByPrice(direction) {
        const productsContainer = document.querySelector('.row:has(.col-12.col-sm-6.col-md-4.col-lg-3)');
        
        if (!productsContainer) {
            console.error('Products container not found');
            return;
        }
        
        const productCards = Array.from(productsContainer.querySelectorAll('.col-12.col-sm-6.col-md-4.col-lg-3'));
        
        if (productCards.length === 0) {
            console.error('No product cards found');
            return;
        }
        
        productCards.sort((a, b) => {
            const priceA = extractPrice(a);
            const priceB = extractPrice(b);
            
            return direction === 'asc' ? priceA - priceB : priceB - priceA;
        });
        
        while (productsContainer.firstChild) {
            productsContainer.removeChild(productsContainer.firstChild);
        }
        
        productCards.forEach(card => {
            productsContainer.appendChild(card);
        });
    }
    
    function extractPrice(productCard) {
        const priceText = productCard.querySelector('.fw-bold.pe-2')?.textContent;
        if (!priceText) {
            return 0;
        }
        
        const price = parseFloat(priceText.replace(/[$,]/g, ''));
        return isNaN(price) ? 0 : price;
    }
    
    function highlightActiveButton(activeButton) {
        document.querySelectorAll('.sortbar .btn').forEach(button => {
            button.classList.remove('active');
        });
        
        activeButton.classList.add('active');
    }
    
    document.getElementById('sort-price-asc').addEventListener('click', function() {
        sortProductsByPrice('asc');
        highlightActiveButton(this);
    });
    
    document.getElementById('sort-price-desc').addEventListener('click', function() {
        sortProductsByPrice('desc');
        highlightActiveButton(this);
    });
    
    const style = document.createElement('style');
    style.textContent = `
        .sortbar .btn.active {
            background-color: #0d6efd;
            color: white;
        }
    `;
    document.head.appendChild(style);
});