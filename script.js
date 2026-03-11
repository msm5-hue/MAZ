/**
 * MAZZ MISSION CONTROL - CORE PROTOCOL V3.0
 * التحويل الكامل للون السماوي الرقمي وإدارة البث
 */

const CHANNEL = "mazn1115";
// استخدام بروتوكول منع التخزين المؤقت لضمان تحديث الحالة
const API_URL = `https://kick.com/api/v2/channels/${CHANNEL}?update=${Date.now()}`;
const PLAYER_URL = `https://player.kick.com/${CHANNEL}?autoplay=true&muted=false`;

// العناصر الأساسية في محطة القيادة
const statusEl = document.getElementById("liveStatus");
const playerContainer = document.querySelector(".player-wrapper");

/**
 * 1. مسح النطاق (Scanning Sector)
 * جلب البيانات من أقمار Kick الصناعية
 */
async function scanSatelliteSignal() {
    console.log(`%c🛰️ SCANNING: Sector ${CHANNEL} for Cyan signal...`, "color: #00f2ff; font-weight: bold;");
    
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // التحقق مما إذا كان البث نشطاً
        const isLive = data.livestream && data.livestream.is_live;

        if (isLive) {
            deployStream("ACTIVE_COMMUNICATION");
        } else {
            deployStream("STANDBY_ORBIT");
        }
    } catch (err) {
        console.error("Critical Failure: Satellite Link Interrupted", err);
        deployStream("SIGNAL_LOST");
    }
}

/**
 * 2. إدارة واجهة البث (Deployment Logic)
 */
function deployStream(status) {
    // إزالة أي تلميحات أرجوانية من الواجهة برمجياً (تأكيد إضافي)
    document.documentElement.style.setProperty('--neon-purple', '#00f2ff'); 

    if (status === "ACTIVE_COMMUNICATION") {
        statusEl.innerHTML = "🛰️ إشارة نشطة: البث مباشر الآن";
        statusEl.className = "status-pill live"; // سيأخذ التوهج السماوي من الـ CSS
        
        // حقن مشغل البث
        playerContainer.innerHTML = `
            <iframe 
                src="${PLAYER_URL}" 
                frameborder="0" 
                scrolling="no" 
                allowfullscreen="true" 
                style="width: 100%; height: 100%; position: absolute; top:0; left:0; border: 1px solid #00f2ff; box-shadow: 0 0 20px rgba(0, 242, 255, 0.3);">
            </iframe>`;
        console.log("%c[SUCCESS] Link Established. Enjoy the flight.", "color: #00f2ff; font-weight: bold;");
    } else {
        const message = status === "SIGNAL_LOST" ? "⚠️ تعذر رصد الإشارة" : "🌌 المحطة في وضع الانتظار: البث مقفل";
        statusEl.innerHTML = message;
        statusEl.className = "status-pill offline";
        
        // إظهار شعار الصقر السماوي كعنصر انتظار
        playerContainer.innerHTML = `
            <div class="stream-placeholder" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
                <img src="Logo mazz.png" alt="MAZZ" style="width: 150px; filter: drop-shadow(0 0 15px #00f2ff) saturate(1.5); opacity: 0.8; animation: float 3s ease-in-out infinite;">
                <p style="color: #00f2ff; margin-top: 20px; font-family: 'Tajawal'; letter-spacing: 2px; opacity: 0.6;">الرادار في وضع المسح المستمر...</p>
            </div>`;
    }
}

// تشغيل النظام
scanSatelliteSignal();
// فحص الإشارة كل 45 ثانية لضمان الاستجابة السريعة
setInterval(scanSatelliteSignal, 45000);

/**
 * 3. تأثيرات بصرية إضافية (الظهور عند التمرير)
 */
const revealProtocol = () => {
    const reveals = document.querySelectorAll(".reveal");
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const revealTop = el.getBoundingClientRect().top;
        if (revealTop < windowHeight - 150) {
            el.classList.add("active");
        }
    });
};

window.addEventListener("scroll", revealProtocol);
window.addEventListener("load", revealProtocol);