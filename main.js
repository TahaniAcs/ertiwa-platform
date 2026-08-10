document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('userToken');
    const role = localStorage.getItem('userRole');

    // إذا لم يكن هناك توكن، نعيده لصفحة تسجيل الدخول فوراً عند فتح لوحة التحكم
    if (!token && window.location.href.includes('dashboard.html')) {
        window.location.href = 'login.html';
        return;
    }

    // الإمساك بعناصر الواجهة
    const adminSec = document.getElementById('admin-shortcut-section');
    const memberSec = document.getElementById('member-card-section');
    const courseSec = document.getElementById('my-courses-section');
    const requestSec = document.getElementById('my-requests-section');
    const roleTitle = document.getElementById('user-role-title');

    if (roleTitle) {
        if (role === "admin") {
            // التحكم الخاص بالمدير العام
            const adminControls = document.getElementById('admin-controls');
            if (adminControls) adminControls.style.display = "block";
            if (adminSec) adminSec.style.display = "block";
            
            // إخفاء كروت المستفيدين العاديين
            if (courseSec) courseSec.style.display = "none";
            if (requestSec) requestSec.style.display = "none";
            if (memberSec) memberSec.style.display = "none";
            
            roleTitle.textContent = "مدير المنصة العام (Admin)";
        } 
        else if (role === "member") {
            // العضو المعتمد باللجان
            if (adminSec) adminSec.style.display = "none";
            if (memberSec) memberSec.style.display = "block";
            if (courseSec) courseSec.style.display = "none";
            if (requestSec) requestSec.style.display = "none";
            
            roleTitle.textContent = "عضو معتمد في لجان ارتواء";
        } 
        else {
            // المستفيد العادي والعميل
            if (adminSec) adminSec.style.display = "none";
            if (memberSec) memberSec.style.display = "none"; 
            if (courseSec) courseSec.style.display = "block";
            if (requestSec) requestSec.style.display = "block";
            
            roleTitle.textContent = "مستفيد من الخدمات والأنشطة الرقمية";
            
            // عرض الفعاليات محلياً إذا كان الـ API معطلاً، أو الاتصال بالـ API إذا توفر
            fetchUserEvents(token);
        }
    }
});

// دالة جلب الفعاليات (تعتمد بيانات محاكاة تجريبية عند توقف السيرفر)
async function fetchUserEvents(token) {
    const listContainer = document.getElementById('courses-list');
    if (!listContainer) return;

    try {
        const response = await fetch(`https://ertwa-backend.onrender.com/my_events?token=${token}`);
        
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                listContainer.innerHTML = "";
                data.forEach(ev => {
                    listContainer.innerHTML += `<li><i class='fa-solid fa-check'></i> ${ev.title}</li>`;
                });
                return;
            }
        }
        
        // في حال توقف السيرفر أو الاستجابة الفارغة: عرض بيانات محاكاة تجريبية مريحة
        displayMockEvents(listContainer);document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('userToken');
    const role = localStorage.getItem('userRole');

    // إعادة التوجيه التلقائي في حال عدم وجود توكن
    if (!token && window.location.href.includes('dashboard.html')) {
        window.location.href = 'login.html';
        return;
    }

    // الإمساك بعناصر الواجهة
    const adminSec = document.getElementById('admin-shortcut-section');
    const adminControls = document.getElementById('admin-controls');
    const memberSec = document.getElementById('member-card-section');
    const courseSec = document.getElementById('my-courses-section');
    const requestSec = document.getElementById('my-requests-section');
    const roleTitle = document.getElementById('user-role-title');

    // 1. التحكم في إظهار وإخفاء الأقسام بناءً على الدور
    if (role === "admin") {
        if (adminControls) adminControls.style.display = "block";
        if (adminSec) adminSec.style.display = "block";
        if (courseSec) courseSec.style.display = "none";
        if (requestSec) requestSec.style.display = "none";
        if (memberSec) memberSec.style.display = "none";
        
        if (roleTitle) roleTitle.textContent = "مدير المنصة العام (Admin)";
    } 
    else if (role === "member") {
        if (adminControls) adminControls.style.display = "none";
        if (adminSec) adminSec.style.display = "none";
        if (memberSec) memberSec.style.display = "block";
        if (courseSec) courseSec.style.display = "none";
        if (requestSec) requestSec.style.display = "none";
        
        if (roleTitle) roleTitle.textContent = "عضو معتمد في لجان ارتواء";
    } 
    else {
        // المستفيد العادي والعميل
        if (adminControls) adminControls.style.display = "none";
        if (adminSec) adminSec.style.display = "none";
        if (memberSec) memberSec.style.display = "none"; 
        if (courseSec) courseSec.style.display = "block";
        if (requestSec) requestSec.style.display = "block";
        
        if (roleTitle) roleTitle.textContent = "مستفيد من الخدمات والأنشطة الرقمية";
        
        // جلب الفعاليات الخاصة بالعميل
        fetchUserEvents(token);
    }
});

// 2. دالة جلب الفعاليات (معالجة بالكامل ومحمية من أخطاء الاتصال)
async function fetchUserEvents(token) {
    const listContainer = document.getElementById('courses-list');
    if (!listContainer) return;

    try {
        const response = await fetch(`https://ertwa-backend.onrender.com/my_events?token=${token}`, {
            method: 'GET',
            headers: { 'accept': 'application/json' }
        });
        
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                listContainer.innerHTML = "";
                data.forEach(ev => {
                    listContainer.innerHTML += `<li><i class="fa-solid fa-check" style="color: var(--jungle-green, #28B58F);"></i> ${ev.title || ev.event_title || 'فعالية مسجلة'}</li>`;
                });
                return;
            }
        }
        
        // في حال عدم وجود بيانات أو رد غير ناجح
        displayMockEvents(listContainer);

    } catch (error) {
        console.warn('السيرفر غير متاح حالياً، سيتم عرض البيانات التجريبية المحلية:', error);
        displayMockEvents(listContainer);
    }
}

// 3. دالة العرض التجريبي المحلي
function displayMockEvents(container) {
    if (!container) return;
    container.innerHTML = `
        <li><i class="fa-solid fa-check" style="color: var(--jungle-green, #28B58F);"></i> ورشة تطوير المواقع الإلكترونية (مسجل)</li>
        <li><i class="fa-solid fa-check" style="color: var(--jungle-green, #28B58F);"></i> لقاء المطورين السنوي (قيد الانتظار)</li>
    `;
}

    } catch (error) {
        console.warn('السيرفر غير متاح حالياً، سيتم عرض البيانات التجريبية المحلية:', error);
        displayMockEvents(listContainer);
    }
}

// دالة العرض المحلي العرضي للفعاليات
function displayMockEvents(container) {
    container.innerHTML = `
        <li><i class='fa-solid fa-check' style='color: #28B58F;'></i> ورشة تطوير المواقع الإلكترونية (مسجل)</li>
        <li><i class='fa-solid fa-check' style='color: #28B58F;'></i> لقاء المطورين السنوي (قيد الانتظار)</li>
    `;
}
