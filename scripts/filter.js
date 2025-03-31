//#region Sidebar Toggler
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

//#endregion Sidebar Toggler
//#region See More Toggler
function toggleMoreOptions(optionsId, clickedElement) {
    const moreOptions = document.getElementById(optionsId);
    moreOptions.classList.toggle('visible');
    
    if (moreOptions.classList.contains('visible')) {
        clickedElement.textContent = 'See less';
    } else {
        clickedElement.textContent = 'See more';
    }
}
//#endregion See More Toggler
document.addEventListener('DOMContentLoaded', function() {
    class ProductHandler {
        constructor() {
            this.pageLinks = document.querySelectorAll('.pagination .page-link[data-page]');
            this.prevButton = document.getElementById('prev-page');
            this.nextButton = document.getElementById('next-page');
            this.totalPages = this.pageLinks.length;
            this.currentPage = 1;
            this.minSlider = document.getElementById('minPrice');
            this.maxSlider = document.getElementById('maxPrice');
            this.minPriceLabel = document.getElementById('minPriceLabel');
            this.maxPriceLabel = document.getElementById('maxPriceLabel');
            this.rangeHighlight = document.querySelector('.range-highlight');
            this.sortAscButton = document.getElementById('sort-price-asc');
            this.sortDescButton = document.getElementById('sort-price-desc');
            this.maxValue = parseInt(this.maxSlider.max);
            this.init();
            this.addActiveButtonStyle();
        }

        init() {
            this.setupPagination();
            this.setupSorting();
            this.setupPriceSlider();
        }

        //#region Page Handler

        showPage(pageNumber) {
            document.querySelectorAll('.product-grid').forEach(page => page.classList.remove('active'));
            document.getElementById(`page-${pageNumber}`)?.classList.add('active');
            document.querySelectorAll('.pagination .page-item').forEach(item => item.classList.remove('active'));
            document.querySelector(`.pagination .page-link[data-page="${pageNumber}"]`)?.parentElement.classList.add('active');
            this.currentPage = pageNumber;
            this.prevButton?.classList.toggle('disabled', this.currentPage === 1);
            this.nextButton?.classList.toggle('disabled', this.currentPage === this.totalPages);
        }

        setupPagination() {
            this.pageLinks.forEach(link => {
                link.addEventListener('click', e => {
                    e.preventDefault();
                    this.showPage(parseInt(link.getAttribute('data-page')));
                });
            });

            this.prevButton?.addEventListener('click', e => {
                e.preventDefault();
                if (this.currentPage > 1) this.showPage(this.currentPage - 1);
            });

            this.nextButton?.addEventListener('click', e => {
                e.preventDefault();
                if (this.currentPage < this.totalPages) this.showPage(this.currentPage + 1);
            });

            this.showPage(1);
        }
        //#endregion Page Handler
        //#region Sorting Handler

        setupSorting() {
            this.sortAscButton?.addEventListener('click', () => {
                this.sortProductsByPrice('asc');
                this.highlightActiveButton(this.sortAscButton);
            });

            this.sortDescButton?.addEventListener('click', () => {
                this.sortProductsByPrice('desc');
                this.highlightActiveButton(this.sortDescButton);
            });
        }

        sortProductsByPrice(direction) {
            let allProductCards = [...document.querySelectorAll('.product-grid .col-12.col-sm-6.col-md-4.col-lg-3')];
            allProductCards.sort((a, b) => direction === 'asc' ? this.extractPrice(a) - this.extractPrice(b) : this.extractPrice(b) - this.extractPrice(a));
            document.querySelectorAll('.product-grid .row').forEach(container => {
                container.innerHTML = '';
                allProductCards.splice(0, 16).forEach(card => container.appendChild(card));
            });
            this.showPage(1);
        }

        highlightActiveButton(activeButton) {
            document.querySelectorAll('.sortbar .btn').forEach(button => button.classList.remove('active'));
            activeButton.classList.add('active');
        }
        //#endregion Sorting Handler
        //#region Price Slider Handler
        setupPriceSlider() {
            this.minSlider.value = 0;
            this.maxSlider.value = 10000;
            this.updatePriceLabels();
            this.updateRangeHighlight();
            this.filterProductsByPrice();
            
            this.minSlider.addEventListener('input', () => this.handleSliderInput('min'));
            this.maxSlider.addEventListener('input', () => this.handleSliderInput('max'));
            
            this.sliderContainer = this.minSlider.parentElement;
            
            let activeSlider = null;
            let activeType = null;
            
            this.sliderContainer.addEventListener('mousedown', (event) => {
                const rect = this.sliderContainer.getBoundingClientRect();
                const clickPosition = (event.clientX - rect.left) / rect.width * this.maxValue;
                
                const minDistance = Math.abs(clickPosition - this.minSlider.value);
                const maxDistance = Math.abs(clickPosition - this.maxSlider.value);
                
                activeSlider = minDistance <= maxDistance ? this.minSlider : this.maxSlider;
                activeType = minDistance <= maxDistance ? 'min' : 'max';
                
                let newValue = clickPosition;
                if (activeType === 'min') {
                    newValue = Math.min(newValue, this.maxSlider.value - 200);
                } else {
                    newValue = Math.max(newValue, parseInt(this.minSlider.value) + 200);
                }
                
                activeSlider.value = Math.round(newValue);
                this.handleSliderInput(activeType);
                
                
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
            });
            
            const handleMouseMove = (event) => {
                if (!activeSlider) return;
                
                const rect = this.sliderContainer.getBoundingClientRect();
                const position = (event.clientX - rect.left) / rect.width;
                
                const clampedPosition = Math.max(0, Math.min(1, position));
                let newValue = Math.round(clampedPosition * this.maxValue);
                
                if (activeType === 'min') {
                    newValue = Math.min(newValue, this.maxSlider.value - 200);
                } else {
                    newValue = Math.max(newValue, parseInt(this.minSlider.value) + 200);
                }
                
                activeSlider.value = newValue;
                this.handleSliderInput(activeType);
                
                event.preventDefault();
            };
            
            const handleMouseUp = () => {
                activeSlider = null;
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
        handleSliderInput(type) {
            //Min range of slider is 200, adjust this if you want the range to be different
            let minValue = parseInt(this.minSlider.value);
            let maxValue = parseInt(this.maxSlider.value);
            
            if (maxValue - minValue < 200) {
                if (type === 'min') {
                    minValue = maxValue - 200;
                    this.minSlider.value = minValue;
                } else {
                    maxValue = minValue + 200;
                    this.maxSlider.value = maxValue;
                }
            }
            
            this.updatePriceLabels();
            this.updateRangeHighlight();
            this.filterProductsByPrice();
        }

        updatePriceLabels() {
            this.minPriceLabel.textContent = this.formatCurrency(this.minSlider.value);
            this.maxPriceLabel.textContent = this.formatCurrency(this.maxSlider.value);
        }

        updateRangeHighlight() {
            this.rangeHighlight.style.left = `${(this.minSlider.value / this.maxValue) * 100}%`;
            this.rangeHighlight.style.right = `${100 - (this.maxSlider.value / this.maxValue) * 100}%`;
        }

        formatCurrency(value) {
            return `$${parseInt(value).toLocaleString()}`;
        }

        extractPrice(product) {
            return parseFloat(product.querySelector('.product-price')?.textContent.replace(/[$,]/g, '')) || 0; 
            //Removes the ',' and '$' in a string using regex to get the price number
            //Ex: $1,000 -> 1000 
        }

        filterProductsByPrice() {
            const minValue = parseInt(this.minSlider.value);
            const maxValue = parseInt(this.maxSlider.value);
            //Query that fetches from the .product-grid to get the price
            document.querySelectorAll('.product-grid .col-12.col-sm-6.col-md-4.col-lg-3').forEach(product => {
                const price = this.extractPrice(product);
                product.style.display = price >= minValue && price <= maxValue ? 'block' : 'none';
            });
        }

        //#endregion Price Slider Handler
        //#region Sorting Button Styling
        addActiveButtonStyle() {
            const style = document.createElement('style');
            style.textContent = `
                .sortbar .btn.active {
                    backdrop-filter: blur(4px);
                    background-color: rgba(255, 174, 174, 0.3);
                    color: white;
                }
            `;
            document.head.appendChild(style);
        }
        //end#region Sorting Button Styling
    }
    new ProductHandler();
});

//#region Dark Mode Handler
function toggleDarkMode() {
    let icon = document.getElementById("modeIcon");
    document.body.classList.toggle('dark-mode');
    if (icon.src.includes("dark-mode.svg")) {
        icon.src = "../icons/nav/light-mode.svg";
    } else {
        icon.src = "../icons/nav/dark-mode.svg"; 
    }
}
//#endregion Dark Mode Handler
//#region Extra Filter Options Handler
function toggleSection(sectionId) {
    const content = document.getElementById(sectionId);
    const title = content.previousElementSibling;
    
    content.classList.toggle('filter-expanded');
    title.classList.toggle('active');
}
//#endregion Extra Filter Options Handler