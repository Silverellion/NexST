let productData = [];
let filteredProducts = [];

let $slide, $nextBtn, $prevBtn;
let autoSlide; // Slide tự động

$(document).ready(function () {
    fetchProducts();
});

// Fetch toàn bộ sản phẩm từ file JSON
async function fetchProducts() {
    try {
        const response = await fetch("../json/products.json");
        const data = await response.json();
        productData = data;
        loadProductList();
        loadSlides();
        setupSlide();

        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get("category");
        const search = urlParams.get("search");

        if (search) {
            $("#searchBox").val(search);     // hiện lại từ khóa nếu muốn
            loadProducts(search);            // Gọi hàm lọc theo keyword
        } else if (category) {
            const filters = {};
            for (const [key, value] of urlParams.entries()) {
                if (key !== "category") {
                    filters[key] = value;
                }
            }
            loadByCategoryAndFilter(category, filters);
        }
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

// --- Slide quảng cáo ---

function nextSlide() {
    const $items = $(".quancao .item");
    if ($items.length > 1 && $slide.length) {
        $slide.append($items.first());
    }
}

function prevSlide() {
    const $items = $(".quancao .item");
    if ($items.length > 1 && $slide.length) {
        $slide.prepend($items.last());
    }
}

function resetAutoSlide() {
    clearInterval(autoSlide);
    autoSlide = setInterval(() => nextSlide(), 3000);
}

function setupSlide() {
    $slide = $("#slide");
    $nextBtn = $("#next");
    $prevBtn = $("#prev");

    if ($nextBtn.length && $prevBtn.length && $slide.length) {
        $nextBtn.click(function () {
            nextSlide();
            resetAutoSlide();
        });

        $prevBtn.click(function () {
            prevSlide();
            resetAutoSlide();
        });

        autoSlide = setInterval(() => nextSlide(), 3000); // Auto chạy slide mỗi 3 giây
    }
}

// --- Load sản phẩm ở Home ---

function loadProductList() {
    const $productList = $("#product-list");
    const $productFind = $(".product-find");

    $productFind.empty();
    if (!$productList.length) return;

    const productsToShow = productData.slice(0, 10);
    renderProducts(productsToShow, $productList);
}

// --- Load slide quảng cáo ---

function loadSlides() {
    const $slideArea = $("#slide");
    if (!$slideArea.length) return;
    $slideArea.empty();

    productData.slice(0, 5).forEach(product => {
        const $itemDiv = $("<div>").addClass("item bg-center d-inline-block position-absolute z-1 rounded-4 shadow-lg bg-light")
            .css("background-image", `url(${product.img})`)
            .html(`
                <div class="content text-left position-absolute">
                    <div class="name fw-bold">${product.description}</div>
                    <span class="des text-price fw-bold pe-2">${product.price}</span>
                    <span class="des text-muted text-decoration-line-through">${product.oldPrice}</span>
                </div>`);
        $slideArea.append($itemDiv);
    });
}

// --- Render sản phẩm ra Container ---

function renderProducts(products, $container) {
    if (!$container || !$container.length) return;

    $container.empty();
    const $row = $("<div>").addClass("row five-cols");

    if (products.length > 0) {
        products.forEach(product => {
            console.log(product);
            const $productItem = $("<div>").addClass("col-12 col-sm-6 col-md-4 col-lg-3 g-3").html(`
                <div class="card p-0 h-100 d-flex flex-column" data-id="${product.id}">
                    <div class="card-body m-0">
                        <img src="${product.img}" alt="${product.description}" class="w-100 mb-3">
                        <p class="card-text description">${product.description}</p>
                        <p class="card-text">
                            <span class="product-price fw-bold pe-2 text-danger">${product.price}</span>
                            <span class="text-muted text-decoration-line-through">${product.oldPrice}</span>
                        </p>
                        <button class="btn btn-shopping d-flex align-items-center w-100 position-relative add-to-cart-btn" data-id="${product.id}">
                            <span class="mx-auto">Add To Basket</span>
                            <img src="../icons/transactional/shopping-cart.svg" alt="" class="position-absolute end-0">
                        </button>
                    </div>
                </div>`);
            $row.append($productItem);
        });
    } else {
        $row.html(`<p class="text-center w-100 text-white">Không tìm thấy sản phẩm phù hợp.</p>`);
    }

    $container.append($row);

    $container.find(".card").click(function (e) {
        if ($(e.target).closest(".add-to-cart-btn").length === 0) {
            const id = $(this).data("id");
            localStorage.setItem("productDetail", id);
            console.log("ID sản phẩm vừa bấm:", id);
            window.location.href = `product-detail.html`;
        }
    });

}

// --- Tìm kiếm sản phẩm theo keyword ---

function loadProducts(keyword = "") {
    const $productFind = $(".product-find");
    const $productList = $("#product-list");

    if (!$productFind.length) return;

    $productFind.empty();
    $productList.empty();

    const keywordLower = keyword.trim().toLowerCase();
    const minPrice = $("#minPrice").val() || 0;
    const maxPrice = $("#maxPrice").val() || Infinity;

    filteredProducts = productData.filter(product => {
        const isMatchingKeyword =
            (product.description && product.description.toLowerCase().includes(keywordLower)) ||
            (product.price && product.price.toLowerCase().includes(keywordLower)) ||
            (product.id && product.id.toLowerCase().includes(keywordLower)) ||
            (product.title && product.title.toLowerCase().includes(keywordLower)) ||
            (product.cpu && product.cpu.toLowerCase().includes(keywordLower)) ||
            (product.gpu && product.gpu.toLowerCase().includes(keywordLower)) ||
            (product.ram && product.ram.toLowerCase().includes(keywordLower)) ||
            (product.ssd && product.ssd.toLowerCase().includes(keywordLower)) ||
            (product.screen && product.screen.toLowerCase().includes(keywordLower)) ||
            (product.category && product.category.toLowerCase().includes(keywordLower)) ||
            (product.categoryDetail && product.categoryDetail.toLowerCase().includes(keywordLower));
        const productPrice = parseFloat(product.price.replace('$', '').replace(',', '').trim());
        const min = parseFloat(minPrice);
        const max = parseFloat(maxPrice);

        const isMatchingPrice = productPrice >= min && productPrice <= max;

        return isMatchingKeyword && isMatchingPrice;
    });

    showFilterByKeyword(keywordLower);
    renderProducts(filteredProducts, $productFind);
}

// --- Hiện filter theo keyword tìm kiếm ---

function showFilterByKeyword(keyword) {
    const $sidebar = $("#filter-content");
    $sidebar.children("div").hide();

    keyword = keyword.toLowerCase();
    let $filterDiv = null;

    if (keyword.includes("laptop") || keyword.includes("gaming") || keyword.includes("office") || keyword.includes("ai") || keyword.includes("graphic")) {
        $filterDiv = $("#filter-laptop");
    } else if (keyword.includes("pc") || keyword.includes("desktop")) {
        $filterDiv = $("#filter-pc");
    } else if (keyword.includes("monitor") || keyword.includes("screen") || keyword.includes("display")) {
        $filterDiv = $("#filter-monitor");
    } else if (keyword.includes("gear") || keyword.includes("mouse") || keyword.includes("keyboard")) {
        $filterDiv = $("#filter-gear");
    } else if (keyword.includes("accessory") || keyword.includes("usb") || keyword.includes("headphone") || keyword.includes("webcam")) {
        $filterDiv = $("#filter-accessories");
    } else if (keyword.includes("cpu") || keyword.includes("gpu") || keyword.includes("ram") || keyword.includes("ssd") || keyword.includes("mainboard")) {
        $filterDiv = $("#filter-component");
    } else if (keyword.includes("audio") || keyword.includes("speaker") || keyword.includes("earbuds") || keyword.includes("headset")) {
        $filterDiv = $("#filter-audio");
    } else {
        $filterDiv = $("#filter-laptop"); // mặc định laptop
    }

    if ($filterDiv && $filterDiv.length > 0) {
        $filterDiv.show();
        $("#filter-price").show();
        console.log("Bộ lọc giá được tải");
    }
}

// load sản phẩm theo danh mục(code chạy là vui, không fix đâu.)
function loadByCategoryAndFilter(category, filters = {}) {
    const $productFind = $(".product-find");
    if (!$productFind.length) return;

    $productFind.empty();

    const categoryLower = category.toLowerCase();

    let filtered = productData.filter(product =>
        product.category && product.category.toLowerCase() === categoryLower
    );

    // Áp dụng các filter truyền vào
    for (const [key, value] of Object.entries(filters)) {
        const valLower = value.toLowerCase();

        filtered = filtered.filter(product =>
            Object.values(product).some(field =>
                typeof field === "string" && field.toLowerCase().includes(valLower)
            )
        );
    }

    renderProducts(filtered, $productFind);
}


