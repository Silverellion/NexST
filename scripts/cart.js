$(document).ready(async function () {
    // Tải header
    await loadHeader();

    // Tải footer
    await loadFooter();

    // Tải giỏ hàng và hiển thị
    getCart();

    // Đăng ký các sự kiện
    handleCartEvents();
});

async function loadHeader() {
    try {
        const response = await fetch('../html/header2.html');
        const data = await response.text();
        $("#header-placeholder").html(data);

        $("#searchBox").on("keypress", function (e) {
        if (e.which === 13) {
            const keyword = $(this).val().trim();
            if (keyword !== "") {
                window.location.href = `/html/productpage.html?search=${encodeURIComponent(keyword)}`;
            }
        }
    });
    } catch (error) {
        console.error('Lỗi khi đọc header:', error);
    }
}
async function loadFooter() {
    try {
        const response = await fetch('../html/footer.html');
        const data = await response.text();
        $("#footer-placeholder").html(data);
    } catch (error) {
        console.error('Lỗi khi đọc footer:', error);
    }
}

async function getCart() {
    // Đọc giỏ hàng từ localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Tải dữ liệu sản phẩm từ file JSON
    const response = await fetch('../json/products.json');
    const products = await response.json();

    const cartContainer = $('#cart-container');
    cartContainer.empty();  // Xóa nội dung hiện tại của giỏ hàng

    let subTotal = 0;  // Khởi tạo tổng tiền trước thuế
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);

        if (product) {
            const productHTML = createProductHTML(product, item.quantity);  // Sử dụng số lượng từ cart
            cartContainer.append(productHTML);

            // Loại bỏ ký tự $ và chuyển price thành số
            let productPrice = parseFloat(product.price.replace('$', '').trim());

            if (isNaN(productPrice) || productPrice <= 0) {
                console.error('Invalid product price:', product);
            } else {
                // Cập nhật tổng tiền
                subTotal += productPrice * item.quantity;
            }
        }
    });

    // Cập nhật các thông số trong hóa đơn
    updateOrderSummary(subTotal);
}

function updateOrderSummary(subTotal) {
    if (isNaN(subTotal) || subTotal < 0) {
        console.error('Invalid Sub Total:', subTotal);
        subTotal = 0;
    }

    // Cập nhật Sub Total
    $('#subtotal').text(`$${subTotal.toFixed(2)}`);
    const shipping = 600;
    const tax = subTotal * 0.05;
    const total = subTotal + shipping + tax;

    $('#shipping').text(`$${shipping.toFixed(2)}`);
    $('#tax').text(`$${tax.toFixed(2)}`);
    $('#total').text(`$${total.toFixed(2)}`);
}

function createProductHTML(product, quantity) {
    return `
        <div class="products-cart row rounded-3 p-3" data-id="${product.id}">
            <div class="col-md-4 position-relative">
                <div class="product-image-wrapper h-100">
                    <img src="${product.img}" class="img-product-cart img-fluid h-100 w-100 object-fit-cover rounded-3" alt="${product.description}">
                    <span class="badge bg-danger text-white position-absolute start-0 m-2">SAVE <br> $${product.oldPrice}</span>
                </div>
            </div>
            <div class="col-md-6 p-3 d-flex flex-column justify-content-between">
                <div>
                    <p class="mb-1 fs-6 fw-bold">${product.title}</p>
                    <p class="text-danger fw-bold">$${product.price}</p>
                </div>
                <div>
                    <div class="d-flex align-items-center border-5 border-dark mb-2">
                        <button class="btn btn-sm btn-outline-secondary decrease-quantity" data-id="${product.id}">-</button>
                        <span class="mx-4 product-quantity">${quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary increase-quantity" data-id="${product.id}">+</button>
                    </div>
                    <p class="mb-0"><img src="../icons/cart/ticks.svg" alt=""> In stock</p>
                </div>
            </div>
            <div class="col-md-2 d-flex gap-1">
                <button class="btn-circle btn-circle-light text-dark mb-2 remove-item" data-id="${product.id}">-</button>
                <button class="btn-circle btn-circle-danger text-danger remove-item" data-id="${product.id}">x</button>
            </div>
        </div>
    `;
}

function handleCartEvents() {
    $(document).on('click', '.increase-quantity', function () {
        const productId = $(this).data('id');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const productIndex = cart.findIndex(item => item.id === productId);

        if (productIndex !== -1) {
            // Nếu sản phẩm đã có, tăng số lượng lên 1
            cart[productIndex].quantity += 1;
            localStorage.setItem('cart', JSON.stringify(cart));

            // Cập nhật trực tiếp số lượng trong DOM
            $(`[data-id="${productId}"] .product-quantity`).text(cart[productIndex].quantity);

            // Tính lại tổng tiền và cập nhật hóa đơn
            getCart();
        }
    });

    $(document).on('click', '.decrease-quantity', function () {
        const productId = $(this).data('id');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const productIndex = cart.findIndex(item => item.id === productId);

        if (productIndex !== -1 && cart[productIndex].quantity > 1) {
            // Nếu sản phẩm đã có và số lượng > 1, giảm số lượng xuống 1
            cart[productIndex].quantity -= 1;
            localStorage.setItem('cart', JSON.stringify(cart));

            // Cập nhật trực tiếp số lượng trong DOM
            $(`[data-id="${productId}"] .product-quantity`).text(cart[productIndex].quantity);

            // Tính lại tổng tiền và cập nhật hóa đơn
            getCart();
        }
    });

    $(document).on('click', '.remove-item', function () {
        const productId = $(this).data('id');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Lọc bỏ sản phẩm khỏi giỏ hàng
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));

        // Xóa sản phẩm khỏi DOM
        $(`[data-id="${productId}"]`).remove();

        // Tính lại tổng tiền và cập nhật hóa đơn
        getCart();
    });
}
