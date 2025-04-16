// let productData = []; // Khai báo biến productData toàn cục luôn

async function loadProductDetail() {
    let productId = localStorage.getItem("productDetail");
    console.log("ID trong localStorage:", productId);

    if (!productId) {
        $("#product-detail-container").html("<p class='text-center'>Không tìm thấy sản phẩm.</p>");
        return;
    }

    try {
        if (productData.length === 0) {
            const response = await fetch("../json/products.json");
            productData = await response.json(); // fetch xong mới gán
        }

        const product = productData.find(p => p.id == productId);

        if (!product) {
            $("#product-detail-container").html("<p class='text-center'>Không tìm thấy sản phẩm.</p>");
            return;
        }
        $("#description").text(product.description);
        $("#brand").text(product.title);
        $("#cpu").text(product.cpu);
        $("#gpu").text(product.gpu);
        $("#screen").text(product.screen);
        $("#ram").text(product.ram);
        $("#storage").text(product.ssd);
        $(".product-img").attr("src", product.img);

        // Render sản phẩm ra trang
        $("#product-detail-container").html(`
            <div class="card h-100 p-3 d-flex flex-row">
                <div class="img me-3">
                    <img src="${product.img}" class="img-fluid mb-2 w-100 h-75" alt="${product.description}">
                    <div class="d-flex">
                        
                    </div>
                </div>
                <div class="info d-flex flex-column justify-content-between">
                        <div>
                            <h5 class="fw-bold w-100">${product.description}</h5>
                            <p>Brand: ${product.title}</p>
                            <p>${product.category} color: Black</p>
                        </div>
                        
                        <div class="d-flex gap-2">
                            <button type="button" class="btn btn-outline-danger">Black</button>
                            <button type="button" class="btn btn-outline-danger">Gray</button>
                            <button type="button" class="btn btn-outline-danger">Platium</button>
                        </div>

                        <div class="d-flex align-items-center mb-3">
                            <span class="fw-bold fs-4 me-2" style="color:#BF0100;">${product.price}</span>
                            <span class="text-muted text-decoration-line-through">${product.oldPrice}</span>
                        </div>
                        <div class="d-flex w-100">
                            <button class="btn buy-now-btn text-white w-50 me-2 fw-semibold" style="background-color: #BF0100;">BUY NOW</button>
                            <button class="btn add-to-cart-btn fw-semibold w-50" data-id="${product.id}" style="border: 1px solid #BF0100; color:#BF0100;">ADD TO CART</button>
                        </div>
                </div>
            </div>
            
        `);

        // Thêm sự kiện cho nút "BUY NOW"
        setupBuyNowButton();
        
        const tableProduct = generateProductDetailTable(product);
        $("#product-detail-table").html(tableProduct);

    } catch (error) {
        console.error("Lỗi load sản phẩm:", error);
    }
}
// Thêm hàm xử lý nút "BUY NOW"
function setupBuyNowButton() {
    $('.buy-now-btn').on('click', function () {
        // Lấy ID sản phẩm hiện tại từ localStorage
        const productId = localStorage.getItem("productDetail");

        if (!productId) {
            alert("Không tìm thấy thông tin sản phẩm!");
            return;
        }

        // Tìm sản phẩm trong dữ liệu sản phẩm đã fetch
        const product = productData.find(p => p.id === productId);
        if (!product) {
            alert("Không tìm thấy sản phẩm!");
            return;
        }

        // Tạo giỏ hàng tạm thời chỉ với sản phẩm này
        const tempCart = [{
            id: productId,
            quantity: 1
        }];

        // Lưu vào localStorage với key đặc biệt để phân biệt với giỏ hàng thông thường
        localStorage.setItem('buyNowCart', JSON.stringify(tempCart));

        // Thêm flag để Check_Out.js biết là "Buy Now"
        localStorage.setItem('isBuyNow', 'true');

        // Chuyển hướng đến trang thanh toán
        window.location.href = '../html/Check_Out.html';
    });
}

$(document).ready(function () {
    loadProductDetail();

    // Xóa thông tin giỏ hàng tạm khi trang chi tiết sản phẩm được load
    localStorage.removeItem('buyNowCart');
    localStorage.removeItem('isBuyNow');
});

