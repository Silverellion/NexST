
$(document).ready(function () {
    // Regex patterns
    const patterns = {
        name: /^[a-zA-ZÀ-ỹ\s]{2,50}$/,  // Tên có từ 2-50 ký tự, bao gồm chữ cái và khoảng trắng, hỗ trợ tiếng Việt
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,  // Email format
        phone: /^(0|\+84)([0-9]{9,10})$/,  // Số điện thoại(0xxxxxxxxx hoặc +84xxxxxxxxx)
        address: /^[a-zA-Z0-9À-ỹ\s,.'-]{5,50}$/  // Địa chỉ 5-50 ký tự
    };

    // Hàm kiểm tra
    function validateField(field, regex) {
        const value = field.val().trim();
        if (!value) {
            field.removeClass('is-valid is-invalid');
            return false;
        }

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
        nickname: 'Tên phải có từ 2-50 ký tự và chỉ chứa chữ cái',
        email: 'Vui lòng nhập đúng định dạng email',
        phoneaddress: 'Số điện thoại phải bắt đầu bằng 0 hoặc +84 và có 9-10 số',
        address: 'Địa chỉ phải có từ 5-50 ký tự'
    };

    // Thêm các phần tử feedback cho các trường
    function addFeedbackElements() {
        $('#nickname, #email, #phoneaddress, #address').each(function () {
            const id = $(this).attr('id');

            // Xóa feedback cũ nếu có
            $(this).next('.invalid-feedback').remove();

            // Thêm feedback message mới
            const message = errorMessages[id] || 'Vui lòng nhập đúng định dạng.';
            $(this).after('<div class="invalid-feedback">' + message + '</div>');
        });
    }

    // Đăng ký sự kiện input cho các trường
    function registerInputEvents() {
        $('#nickname').on('input', function () {
            validateField($(this), patterns.name);
        });

        $('#email').on('input', function () {
            validateField($(this), patterns.email);
        });

        $('#phoneaddress').on('input', function () {
            if (!$(this).val().trim()) {
                // Nếu trường trống, xóa class is-valid và is-invalid
                $(this).removeClass('is-valid is-invalid');
            } else {
                validateField($(this), patterns.phone);
            }
        });

        $('#address').on('input', function () {
            validateField($(this), patterns.address);
        });
    }

    // Khởi tạo form validation
    function initializeFormValidation() {
        addFeedbackElements();
        registerInputEvents();
    }

    // Hiển thị avatar hover effect
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
    });

    // Hàm cập nhật profile card
    function updateProfileCard() {
        const nickname = $('#nickname').val();
        const email = $('#email').val();

        // Cập nhật tên
        if (nickname) {
            $('#profileName').text(nickname.trim());
        }

        // Cập nhật email
        if (email) {
            $('#profileEmail').text(email);
        }
    }

    // Lắng nghe sự kiện khi người dùng nhập liệu
    $('#nickname, #email').on('input', function () {
        updateProfileCard();
    });

    // Lắng nghe sự kiện khi click nút SAVE
    $('#saveBtn').click(function () {
        let isValid = true;

        // Kiểm tra các trường bắt buộc
        const nickname = $('#nickname').val().trim();
        const email = $('#email').val().trim();
        const address = $('#address').val().trim();

        // Kiểm tra nickname
        if (!nickname) {
            $('#nickname').removeClass('is-valid').addClass('is-invalid');
            isValid = false;
        } else if (!validateField($('#nickname'), patterns.name)) {
            isValid = false;
        }

        // Kiểm tra email
        if (!email) {
            $('#email').removeClass('is-valid').addClass('is-invalid');
            isValid = false;
        } else if (!validateField($('#email'), patterns.email)) {
            isValid = false;
        }

        // Kiểm tra address
        if (!address) {
            $('#address').removeClass('is-valid').addClass('is-invalid');
            isValid = false;
        } else if (!validateField($('#address'), patterns.address)) {
            isValid = false;
        }

        // Kiểm tra số điện thoại nếu đã nhập
        const phoneValue = $('#phoneaddress').val().trim();
        if (phoneValue && !validateField($('#phoneaddress'), patterns.phone)) {
            isValid = false;
        }

        if (!isValid) {
            // Hiển thị thông báo lỗi tổng quát
            $('#validationErrorAlert').remove();
            $('.modal-body').prepend(
                '<div id="validationErrorAlert" class="alert alert-danger mb-3" role="alert">' +
                'Vui lòng điền đầy đủ và chính xác thông tin!' +
                '</div>'
            );
            return;
        }

        // Nếu tất cả hợp lệ, tiếp tục cập nhật
        updateProfileCard();

        // Lưu thông tin
        saveAddressData();

        // Ẩn thông báo lỗi nếu có
        $('#validationErrorAlert').remove();

        // Hiển thị thông báo thành công
        $('.modal-body').prepend(
            '<div id="successAlert" class="alert alert-success mb-3" role="alert">' +
            'Cập nhật địa chỉ thành công!' +
            '</div>'
        );

        // Tự động ẩn thông báo thành công sau 2 giây
        setTimeout(function () {
            $('#successAlert').fadeOut('slow', function () {
                $(this).remove();
            });
        }, 2000);
    });

    // Hàm lưu thông tin address
    function saveAddressData() {
        try {
            // Lấy thông tin hiện tại từ localStorage nếu có
            const currentUser = JSON.parse(localStorage.getItem('current_user')) || {};

            // Cập nhật thông tin mới
            currentUser.name = $('#nickname').val().trim();
            currentUser.email = $('#email').val().trim();
            currentUser.phone = $('#phoneaddress').val().trim() || '';

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

            // Lưu avatar nếu có
            const avatarSrc = $('.profile-img').attr('src');
            if (avatarSrc) {
                currentUser.avatar = avatarSrc;
            }

            // Lưu trở lại vào localStorage
            localStorage.setItem('current_user', JSON.stringify(currentUser));
        } catch (error) {
            console.error('Lỗi khi lưu dữ liệu địa chỉ:', error);
        }
    }

    // Điền dữ liệu người dùng hiện tại nếu có
    function loadCurrentUserData() {
        try {
            const currentUser = JSON.parse(localStorage.getItem('current_user')) || {};

            if (currentUser.name) {
                $('#nickname').val(currentUser.name);
            }

            if (currentUser.email) {
                $('#email').val(currentUser.email);
            }

            if (currentUser.phone) {
                $('#phoneaddress').val(currentUser.phone);
            }

            if (currentUser.address) {
                // Tạo chuỗi địa chỉ đầy đủ
                const fullAddress = [
                    currentUser.address.street || '',
                    currentUser.address.city || '',
                    currentUser.address.country || ''
                ].filter(part => part.trim() !== '').join(', ');

                $('#address').val(fullAddress);
            }

            if (currentUser.avatar) {
                $('.profile-img').attr('src', currentUser.avatar);
            }

            // Gọi hàm cập nhật profile card để hiển thị thông tin hiện tại
            $('#nickname, #email, #phoneaddress, #address').trigger('input');
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu người dùng:', error);
        }
    }

    // Khởi tạo tất cả chức năng
    function init() {
        initializeFormValidation();
        loadCurrentUserData();
    }

    // Chạy khởi tạo
    init();
});