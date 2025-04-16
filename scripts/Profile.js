$(document).ready(function () {
    // Load thông tin người dùng từ localStorage khi trang được tải
    loadUserInformation();
    // Load số liệu thống kê đơn hàng
    loadOrderStats();
    // Load sản phẩm recomment
    loadBrowsingHistory();
    // Hàm thêm style cho nút Save
    function addSaveButtonStyles() {
        $("<style>")
            .prop("type", "text/css")
            .html(`
                .btn-save {
                    background-color: #a00 !important;
                    color: white !important;
                    max-width: 150px !important;
                    border-radius: 10px !important;
                    padding: 10px !important;
                    padding-left: 20px !important;
                    padding-right: 20px !important;
                    border: none !important;
                    transition: background-color 0.3s !important;
                }
                .btn-save:hover {
                    background-color: #870100 !important;
                }
            `)
            .appendTo("head");
    }

    // Hàm tải và hiển thị thông tin người dùng từ localStorage
    function loadUserInformation() {
        try {
            const currentUser = JSON.parse(localStorage.getItem('current_user'));
            if (currentUser) {
                // Cập nhật lời chào
                $('.dashboard-container h3').text(`Hello, ${currentUser.name || 'User'}`);

                // Cập nhật thông tin tài khoản trong Account Info Box
                if ($('.user-details div:nth-child(2) div:first-child').length) {
                    $('.user-details div:nth-child(2) div:first-child').text(currentUser.name || 'User');

                    // Cập nhật địa chỉ ngắn gọn (nếu có)
                    if (currentUser.address) {
                        $('.user-details div:nth-child(2) div:nth-child(2)').text(
                            `${currentUser.address.city || ''} - ${currentUser.address.country || ''}`
                        );
                    }
                }

                // Cập nhật email và số điện thoại trong Account Info
                $('div.info-box:first .mb-2:contains("Email:")').html(`<strong>Email:</strong> ${currentUser.email || ''}`);
                $('div.info-box:first .mb-2:contains("Phone:")').html(`<strong>Phone:</strong> ${currentUser.phone || ''}`);
                $('div.info-box:first .mb-3:contains("Address:")').html(`<strong>Address:</strong> ${currentUser.address ?
                    `${currentUser.address.street || ''}, ${currentUser.address.city || ''}, ${currentUser.address.country || ''}` :
                    'No Address'
                    }`);

                // Cập nhật thông tin địa chỉ thanh toán trong Billing Address
                const billingBox = $('.info-box:contains("BILLING ADDRESS")');
                if (billingBox.length) {
                    billingBox.find('div.mb-2:first').text(currentUser.name || '');

                    if (currentUser.address) {
                        // Địa chỉ đường phố
                        billingBox.find('div.mb-2:eq(1)').text(currentUser.address.street || '');
                        // Thành phố/Quốc gia
                        billingBox.find('div.mb-2:eq(2)').text(
                            `${currentUser.address.city || ''}, ${currentUser.address.country || ''}`
                        );
                    }

                    // Số điện thoại và email
                    billingBox.find('div.mb-2:contains("Phone")').html(`<strong>Phone Number:</strong> ${currentUser.phone || ''}`);
                    billingBox.find('div.mb-3:contains("Email")').html(`<strong>Email:</strong> ${currentUser.email || ''}`);
                }
            }
        } catch (error) {
            console.error("Lỗi khi tải thông tin người dùng:", error);
        }
    }

    // Thêm xử lý sự kiện đăng xuất khi nhấn vào nút Logout trong sidebar
    $('#logout').on('click', function () {
        if (confirm('Bạn muốn đăng xuất?')) {
            // Xóa thông tin người dùng
            localStorage.removeItem('current_user');

            // Xóa giỏ hàng khi đăng xuất
            localStorage.removeItem('cart');

            // Xóa giỏ hàng tạm thời nếu có (từ tính năng Buy Now)
            localStorage.removeItem('buyNowCart');
            localStorage.removeItem('isBuyNow');

            // Thông báo đăng xuất thành công
            alert('Đăng xuất thành công!');

            // Chuyển về trang chủ sau khi đăng xuất
            window.location.href = '../html/homepage.html';
        }
    });

    // Xử lý sự kiện click nút EDIT ACCOUNT
    $('#editaccount-btn').on('click', function () {
        // Tải nội dung modal từ file Modal_Edit_Profile.html
        $('#modalContainer').load('Modal_Edit_Profile.html', function () {
            // Sau khi tải xong, hiển thị modal
            const profileModal = new bootstrap.Modal(document.getElementById('profileModal'));
            profileModal.show();

            // Ẩn nút "Open Profile Modal" mặc định
            $('[data-bs-target="#profileModal"]').hide();

            // Thêm style cho nút Save
            addSaveButtonStyles();

            // Điền dữ liệu hiện tại vào form
            fillCurrentAccountData();

            // Ghi đè sự kiện click cho nút Save
            $(document).off('click', '#saveBtn').on('click', '#saveBtn', function () {
                saveAccountChanges();
                profileModal.hide();
            });

            // Xử lý sự kiện chọn avatar
            setupAvatarHandlers();
        });
    });

    // Xử lý sự kiện click nút EDIT ADDRESS
    $('#editaddress-btn').on('click', function () {
        // Tải nội dung modal từ file Address_Info.html
        $('#modalContainer').load('Address_Info.html', function () {
            // Sau khi tải xong, hiển thị modal
            const profileModal = new bootstrap.Modal(document.getElementById('profileModal'));
            profileModal.show();

            // Ẩn nút "Open Profile Modal" mặc định
            $('[data-bs-target="#profileModal"]').hide();

            // Thêm style cho nút Save
            addSaveButtonStyles();

            // Điền dữ liệu hiện tại vào form
            fillCurrentAddressData();

            // Ghi đè sự kiện click cho nút Save
            $(document).off('click', '#saveBtn').on('click', '#saveBtn', function () {
                saveAddressChanges();
                profileModal.hide();
            });

            // Xử lý sự kiện chọn avatar
            setupAvatarHandlers();
        });
    });

    // Hàm thiết lập xử lý sự kiện chọn avatar
    function setupAvatarHandlers() {
        // Hiển thị nút Change khi hover vào avatar
        $('.profile-img').hover(
            function () {
                $('#changeAvtBtn').show();
            },
            function () {
                $('#changeAvtBtn').hide();
            }
        );

        // Mở modal chọn avatar
        $('#changeAvtBtn').click(function () {
            $('#Choose_Avt').modal('show');
        });

        // Xử lý chọn avatar
        $('.avt-option').click(function () {
            const newSrc = $(this).attr('src');
            $('.profile-img').attr('src', newSrc);
            $('#Choose_Avt').modal('hide');

            // Lưu đường dẫn avatar vào localStorage
            saveAvatarPath(newSrc);
        });
    }

    // Lưu đường dẫn avatar
    function saveAvatarPath(avatarPath) {
        try {
            const currentUser = JSON.parse(localStorage.getItem('current_user')) || {};
            currentUser.avatar = avatarPath;
            localStorage.setItem('current_user', JSON.stringify(currentUser));
        } catch (error) {
            console.error("Lỗi khi lưu avatar:", error);
        }
    }

    // Hàm điền dữ liệu tài khoản vào form Modal_Edit_Profile.html
    function fillCurrentAccountData() {
        try {
            const currentUser = JSON.parse(localStorage.getItem('current_user')) || {};

            // Phân tách họ và tên
            let firstName = '', lastName = '';
            if (currentUser.name) {
                const nameParts = currentUser.name.split(' ');
                firstName = nameParts[0] || '';
                lastName = nameParts.slice(1).join(' ') || '';
            }

            // Điền dữ liệu vào form
            $('#firstName').val(firstName);
            $('#lastName').val(lastName);
            $('#email').val(currentUser.email || '');
            $('#phoneaccount').val(currentUser.phone || '');

            // Cập nhật avatar nếu có
            if (currentUser.avatar) {
                $('.profile-img').attr('src', currentUser.avatar);
            }

            // Cập nhật profile card trong modal
            $('#profileName').text(currentUser.name || '');
            $('#profileEmail').text(currentUser.email || '');

            // Lắng nghe sự kiện khi người dùng nhập liệu để cập nhật profile card
            $('#firstName, #lastName, #email').on('input', function () {
                updateAccountProfileCard();
            });
        } catch (error) {
            console.error("Lỗi khi điền dữ liệu tài khoản:", error);
        }
    }

    // Cập nhật profile card trong modal account
    function updateAccountProfileCard() {
        const firstName = $('#firstName').val() || '';
        const lastName = $('#lastName').val() || '';
        const email = $('#email').val() || '';

        if (firstName || lastName) {
            $('#profileName').text((firstName + ' ' + lastName).trim());
        }

        if (email) {
            $('#profileEmail').text(email);
        }
    }

    let updateInProgress = false;

    // Lưu thay đổi từ modal tài khoản
    function saveAccountChanges() {
        try {
            // Ngăn chặn nhiều thông báo liên tiếp
            if (updateInProgress) return;
            updateInProgress = true;

            // Lấy dữ liệu từ localStorage
            const currentUser = JSON.parse(localStorage.getItem('current_user')) || {};

            // Cập nhật thông tin từ form
            const firstName = $('#firstName').val().trim() || '';
            const lastName = $('#lastName').val().trim() || '';
            const fullName = (firstName + ' ' + lastName).trim();

            currentUser.name = fullName;
            currentUser.email = $('#email').val().trim() || currentUser.email || '';
            currentUser.phone = $('#phoneaccount').val().trim() || currentUser.phone || '';

            // Lưu avatar nếu đã thay đổi
            const avatarSrc = $('.profile-img').attr('src');
            if (avatarSrc) {
                currentUser.avatar = avatarSrc;
            }

            // Lưu lại vào localStorage
            localStorage.setItem('current_user', JSON.stringify(currentUser));

            // Cập nhật giao diện
            loadUserInformation();

            // Thông báo thành công (chỉ một lần)
            setTimeout(() => {
                alert('Thông tin đã được cập nhật!');
                updateInProgress = false;
            }, 100);
        } catch (error) {
            console.error("Lỗi khi lưu thay đổi tài khoản:", error);
            alert('Có lỗi xảy ra khi cập nhật thông tin!');
            updateInProgress = false;
        }
    }

    // Hàm điền dữ liệu địa chỉ vào form Address_Info.html
    function fillCurrentAddressData() {
        try {
            const currentUser = JSON.parse(localStorage.getItem('current_user')) || {};

            // Điền dữ liệu vào form
            $('#nickname').val(currentUser.name || '');
            $('#email').val(currentUser.email || '');
            $('#phoneaddress').val(currentUser.phone || '');

            // Điền địa chỉ nếu có
            if (currentUser.address) {
                const address = [
                    currentUser.address.street || '',
                    currentUser.address.city || '',
                    currentUser.address.country || ''
                ].filter(part => part.trim() !== '').join(', ');

                $('#address').val(address);
            }

            // Cập nhật avatar nếu có
            if (currentUser.avatar) {
                $('.profile-img').attr('src', currentUser.avatar);
            }

            // Cập nhật profile card trong modal
            $('#profileName').text(currentUser.name || '');
            $('#profileEmail').text(currentUser.email || '');

            // Lắng nghe sự kiện khi người dùng nhập liệu để cập nhật profile card
            $('#nickname, #email').on('input', function () {
                updateAddressProfileCard();
            });
        } catch (error) {
            console.error("Lỗi khi điền dữ liệu địa chỉ:", error);
        }
    }

    // Cập nhật profile card trong modal address
    function updateAddressProfileCard() {
        const nickname = $('#nickname').val() || '';
        const email = $('#email').val() || '';

        if (nickname) {
            $('#profileName').text(nickname);
        }

        if (email) {
            $('#profileEmail').text(email);
        }
    }

    // Lưu thay đổi từ modal địa chỉ
    function saveAddressChanges() {
        try {
            // Ngăn chặn nhiều thông báo liên tiếp
            if (updateInProgress) return;
            updateInProgress = true;

            // Lấy dữ liệu từ localStorage
            const currentUser = JSON.parse(localStorage.getItem('current_user')) || {};

            // Cập nhật thông tin từ form
            currentUser.name = $('#nickname').val().trim() || currentUser.name || '';
            currentUser.email = $('#email').val().trim() || currentUser.email || '';
            currentUser.phone = $('#phoneaddress').val().trim() || currentUser.phone || '';

            // Xử lý địa chỉ
            const fullAddress = $('#address').val().trim() || '';
            if (fullAddress) {
                const addressParts = fullAddress.split(',').map(part => part.trim());

                currentUser.address = {
                    street: addressParts[0] || '',
                    city: addressParts.length > 1 ? addressParts[1] : '',
                    country: addressParts.length > 2 ? addressParts[2] : ''
                };
            }

            // Lưu avatar nếu đã thay đổi
            const avatarSrc = $('.profile-img').attr('src');
            if (avatarSrc) {
                currentUser.avatar = avatarSrc;
            }

            // Lưu lại vào localStorage
            localStorage.setItem('current_user', JSON.stringify(currentUser));

            // Cập nhật giao diện
            loadUserInformation();

            // Thông báo thành công
            setTimeout(() => {
                alert('Thông tin đã được cập nhật!');
                updateInProgress = false;
            }, 100);
        } catch (error) {
            console.error("Lỗi khi lưu thay đổi địa chỉ:", error);
            alert('Có lỗi xảy ra khi cập nhật thông tin!');
            updateInProgress = false;
        }
    }
    // Hàm tải sản phẩm ngẫu nhiên cho phần Browsing History
    function loadBrowsingHistory() {
        try {
            // Fetch dữ liệu sản phẩm từ products.json
            fetch("../json/products.json")
                .then(response => response.json())
                .then(productData => {
                    if (!productData || productData.length === 0) {
                        console.error("Không có dữ liệu sản phẩm");
                        return;
                    }

                    // Xáo trộn mảng sản phẩm
                    const shuffledProducts = shuffleArray(productData);

                    // Lấy 4 sản phẩm đầu tiên từ mảng đã xáo trộn
                    const browsedProducts = shuffledProducts.slice(0, 4);

                    // Hiển thị sản phẩm trong phần Browsing History
                    renderBrowsingHistory(browsedProducts);
                })
                .catch(error => {
                    console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
                });
        } catch (error) {
            console.error("Lỗi khi tải lịch sử duyệt:", error);
        }
    }

    // Hàm để xáo trộn mảng (Fisher-Yates shuffle algorithm)
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Hàm render sản phẩm vào phần Browsing History với nút "Thêm vào giỏ hàng"
    function renderBrowsingHistory(products) {
        // Tìm container chứa sản phẩm trong phần Browsing History
        const $container = $('.recomment-product .row');
        if (!$container.length) return;

        // Xóa nội dung hiện tại
        $container.empty();

        // Thêm style cho nút Add To Basket
        addCartButtonStyles();

        // Thêm sản phẩm mới
        products.forEach(product => {
            const $productItem = $(`
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="product-card" data-id="${product.id}">
                    <div class="product-img">
                        <img src="${product.img}" alt="${product.description}" class="w-100">
                    </div>
                    <div class="product-title">
                        ${product.description}
                    </div>
                    <div class="mb-2">
                        <span class="price">${product.price}</span>
                        <span class="old-price">${product.oldPrice}</span>
                    </div>
                    <button class="btn btn-shopping d-flex align-items-center w-100 position-relative add-to-cart-btn" data-id="${product.id}">
                        <span class="mx-auto">Add To Basket</span>
                        <img src="../icons/transactional/shopping-cart.svg" alt="" class="position-absolute end-0">
                    </button>
                </div>
            </div>
        `);

            $container.append($productItem);
        });

        // Thêm sự kiện click cho sản phẩm (chỉ chuyển trang khi click vào sản phẩm không phải nút)
        $('.product-card').click(function (e) {
            // Nếu click vào nút "Add To Basket" thì không chuyển trang
            if ($(e.target).closest('.add-to-cart-btn').length === 0) {
                const id = $(this).data('id');
                localStorage.setItem("productDetail", id);
                window.location.href = `product-detail.html`;
            }
        });

        // Gọi hàm thêm sự kiện cho nút Add To Basket
        AddToCartButtons(products);
    }
    // Hàm tải và hiển thị thống kê đơn hàng
    function loadOrderStats() {
        try {
            // Lấy thống kê đơn hàng từ localStorage
            const orderStats = JSON.parse(localStorage.getItem('orderStats')) || { total: 0 };

            // Cập nhật giao diện
            $('.num-order').eq(0).text(orderStats.total);  // Tổng đơn hàng
            $('.num-order').eq(1).text(orderStats.total); // Đơn hàng đang xử lý
            $('.num-order').eq(2).text(orderStats.total); // Đơn hàng hoàn thành
        } catch (error) {
            console.error("Lỗi khi tải thống kê đơn hàng:", error);
        }
    }
    // Hàm thêm sự kiện cho nút "Add To Basket"
    function AddToCartButtons(products) {
        const buttons = document.querySelectorAll('.recomment-product .add-to-cart-btn');
        buttons.forEach((button) => {
            button.addEventListener('click', (e) => {
                // Ngăn chặn sự kiện click lan tỏa đến thẻ cha
                e.stopPropagation();

                const productId = button.getAttribute('data-id');
                const product = products.find(p => p.id == productId);

                if (!product) {
                    console.error("Không tìm thấy sản phẩm với ID:", productId);
                    return;
                }

                let cart = JSON.parse(localStorage.getItem('cart')) || [];

                // Kiểm tra xem sản phẩm đã có trong giỏ chưa
                const index = cart.findIndex(item => item.id === product.id);
                if (index === -1) {
                    cart.push({ ...product, quantity: 1 });
                } else {
                    cart[index].quantity += 1; // Tăng số lượng nếu đã có
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                alert("Added to cart!");
            });
        });
    }
    // Thêm style cho nút Add To Basket
    // Hàm thêm style cho nút Add To Basket dựa trên các style đã có
    // Hàm thêm style cho nút Add To Basket dựa trên style từ filter.css
    function addCartButtonStyles() {
        $("<style>")
            .prop("type", "text/css")
            .html(`
            /* Style cho sản phẩm trong recomment-product */
            .recomment-product .product-card {
                cursor: pointer;
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 12px;
                height: 100%;
                display: flex;
                flex-direction: column;
                transition: all 0.3s ease;
                background-color: white;
            }
            
            .recomment-product .product-card:hover {
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                transform: translateY(-5px);
            }
            
            .recomment-product .product-img {
                margin-bottom: 10px;
                text-align: center;
                transition: transform 0.3s ease;
            }
            
            .recomment-product .product-card:hover .product-img img {
                transform: scale(1.1);
            }
            
            .recomment-product .product-title {
                font-weight: bold;
                margin-bottom: 5px;
                min-height: 40px;
            }
            
            .recomment-product .product-card:hover .product-title {
                color: red;
            }
            
            .recomment-product .price {
                color: #BF0100;
                font-weight: bold;
                font-size: 1.1em;
            }
            
            .recomment-product .old-price {
                color: #999;
                text-decoration: line-through;
                margin-left: 5px;
            }
            
            /* Style cho nút thêm vào giỏ hàng từ filter.css */
            .recomment-product .btn-shopping {
                color: black;
                font-weight: 350;
                border: 2px solid rgb(225, 0, 0) !important;
                border-radius: 15px !important;
                transition: transform 0.3s ease !important;
                margin-top: auto;
                background-color: transparent;
                display: flex;
                align-items: center;
                padding: 8px 12px;
            }
            
            .recomment-product .btn-shopping:hover {
                color: rgb(150, 0, 0);
                border: 2px solid rgb(150, 0, 0) !important;
                transform: scale(1.1);
            }
            
            .recomment-product .btn-shopping img {
                background-color: rgb(225, 0, 0);
                margin-right: 10px;
                padding: 7px;
                border-radius: 5px;
                transition: transform 0.3s ease;
            }
            
            .recomment-product .btn-shopping:hover img {
                background-color: rgb(150, 0, 0);
                transform: scale(1.1);
            }
            
            @media (max-width: 1300px) {
                .recomment-product .btn-shopping span {
                    font-size: 12px;
                }
            }
            
            @media (max-width: 1200px) {
                .recomment-product .btn-shopping span {
                    display: none;
                }
                
                .recomment-product .btn-shopping img {
                    position: static !important;
                    margin: 0 auto;
                }
                
                .recomment-product .btn-shopping {
                    background-color: rgb(225, 0, 0);
                }
                
                .recomment-product .btn-shopping:hover {
                    background-color: rgb(150, 0, 0);
                }
            }
        `)
            .appendTo("head");
    }


});