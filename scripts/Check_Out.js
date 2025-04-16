$(document).ready(function () {
    // Regex patterns
    const patterns = {
        name: /^[a-zA-ZÀ-ỹ\s]{2,50}$/,  // Tên có từ 2-50 ký tự, bao gồm chữ cái và khoảng trắng, hỗ trợ tiếng Việt
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,  // Email format
        phone: /^(0|\+84)([0-9]{9,10})$/,  // Số điện thoại Việt Nam (0xxxxxxxxx hoặc +84xxxxxxxxx)
        zipcode: /^\d{5,6}$/,  // Mã bưu điện từ 5-6 chữ số
        address: /^[a-zA-Z0-9À-ỹ\s,.'-]{5,150}$/  // Địa chỉ từ 5-150 ký tự
    };

    // Hàm kiểm tra
    function validateField(field, regex) {
        const value = field.val().trim();
        if (regex.test(value)) {
            field.removeClass('is-invalid').addClass('is-valid');
            return true;
        } else {
            field.removeClass('is-valid').addClass('is-invalid');
            return false;
        }
    }

    // Định nghĩa các message lỗi tương ứng
    const errorMessages = {
        firstName: 'Tên phải có từ 2-50 ký tự và chỉ chứa chữ cái',
        lastName: 'Họ phải có từ 2-50 ký tự và chỉ chứa chữ cái',
        email: 'Vui lòng nhập đúng định dạng email',
        phone: 'Số điện thoại phải bắt đầu bằng 0 hoặc +84 và có 9-10 số',
        zipCode: 'Mã bưu điện phải có 5-6 chữ số',
        address: 'Địa chỉ phải có từ 5-150 ký tự'
    };

    // Add validation feedback elements
    function addFeedbackElements() {
        $('input[type="text"], input[type="email"]').each(function () {
            const id = $(this).attr('id');
            if (!id) return;

            // Xóa feedback cũ nếu có
            $(this).next('.invalid-feedback').remove();

            // Thêm feedback message mới
            const message = errorMessages[id] || 'Vui lòng nhập đúng định dạng.';
            $(this).after('<div class="invalid-feedback">' + message + '</div>');
        });
    }

    // Khởi tạo form
    function initializeForm() {
        // Thêm id và required attribute vào các field
        $('input.form-control').eq(0).attr({ id: 'firstName', required: true });
        $('input.form-control').eq(1).attr({ id: 'lastName', required: true });
        $('input.form-control').eq(6).attr({ id: 'phone', required: true });
        $('input.form-control').eq(7).attr({ id: 'email', required: true, type: 'email' });
        $('input.form-control').eq(5).attr({ id: 'zipCode', required: true });
        $('input.form-control').eq(3).attr({ id: 'address', required: true });

        // Thêm feedback elements
        addFeedbackElements();

        // Đăng ký các sự kiện input
        registerInputEvents();
    }

    // Đăng ký sự kiện input cho các trường
    function registerInputEvents() {
        $('#firstName').on('input', function () {
            validateField($(this), patterns.name);
        });

        $('#lastName').on('input', function () {
            validateField($(this), patterns.name);
        });

        $('#phone').on('input', function () {
            validateField($(this), patterns.phone);
        });

        $('#email').on('input', function () {
            validateField($(this), patterns.email);
        });

        $('#zipCode').on('input', function () {
            validateField($(this), patterns.zipcode);
        });

        $('#address').on('input', function () {
            validateField($(this), patterns.address);
        });
    }

    // Xử lý khi submit form
    function handleFormSubmit() {
        $('form').on('submit', function (e) {
            let isValid = true;

            // Validate required fields
            $('input[required]').each(function () {
                const field = $(this);
                const fieldType = field.attr('type');
                const id = field.attr('id');

                if (!field.val().trim()) {
                    field.removeClass('is-valid').addClass('is-invalid');
                    isValid = false;
                    return;
                }

                if (fieldType === 'text' || fieldType === 'email') {
                    switch (id) {
                        case 'firstName':
                        case 'lastName':
                            if (!validateField(field, patterns.name)) isValid = false;
                            break;
                        case 'email':
                            if (!validateField(field, patterns.email)) isValid = false;
                            break;
                        case 'phone':
                            if (!validateField(field, patterns.phone)) isValid = false;
                            break;
                        case 'zipCode':
                            if (!validateField(field, patterns.zipcode)) isValid = false;
                            break;
                        case 'address':
                            if (!validateField(field, patterns.address)) isValid = false;
                            break;
                    }
                }
            });

            if (!isValid) {
                e.preventDefault();

                // Hiển thị thông báo lỗi
                $('#validationErrorAlert').remove();
                $('form').prepend(
                    '<div id="validationErrorAlert" class="alert alert-danger" role="alert">' +
                    'Vui lòng điền đầy đủ và chính xác thông tin trước khi đặt hàng.' +
                    '</div>'
                );

                // Scroll đến vị trí đầu form
                $('html, body').animate({
                    scrollTop: $('form').offset().top - 100
                }, 200);
            }
        });
    }

    // Hàm để lấy dữ liệu giỏ hàng và hiển thị lên trang thanh toán
    function loadCartDataToCheckout() {
        // Kiểm tra xem có phải là chế độ Buy Now không
        const isBuyNow = localStorage.getItem('isBuyNow') === 'true';

        // Lấy giỏ hàng phù hợp (Buy Now hoặc giỏ hàng thông thường)
        let cart;
        if (isBuyNow) {
            cart = JSON.parse(localStorage.getItem('buyNowCart')) || [];
        } else {
            cart = JSON.parse(localStorage.getItem('cart')) || [];
        }

        // Giỏ hàng trống thì trả về trang giỏ hàng
        if (cart.length === 0) {
            alert('Giỏ hàng trống!');
            window.location.href = '../html/cart.html';
            return;
        }

        // Hàm để tải dữ liệu sản phẩm từ file JSON và hiển thị lên trang thanh toán
        $.getJSON('../json/products.json', function (products) {
            const orderList = $('.reverse-order-list');
            orderList.empty(); // Clear existing items

            let subTotal = 0;

            // Thêm từng sản phẩm vào danh sách đơn hàng
            cart.forEach(item => {
                const product = products.find(p => p.id === item.id);

                if (product) {
                    // Tính giá sản phẩm
                    let productPrice = parseFloat(product.price.replace('$', '').trim());
                    let itemTotal = productPrice * item.quantity;
                    subTotal += itemTotal;

                    // Tạo HTML cho sản phẩm
                    const productHTML = `
                    <div class="product-item d-flex align-items-center">
                        <img src="${product.img}" alt="${product.title}">
                        <div>
                            <div>${product.title}</div>
                            <small>x${item.quantity}</small>
                        </div>
                        <div class="ms-auto text-danger">$${itemTotal.toFixed(2)}</div>
                    </div>
                `;

                    orderList.append(productHTML);
                }
            });

            // Tính toán tổng tiền
            const shipping = 600;
            const tax = subTotal * 0.05;
            const total = subTotal + shipping + tax;

            // Cập nhật các thông số trong hóa đơn
            $('#checkout-subtotal').text(`$${subTotal.toFixed(2)}`);
            $('#checkout-tax').text(`$${tax.toFixed(2)}`);
            $('h5.text-end.text-danger').text(`Order Total: $${total.toFixed(2)}`);

            window.orderTotal = total;
        }).fail(function () {
            console.error('Failed to load products data');
        });
    }

    // Hàm để khởi tạo thông tin đơn hàng
    function initOrderSummary() {
        // Thêm các phần tử vào trang thanh toán
        const orderSummarySection = $('.order-summary');

        // Thêm các phần tử vào phần tóm tắt đơn hàng
        $('h5.text-end.text-danger').before(`
            <div class="d-flex justify-content-between mt-3 mb-2">
                <span>Sub Total:</span>
                <span id="checkout-subtotal">$0.00</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
                <span>Shipping Estimate:</span>
                <span id="checkout-shipping">$600.00</span>
            </div>
            <div class="d-flex justify-content-between mb-3">
                <span>Tax Estimate:</span>
                <span id="checkout-tax">$0.00</span>
            </div>
            <hr>
        `);
        loadCartDataToCheckout();
    }

    // Hàm để xử lý nút "Place Order"
    function setupPlaceOrderButton() {
        $('#place-order').on('click', function (e) {
            e.preventDefault();

            // Kiểm tra nếu form chưa tồn tại
            if ($('.form-section').parent('form').length === 0) {
                $('.form-section').wrap('<form id="billing-form"></form>');
            }

            // Lấy tất cả các trường bắt buộc
            const requiredFields = [
                { elem: $('#firstName'), pattern: patterns.name }, // firstName
                { elem: $('#lastName'), pattern: patterns.name }, // lastName
                { elem: $('#phone'), pattern: patterns.phone }, // phone
                { elem: $('#email'), pattern: patterns.email }, // email
                { elem: $('#zipCode'), pattern: patterns.zipcode }, // zipCode
                { elem: $('#address'), pattern: patterns.address } // address
            ];

            let isValid = true;

            // Kiểm tra tất cả các trường bắt buộc
            requiredFields.forEach(field => {
                // Kiểm tra nếu trường rỗng
                if (!field.elem.val() || !field.elem.val().trim()) {
                    field.elem.removeClass('is-valid').addClass('is-invalid');
                    isValid = false;
                    return;
                }

                // Kiểm tra nếu trường khớp với pattern
                if (!validateField(field.elem, field.pattern)) {
                    isValid = false;
                }
            });

            // Hiển thị thông báo phù hợp dựa trên kết quả kiểm tra
            if (!isValid) {
                alert("Sai thông tin");

                // Xóa thông báo lỗi cũ và thêm thông báo mới
                $('#validationErrorAlert').remove();
                $('.form-section').prepend(
                    '<div id="validationErrorAlert" class="alert alert-danger" role="alert">' +
                    'Vui lòng điền đầy đủ và chính xác thông tin trước khi đặt hàng.' +
                    '</div>'
                );

                // Cuộn lên đầu form
                $('html, body').animate({
                    scrollTop: $('.form-section').offset().top - 100
                }, 200);
            } else {
                // Tất cả đầu vào hợp lệ - đặt hàng thành công
                alert("Đặt hàng thành công");

                // Kiểm tra xem có phải từ Buy Now không
                const isBuyNow = localStorage.getItem('isBuyNow') === 'true';

                // Lấy giỏ hàng phù hợp
                let cart;
                if (isBuyNow) {
                    cart = JSON.parse(localStorage.getItem('buyNowCart')) || [];
                } else {
                    cart = JSON.parse(localStorage.getItem('cart')) || [];
                }

                // Tạo thông tin đơn hàng mới
                const newOrder = {
                    id: 'ORD' + Date.now(),
                    date: new Date().toLocaleString(),
                    status: 'In Progress',
                    items: cart,
                    total: window.orderTotal || 0
                };

                // Lấy danh sách đơn hàng hiện tại và thêm đơn hàng mới
                const orders = JSON.parse(localStorage.getItem('orders')) || [];
                orders.push(newOrder);
                localStorage.setItem('orders', JSON.stringify(orders));

                // Cập nhật thống kê đơn hàng
                updateOrderStats();

                // Xóa giỏ hàng và thông tin Buy Now
                localStorage.setItem('cart', JSON.stringify([]));
                localStorage.removeItem('buyNowCart');
                localStorage.removeItem('isBuyNow');

                // Chuyển hướng đến trang chủ
                setTimeout(function () {
                    window.location.href = '../html/Profile.html';
                }, 1000);
            }
        });
    }

    // Hàm cập nhật số lượng đơn hàng trong profile
    function updateOrderStats() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        // Đếm số đơn hàng theo trạng thái
        const totalOrders = orders.length;
        // Lưu thống kê vào localStorage để Profile.js có thể đọc
        const orderStats = {
            total: totalOrders,
            lastUpdated: Date.now()
        };

        localStorage.setItem('orderStats', JSON.stringify(orderStats));
    }
    // Hàm khởi tạo
    function init() {
        initializeForm();
        initOrderSummary();
        handleFormSubmit();
        setupPlaceOrderButton();
    }
    init();
});