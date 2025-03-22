// -------------- NAVBAR TOGGLER --------------

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
        icon.src = "../icons/filter/down.svg";
    } else {
        icon.src = "../icons/filter/up.svg"; 
    }
}

// -------------- PRICE SLIDER --------------
document.addEventListener('DOMContentLoaded', function() {
    const minSlider = document.getElementById('minPrice');
    const maxSlider = document.getElementById('maxPrice');
    const minPriceLabel = document.getElementById('minPriceLabel');
    const maxPriceLabel = document.getElementById('maxPriceLabel');
    const rangeHighlight = document.querySelector('.range-highlight');
    
    const maxValue = parseInt(maxSlider.max);
    minSlider.value = 0;
    maxSlider.value = 10000;
    
    function formatCurrency(value) {
        return '$' + parseInt(value).toLocaleString();
    }
    
    function updateRangeHighlight() {
        const minPercent = (minSlider.value / maxValue) * 100;
        const maxPercent = (maxSlider.value / maxValue) * 100;
        
        rangeHighlight.style.left = minPercent + '%';
        rangeHighlight.style.right = (100 - maxPercent) + '%';
    }
    
    function extractPrice(productCard) {
        const priceText = productCard.querySelector('.fw-bold.pe-2')?.textContent;
        if (!priceText) {
            return 0;
        }
        const price = parseFloat(priceText.replace(/[$,]/g, ''));
        return isNaN(price) ? 0 : price;
    }
    
    function filterProductsByPrice() {
        const minValue = parseInt(minSlider.value);
        const maxValue = parseInt(maxSlider.value);
        document.querySelectorAll('.product-grid .col-12.col-sm-6.col-md-4.col-lg-3').forEach(product => {
            const price = extractPrice(product);
            if (price >= minValue && price <= maxValue) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }
    
    minSlider.addEventListener('input', function() {
        let minValue = parseInt(minSlider.value);
        let maxValue = parseInt(maxSlider.value);
        
        //MIN VALUE RANGE OF 200

        if (maxValue - minValue < 200) {
            minSlider.value = maxValue - 200;
            minValue = parseInt(minSlider.value);
        }
        
        minPriceLabel.textContent = formatCurrency(minValue);
        updateRangeHighlight();
        filterProductsByPrice();
    });
    
    maxSlider.addEventListener('input', function() {
        let minValue = parseInt(minSlider.value);
        let maxValue = parseInt(maxSlider.value);
        
        //MIN VALUE RANGE OF 200

        if (maxValue - minValue < 200) {
            maxSlider.value = minValue + 200;
            maxValue = parseInt(maxSlider.value);
        }
        
        maxPriceLabel.textContent = formatCurrency(maxValue);
        updateRangeHighlight();
        filterProductsByPrice();
    });
    
    minPriceLabel.textContent = formatCurrency(minSlider.value);
    maxPriceLabel.textContent = formatCurrency(maxSlider.value);
    updateRangeHighlight();
    filterProductsByPrice();
});

// -------------- PAGE HANDLER --------------
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
        
        const pageLink = document.querySelector(`.pagination .page-link[data-page="${pageNumber}"]`);
        if (pageLink) {
            pageLink.parentElement.classList.add('active');
        }
        
        currentPage = pageNumber;
        
        if (prevButton) {
            prevButton.classList.toggle('disabled', currentPage === 1);
        }
        
        if (nextButton) {
            nextButton.classList.toggle('disabled', currentPage === totalPages);
        }
    }
    
    pageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageNumber = parseInt(this.getAttribute('data-page'));
            showPage(pageNumber);
        });
    });
    
    if (prevButton) {
        prevButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentPage > 1) {
                showPage(currentPage - 1);
            }
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentPage < totalPages) {
                showPage(currentPage + 1);
            }
        });
    }
    
    // -------------- SORTING FUNCTION --------------
    function sortProductsByPrice(direction) {
        const productPages = document.querySelectorAll('.product-grid');
        
        if (productPages.length === 0) {
            console.error('No product pages found');
            return;
        }
        
        let allProductCards = [];
        productPages.forEach(page => {
            const pageCards = Array.from(page.querySelectorAll('.col-12.col-sm-6.col-md-4.col-lg-3'));
            allProductCards = allProductCards.concat(pageCards);
        });
        
        if (allProductCards.length === 0) {
            console.error('No product cards found');
            return;
        }
        
        allProductCards.sort((a, b) => {
            const priceA = extractPrice(a);
            const priceB = extractPrice(b);
            
            return direction === 'asc' ? priceA - priceB : priceB - priceA;
        });
        
        // Redistribute sorted cards to pages (MAX 16 per page)
        const productsPerPage = 16;
        productPages.forEach((page, pageIndex) => {
            const pageContainer = page.querySelector('.row');
            if (pageContainer) {
                pageContainer.innerHTML = '';
                
                const startIndex = pageIndex * productsPerPage;
                const endIndex = Math.min(startIndex + productsPerPage, allProductCards.length);
                
                for (let i = startIndex; i < endIndex; i++) {
                    if (i < allProductCards.length) {
                        pageContainer.appendChild(allProductCards[i]);
                    }
                }
            }
        });
        
        showPage(1);
    }
    
    // Helper function to extract price from a product card
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
    
    const sortAscButton = document.getElementById('sort-price-asc');
    if (sortAscButton) {
        sortAscButton.addEventListener('click', function() {
            sortProductsByPrice('asc');
            highlightActiveButton(this);
        });
    } else {
        console.error('Price ascending button not found');
    }
    
    const sortDescButton = document.getElementById('sort-price-desc');
    if (sortDescButton) {
        sortDescButton.addEventListener('click', function() {
            sortProductsByPrice('desc');
            highlightActiveButton(this);
        });
    } else {
        console.error('Price descending button not found');
    }
    
    const style = document.createElement('style');
    style.textContent = `
        .sortbar .btn.active {
            backdrop-filter: blur(4px);
            background-color: rgba(255, 174, 174, 0.3);
            color: white;
        }
    `;
    document.head.appendChild(style);
    
    showPage(1);
});