const ipInput = document.getElementById("ipInput");
const resultBox = document.getElementById("result");
const searchBtn = document.querySelector(".search-box button");

ipInput.addEventListener("keyup", function(e) {
    if (e.key === "Enter") searchIP();
});

function renderMessage(text) {
    resultBox.innerText = text;
}

function renderResult(data) {
    resultBox.innerText =
        ` Quốc gia: ${data.country || "(không có)"}\n` +
        ` Tỉnh / Khu vực: ${data.regionName || "(không có)"}\n` +
        ` Thành phố: ${data.city || "(không có)"}\n` +
        `  Nhà mạng: ${data.isp || "(không có)"}\n` +
        ` Vĩ độ, Kinh độ: ${data.lat}, ${data.lon}\n` +
        `  IP: ${data.query}`;
}

function setLoading(loading) {
    searchBtn.disabled = loading;
    searchBtn.style.opacity = loading ? 0.6 : 1;
    if (loading) renderMessage("Đang tìm kiếm...");
}

function isValidIP(ip) {
    const ipv4 = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;
    return ipv4.test(ip);
}

function searchIP() {
    const ip = ipInput.value.trim();

    if (!ip) {
        renderMessage("⚠️ Vui lòng nhập địa chỉ IP.");
        return;
    }
    if (!isValidIP(ip)) {
        renderMessage("⚠️ Bạn phải nhập địa chỉ IP (không phải chữ hoặc tên tỉnh).");
        return;
    }

    const url = `http://ip-api.com/json/${ip}?fields=66846719`;

    setLoading(true);

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.status !== "success") {
                renderMessage(" Không tìm thấy thông tin cho IP này.");
            } else {
                renderResult(data);
            }
        })
        .catch(err => {
            console.error(err);
            renderMessage(" Không kết nối được API. Thử lại sau.");
        })
        .finally(() => setLoading(false));
}
