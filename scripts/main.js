// --- Hàm load HTML vào placeholder ---
async function loadHTML(elementId, filePath, callback) {
    const $element = $(`#${elementId}`);
    if (!$element.length) return;

    // Nếu đã có 1 child rồi thì bỏ qua (header, footer chỉ load 1 lần)
    if ($element.children().length > 0) {
        return;
    }

    try {
        const response = await fetch(filePath);
        let htmlText = await response.text();

        // Bỏ các <script> nếu có trong file load về
        htmlText = htmlText.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');

        $element.html(htmlText);
        if (callback) callback();
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
    }
}

// --- Hàm filter sản phẩm theo checkbox (giữ đơn giản trước) ---
function filterByCheckbox(productList) {
    let finalProducts = [...productList];

    const selectedCPUs = new Set($("#cpuSeriesFilter .modified-checbox:checked").map(function () {
        return $(this).val()?.toLowerCase();
    }).get());

    if (selectedCPUs.size > 0) {
        finalProducts = finalProducts.filter(product => {
            const cpu = product.cpu?.toLowerCase() || "";
            return [...selectedCPUs].some(cpuFilter => cpu.includes(cpuFilter));
        });
    }

    const selectedGPUs = new Set($("#graphicsFilter .modified-checbox:checked").map(function () {
        return $(this).val()?.toLowerCase();
    }).get());

    if (selectedGPUs.size > 0) {
        finalProducts = finalProducts.filter(product => {
            const gpu = product.gpu?.toLowerCase() || "";
            return [...selectedGPUs].some(gpuFilter => gpu.includes(gpuFilter));
        });
    }

    return finalProducts;
}

function highlightCurrentLink() {
    const navLinks = $("#header1-placeholder .navbar-nav a");
    const currentPath = window.location.pathname.split('/').pop();

    navLinks.each(function () {
        const linkPath = $(this).attr('href')?.split('/').pop();

        if (linkPath && linkPath !== '#' && linkPath === currentPath) {
            $(this).addClass('active');
        }
    });
}

// Hàm load Login Modal
function setupLoginModal() {
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    if (currentUser && currentUser.name) {
        // Người dùng đã đăng nhập, cập nhật nút đăng nhập
        checkUserLoginStatus();
    } else {
        // Đảm bảo Modal_Login_Register.js được tải
        $.getScript("../scripts/Modal_Login_Register.js", function () {
            // Xử lý sự kiện đóng modal để reset nó
            $(document).on('hidden.bs.modal', '#modalContainer', function () {
                // Reset form trong modal nếu có
                if ($(this).find('form').length) {
                    $(this).find('form')[0].reset();
                }
                // Xóa các class có thể gây xung đột khi mở lại
                $(this).removeClass('modal-open');
                $('.modal-backdrop').remove();
                $('body').removeClass('modal-open').css('padding-right', '');
            });

            // Sự kiện click cho các nút đăng nhập
            $(document).on('click', '.toggle-form', function () {
                // Định nghĩa $container mỗi lần sự kiện được kích hoạt
                const $container = $('.auth-container');

                if ($(this).attr('id') === 'show-register') {
                    $container.addClass('active');
                    console.log("Chuyển sang form đăng ký");
                } else if ($(this).attr('id') === 'show-login') {
                    $container.removeClass('active');
                    console.log("Chuyển sang form đăng nhập");
                }
            });
            // Thêm style cho nút đăng nhập
            $("<style>")
                .prop("type", "text/css")
                .html(`
                .btn-auth {
                    border-radius: 8px !important;
                    padding: 10px !important;
                    background-color: #B30100 !important;  /* Sử dụng màu giống file CSS gốc */
                    color: white !important;
                    border: none !important;
                    transition: background-color 0.3s !important;
                }
                .btn-auth:hover {
                    background-color: #870100 !important;
                }
            `)
                .appendTo("head");
        });
    }
}

// Hàm kiểm tra trạng thái đăng nhập của người dùng và cập nhật nút Login
function checkUserLoginStatus() {
    try {
        const currentUser = JSON.parse(localStorage.getItem('current_user'));
        if (currentUser && currentUser.name) {
            // Cập nhật nút đăng nhập bằng tên người dùng
            const $loginButton = $('#loginButton');
            if ($loginButton.length) {
                $loginButton.html(`
                    <img src="../icons/nav/user.svg" alt="" class="me-1">
                    <span class="d-none d-sm-inline">${currentUser.name}</span>
                `);

                // Thay đổi hành vi nút khi đã đăng nhập
                $loginButton.off('click').on('click', function (e) {
                    e.preventDefault();
                    // Hiển thị dropdown hoặc modal với tùy chọn đăng xuất
                    window.location.href = '../html/Profile.html';
                });
            }
        }
    } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái đăng nhập:", error);
    }
}

// --- Khi document ready ---
$(document).ready(async function () {
    // 1. Load HTML thành phần
    await loadHTML("header1-placeholder", "../html/header1.html", function () {
        highlightCurrentLink();
        // Kiểm tra trạng thái đăng nhập sau khi header được tải
        checkUserLoginStatus();
    });
    await loadHTML("header2-placeholder", "../html/header2.html", function () {
        $("#searchBox").on("keypress", function (e) {
            if (e.which === 13) {
                const keyword = $(this).val().trim();
                if (keyword !== "") {
                    window.location.href = `/html/productpage.html?search=${encodeURIComponent(keyword)}`;
                }
            }
        });
    });
    await loadHTML("footer-placeholder", "../html/footer.html");
    await loadHTML("filter-content", "../html/filter.html");

    // Cài đặt modal đăng nhập sau khi header đã được load
    setupLoginModal();

    // 3. Bắt sự kiện filter checkbox
    $(document).on("change", ".modified-checbox", function () {
        const finalProducts = filterByCheckbox(productData);
        renderProducts(finalProducts, $(".product-find"));
    });

    rebindAddToCartEvent();
});

// --- Hàm gán sự kiện Add To Cart ---
function rebindAddToCartEvent() {
    $(document).off("click", ".add-to-cart-btn").on("click", ".add-to-cart-btn", function (event) {
        console.log("Click Add To Cart");
        event.stopPropagation();
        event.preventDefault();

        const productId = $(this).data("id");
        const product = productData.find(p => p.id === productId);

        if (!product) {
            console.error(" Không tìm thấy sản phẩm với id:", productId);
            return;
        }

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let existingIndex = cart.findIndex(item => item.id === product.id);

        if (existingIndex !== -1) {
            cart[existingIndex].quantity += 1;
            console.log(`Update: ID = ${cart[existingIndex].id}, Quantity = ${cart[existingIndex].quantity}, Index = ${existingIndex}`);
        } else {
            const newProduct = { ...product, quantity: 1 };
            cart.push(newProduct);
            console.log(`New: ID = ${newProduct.id}, Quantity = 1, Index = ${cart.length - 1}`);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert(" Đã thêm sản phẩm vào giỏ hàng!");
    });
}
