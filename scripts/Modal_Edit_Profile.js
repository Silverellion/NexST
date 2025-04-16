$(document).ready(function () {
    // Regex patterns
    const patterns = {
        name: /^[a-zA-ZÀ-ỹ\s]{2,50}$/,  // Tên có từ 2-50 ký tự, bao gồm chữ cái và khoảng trắng, hỗ trợ tiếng Việt
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,  // Email format
        phone: /^(0|\+84)([0-9]{9,10})$/  // Số điện thoại Việt Nam (0xxxxxxxxx hoặc +84xxxxxxxxx)
    };

    // Function to validate field
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
        firstName: 'Tên phải có từ 2-50 ký tự và chỉ chứa chữ cái',
        lastName: 'Họ phải có từ 2-50 ký tự và chỉ chứa chữ cái',
        email: 'Vui lòng nhập đúng định dạng email',
        phoneaccount: 'Số điện thoại phải bắt đầu bằng 0 hoặc +84 và có 9-10 số'
    };

    // Add validation feedback elements
    function addFeedbackElements() {
        $('#firstName, #lastName, #email, #phoneaccount').each(function () {
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
        $('#firstName').on('input', function () {
            validateField($(this), patterns.name);
        });

        $('#lastName').on('input', function () {
            validateField($(this), patterns.name);
        });

        $('#email').on('input', function () {
            validateField($(this), patterns.email);
        });

        $('#phoneaccount').on('input', function () {
            if (!$(this).val().trim()) {
                // Phone is optional, so remove validation classes if empty
                $(this).removeClass('is-valid is-invalid');
            } else {
                validateField($(this), patterns.phone);
            }
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
        const firstName = $('#firstName').val();
        const lastName = $('#lastName').val();
        const email = $('#email').val();

        // Cập nhật tên (nếu có cả firstName và lastName)
        if (firstName || lastName) {
            $('#profileName').text((firstName + ' ' + lastName).trim());
        }

        // Cập nhật email
        if (email) {
            $('#profileEmail').text(email);
        }
    }

    // Lắng nghe sự kiện khi người dùng nhập liệu
    $('#firstName, #lastName, #email').on('input', function () {
        updateProfileCard();
    });

    // Lắng nghe sự kiện khi click nút SAVE
    $('#saveBtn').click(function () {
        let isValid = true;

        // Kiểm tra các trường bắt buộc
        const firstName = $('#firstName').val().trim();
        const lastName = $('#lastName').val().trim();
        const email = $('#email').val().trim();

        // Kiểm tra firstName
        if (!firstName) {
            $('#firstName').removeClass('is-valid').addClass('is-invalid');
            isValid = false;
        } else if (!validateField($('#firstName'), patterns.name)) {
            isValid = false;
        }

        // Kiểm tra lastName
        if (!lastName) {
            $('#lastName').removeClass('is-valid').addClass('is-invalid');
            isValid = false;
        } else if (!validateField($('#lastName'), patterns.name)) {
            isValid = false;
        }

        // Kiểm tra email
        if (!email) {
            $('#email').removeClass('is-valid').addClass('is-invalid');
            isValid = false;
        } else if (!validateField($('#email'), patterns.email)) {
            isValid = false;
        }

        // Kiểm tra số điện thoại nếu đã nhập
        const phoneValue = $('#phoneaccount').val().trim();
        if (phoneValue && !validateField($('#phoneaccount'), patterns.phone)) {
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
        saveProfileData();

        // Ẩn thông báo lỗi nếu có
        $('#validationErrorAlert').remove();

        // Hiển thị thông báo thành công
        $('.modal-body').prepend(
            '<div id="successAlert" class="alert alert-success mb-3" role="alert">' +
            'Cập nhật thông tin thành công!' +
            '</div>'
        );

        // Tự động ẩn thông báo thành công sau 2 giây
        setTimeout(function () {
            $('#successAlert').fadeOut('slow', function () {
                $(this).remove();
            });
        }, 2000);
    });

    // Hàm lưu thông tin profile
    function saveProfileData() {
        try {
            // Lấy thông tin hiện tại từ localStorage nếu có
            const currentUser = JSON.parse(localStorage.getItem('current_user')) || {};

            // Cập nhật thông tin mới
            currentUser.name = ($('#firstName').val().trim() + ' ' + $('#lastName').val().trim()).trim();
            currentUser.email = $('#email').val().trim();
            currentUser.phone = $('#phoneaccount').val().trim() || '';

            // Lưu avatar nếu có
            const avatarSrc = $('.profile-img').attr('src');
            if (avatarSrc) {
                currentUser.avatar = avatarSrc;
            }

            // Lưu trở lại vào localStorage
            localStorage.setItem('current_user', JSON.stringify(currentUser));
        } catch (error) {
            console.error('Lỗi khi lưu dữ liệu:', error);
        }
    }

    // Điền dữ liệu người dùng hiện tại nếu có
    function loadCurrentUserData() {
        try {
            const currentUser = JSON.parse(localStorage.getItem('current_user')) || {};

            if (currentUser.name) {
                const nameParts = currentUser.name.split(' ');
                $('#firstName').val(nameParts[0] || '');
                $('#lastName').val(nameParts.slice(1).join(' ') || '');
            }

            if (currentUser.email) {
                $('#email').val(currentUser.email);
            }

            if (currentUser.phone) {
                $('#phoneaccount').val(currentUser.phone);
            }

            if (currentUser.avatar) {
                $('.profile-img').attr('src', currentUser.avatar);
            }

            // Trigger input event để kích hoạt validation
            $('#firstName, #lastName, #email, #phoneaccount').trigger('input');
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