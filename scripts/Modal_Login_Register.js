$(document).ready(function () {
    // Khởi tạo biến toàn cục
    const USERS_KEY = 'registered_users';

    // Đảm bảo localStorage có key users nếu chưa tồn tại
    if (!localStorage.getItem(USERS_KEY)) {
        localStorage.setItem(USERS_KEY, JSON.stringify([]));
    }

    // Regex patterns cho validation
    const patterns = {
        name: /^[a-zA-ZÀ-ỹ\s]{2,50}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        phoneVN: /^(0|\+84)([0-9]{9,10})$/
    };

    // Thông báo lỗi tương ứng
    const errorMessages = {
        name: 'Tên phải từ 2-50 ký tự và không chứa ký tự đặc biệt',
        email: 'Email không hợp lệ. Vui lòng nhập đúng định dạng',
        password: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt',
        phoneVN: 'Số điện thoại không hợp lệ, định dạng 0xxxxxxxxx hoặc +84xxxxxxxxx'
    };

    // Hủy event trước để tránh đăng ký nhiều lần
    $(document).off('click', '#loginButton, #showLoginModal');

    // Xử lý sự kiện click trên nút login trong navbar
    $(document).on('click', '#loginButton, #showLoginModal', function (e) {
        e.preventDefault();
        console.log('Login/Register button clicked');

        // Kiểm tra xem modal đã tồn tại chưa
        if ($('#authModal').length > 0) {
            const existingModal = bootstrap.Modal.getInstance($('#authModal')[0]);
            if (existingModal) {
                existingModal.show();
                return;
            }
        }

        // Tải nội dung modal từ file HTML (chỉ tải nếu chưa có)
        $('#modalContainer').load('Login_Register_Modal.html', function () {
            // Sau khi tải xong nội dung modal
            console.log('Modal content loaded');

            // Hiển thị modal
            const authModal = new bootstrap.Modal(document.getElementById('authModal'));
            authModal.show();

            // Thêm các validation feedback
            addValidationFeedback();

            // Thiết lập các sự kiện cho modal sau khi nó được tải
            setupModalEvents();
        });
    });

    // Thiết lập các sự kiện cho modal
    function setupModalEvents() {
        const $container = $('.auth-container');
        const $showRegisterBtn = $('#show-register');
        const $showLoginBtn = $('#show-login');
        const $registerForm = $('.register-form form');
        const $loginForm = $('.login-form form');

        // Toggle giữa form đăng nhập và đăng ký
        $showRegisterBtn.on('click', function () {
            $container.addClass('active');
        });

        $showLoginBtn.on('click', function () {
            $container.removeClass('active');
        });

        // Thêm validation khi nhập liệu
        $('input').on('input', function () {
            validateField($(this));
        });

        // Xử lý submit form đăng ký
        $registerForm.on('submit', function (e) {
            e.preventDefault();
            handleRegisterSubmit($(this));
        });

        // Xử lý submit form đăng nhập
        $loginForm.on('submit', function (e) {
            e.preventDefault();
            handleLoginSubmit($(this));
        });
    }

    // Xử lý submit form đăng ký
    function handleRegisterSubmit($form) {
        const $nameInput = $form.find('input[type="text"]');
        const $emailInput = $form.find('input[type="email"]');
        const $passwordInput = $form.find('input[type="password"]');

        const nameValid = validateField($nameInput);
        const emailValid = validateField($emailInput);
        const passwordValid = validateField($passwordInput);

        if (!nameValid || !emailValid || !passwordValid) {
            return;
        }

        const name = $nameInput.val().trim();
        const email = $emailInput.val().trim();
        const password = $passwordInput.val().trim();

        // Lấy danh sách người dùng
        let users = [];
        try {
            users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
        } catch (e) {
            users = [];
        }

        // Kiểm tra email đã tồn tại chưa
        const userExists = users.some(user => user.email === email);
        if (userExists) {
            alert('Email này đã được đăng ký!');
            return;
        }

        // Tạo đối tượng người dùng mới
        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        };

        // Thêm vào mảng và lưu localStorage
        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        console.log('Đăng ký thành công:', newUser);
        alert('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');

        // Chuyển về form đăng nhập và điền sẵn email
        $('.auth-container').removeClass('active');
        $('.login-form form input[type="email"]').val(email);
        $form.trigger('reset');
    }

    // Xử lý submit form đăng nhập
    function handleLoginSubmit($form) {
        const $loginInput = $form.find('input[type="email"]');
        const $passwordInput = $form.find('input[type="password"]');

        // Bỏ qua validation email/phone cho form đăng nhập
        // vì có thể đăng nhập bằng email hoặc phone
        if (!$loginInput.val().trim() || !$passwordInput.val().trim()) {
            $loginInput.addClass('is-invalid');
            $passwordInput.addClass('is-invalid');
            return;
        }

        const login = $loginInput.val().trim();
        const password = $passwordInput.val().trim();

        // Lấy danh sách người dùng
        let users = [];
        try {
            users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
        } catch (e) {
            users = [];
        }

        // Kiểm tra đăng nhập bằng email hoặc phone
        const user = users.find(u =>
            (u.email === login || (u.phone && u.phone === login)) &&
            u.password === password
        );

        if (user) {
            // Lưu thông tin người dùng hiện tại (không lưu password)
            const userInfo = { ...user };
            delete userInfo.password;

            localStorage.setItem('current_user', JSON.stringify(userInfo));
            console.log('Đăng nhập thành công:', userInfo);

            // Cập nhật nút đăng nhập với tên người dùng
            updateLoginButton(user.name);

            alert('Đăng nhập thành công! Bạn sẽ được chuyển về trang chủ.');

            // Đóng modal
            const modalInstance = bootstrap.Modal.getInstance($('#authModal')[0]);
            if (modalInstance) modalInstance.hide();

            // Chuyển hướng về trang chủ
            window.location.href = 'homepage.html';
        } else {
            alert('Email/số điện thoại hoặc mật khẩu không đúng!');
        }
    }
    // Hàm câp nhật nút đăng nhập với tên người dùng
    function updateLoginButton(userName) {
        const $loginButton = $('#loginButton');
        if ($loginButton.length) {
            $loginButton.html(`
                <img src="../icons/nav/user.svg" alt="" class="me-1">
                <span class="d-none d-sm-inline">${userName}</span>
            `);
        }
    }
    // Thêm thông báo lỗi cho các trường
    function addValidationFeedback() {
        $('input').each(function () {
            const $this = $(this);
            $this.next('.invalid-feedback').remove();

            const inputType = $this.attr('type');
            let message = errorMessages[inputType === 'text' ? 'name' : inputType];

            $this.after('<div class="invalid-feedback">' + (message || 'Vui lòng nhập đúng định dạng') + '</div>');
        });
    }

    // Validate field dựa trên regex
    function validateField($field) {
        const value = $field.val().trim();
        const fieldType = $field.attr('type');
        let pattern;

        switch (fieldType) {
            case 'text':
                pattern = patterns.name;
                break;
            case 'email':
                // Nếu là form đăng nhập, cho phép nhập số điện thoại
                if ($field.closest('form').parent().hasClass('login-form')) {
                    if (patterns.phoneVN.test(value)) {
                        $field.removeClass('is-invalid').addClass('is-valid');
                        return true;
                    }
                }
                pattern = patterns.email;
                break;
            case 'password':
                pattern = patterns.password;
                break;
        }

        if (!pattern || !value) {
            $field.removeClass('is-valid').addClass('is-invalid');
            return false;
        }

        const isValid = pattern.test(value);
        $field.toggleClass('is-valid', isValid).toggleClass('is-invalid', !isValid);

        return isValid;
    }
});