function generateProductDetailTable(product) {
    if (!product) return '';

    let configRows = '';
    if (product.cpu) configRows += `<tr><td>CPU</td><td>${product.cpu}</td></tr>`;
    if (product.gpu) configRows += `<tr><td>Graphics chip</td><td>${product.gpu}</td></tr>`;
    if (product.ram) configRows += `<tr><td>RAM</td><td>${product.ram}</td></tr>`;
    if (product.ssd) configRows += `<tr><td>Storage</td><td>${product.ssd}</td></tr>`;
    if (product.screen) configRows += `<tr><td>Screen</td><td>${product.screen}</td></tr>`;
    if (product.psu) configRows += `<tr><td>Power supply</td><td>${product.psu}</td></tr>`;
    if (product.size) configRows += `<tr><td>Size</td><td>${product.size}</td></tr>`;
    if (product.resolution) configRows += `<tr><td>Resolution</td><td>${product.resolution}</td></tr>`;
    if (product.refreshRate) configRows += `<tr><td>RefreshRate</td><td>${product.refreshRate} / ${product.panel}</td></tr>`;
    if (product.cores) configRows += `<tr><td>Cores</td><td>${product.cores}</td></tr>`;
    if (product.threads) configRows += `<tr><td>Threads</td><td>${product.threads}</td></tr>`;
    if (product.baseClock) configRows += `<tr><td>BaseClock</td><td>${product.baseClock}</td></tr>`;
    if (product.boostClock) configRows += `<tr><td>BoostClock</td><td>${product.boostClock}</td></tr>`;
    if (product.socket) configRows += `<tr><td>Socket</td><td>${product.socket}</td></tr>`;
    if (product.vram) configRows += `<tr><td>Vram</td><td>${product.vram}</td></tr>`;
    if (product.power) configRows += `<tr><td>Power</td><td>${product.power}</td></tr>`;
    if (product.chipset) configRows += `<tr><td>Chipset</td><td>${product.chipset}</td></tr>`;
    if (product.ramSlots) configRows += `<tr><td>Ram slots</td><td>${product.ramSlots}</td></tr>`;
    if (product.maxRam) configRows += `<tr><td>Max ram</td><td>${product.maxRam}</td></tr>`;
    if (product.type) configRows += `<tr><td>Type</td><td>${product.type}</td></tr>`;
    if (product.speed) configRows += `<tr><td>Speed</td><td>${product.speed}</td></tr>`;
    if (product.capacity) configRows += `<tr><td>Capacity</td><td>${product.capacity}</td></tr>`;
    if (product.rgb) configRows += `<tr><td>RGB</td><td>${product.rgb}</td></tr>`;
    if (product.fanSupport) configRows += `<tr><td>Fan support</td><td>${product.fanSupport}</td></tr>`;
    if (product.radiator) configRows += `<tr><td>Radiator</td><td>${product.radiator}</td></tr>`;
    if (product.wattage) configRows += `<tr><td>Wattage</td><td>${product.wattage}</td></tr>`;
    if (product.efficiency) configRows += `<tr><td>Efficiency</td><td>${product.efficiency}</td></tr>`;
    if (product.modular) configRows += `<tr><td>Modular</td><td>${product.modular}</td></tr>`;
    if (product.switch) configRows += `<tr><td>Switch</td><td>${product.switch}</td></tr>`;
    if (product.sensor) configRows += `<tr><td>Sensor</td><td>${product.sensor}</td></tr>`;
    if (product.dpi) configRows += `<tr><td>DPI</td><td>${product.dpi}</td></tr>`;
    if (product.material) configRows += `<tr><td>Material</td><td>${product.material}</td></tr>`;
    if (product.interface) configRows += `<tr><td>Interface</td><td>${product.interface}</td></tr>`;
    if (product.connection) configRows += `<tr><td>Connection</td><td>${product.connection}</td></tr>`;

    if (!configRows) return '';

    return `
        <span class="fw-bold fs-5">Details</span>
        <table class="table table-striped border-white mt-4 ms-2">
            <tbody>
                <tr><td>Brand</td><td>${product.title}</td></tr>
                <tr><td>Guarantee</td><td>24 months</td></tr>
                <tr><td colspan="2" class="fw-semibold text-secondary">Detailed configuration</td></tr>
                ${configRows}
            </tbody>
        </table>
    `;
}

