const BASE_URL = "https://tarmeezacademy.com/api/v1";

async function apiRequest(url, options = {}) {
    try {
        const res = await fetch(url, options);
        
        // إذا كان السيرفر رد بخطأ (مثل 404 أو 500)
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error("API Error:", errorData);
            return { res, data: errorData };
        }

        const data = await res.json();
        return { res, data };
    } catch (err) {
        console.error("Fetch Error (Network or Syntax):", err);
        return { res: { ok: false }, data: { message: "Network Error" } };
    }
}