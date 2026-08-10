// api.js - ملف مستقل لعمليات السيرفر
var BASE_URL = window.BASE_URL || 'https://ertwa-backend.onrender.com';

// 1. دالة جلب الفعاليات للرئيسية
async function fetchHomeEvents() {
    try {
        const response = await fetch(`${BASE_URL}/home`); //
        if (!response.ok) throw new Error('فشل في جلب البيانات');
        return await response.json(); 
    } catch (error) {
        console.error('حدث خطأ في جلب الفعاليات:', error);
        return [];
    }
}

// 2. دالة تسجيل الدخول (مصححة ومؤمنة)
async function loginWithAPI(email, password) {
    try {
        const url = `${BASE_URL}/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`; 
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'accept': 'application/json' }
        });
        const data = await response.json();
        return { status: response.status, ok: response.ok, data: data };
    } catch (error) {
        console.error('خطأ في الاتصال بالسيرفر:', error);
        return { status: 500, ok: false, data: { message: "فشل الاتصال بالسيرفر" } };
    }
}

// 3. دالة إضافة فعالية جديدة (مصححة لتطابق الباك إند)
async function addNewEvent(eventData) {
    try {
        const token = localStorage.getItem('userToken');

        // ⚠️ تحويل البيانات إلى Query Parameters لأن الباك إند لا يقبلها في الـ Body
        const params = new URLSearchParams({
            title: eventData.title,
            description: eventData.description,
            date: eventData.date,
            time: eventData.time,
            location: eventData.location,
            image: eventData.image || '', 
            token: token
        });

        const response = await fetch(`${BASE_URL}/events?${params.toString()}`, { 
            method: 'POST',
            headers: { 
                'accept': 'application/json'
            }
        });

        const data = await response.json();
        if (response.ok) {
            alert('تم إضافة الفعالية بنجاح! 🎉');
            window.location.reload();
        } else {
            console.error('تفاصيل الخطأ من السيرفر:', data);
            alert(`فشل الإضافة: ${data.message || data.detail || 'تأكد من الصلاحيات'}`);
        }
    } catch (error) {
        console.error('خطأ في الاتصال:', error);
    }
}

// 4. دالة جلب وعرض الفعاليات في صفحة events.html
async function loadAllEvents() {
    const container = document.querySelector('.events-grid');
    if (!container) return; 

    try {
        const response = await fetch(`${BASE_URL}/events`, { 
            method: 'GET',
            headers: { 'accept': 'application/json' }
        });

        if (response.ok) {
            const events = await response.json();
            
            container.innerHTML = '';

            if (events.length === 0) {
                container.innerHTML = '<p style="text-align:center; width:100%; color:#64748b;">لا توجد فعاليات متاحة حالياً.</p>';
                return;
            }

            events.forEach(event => {
                const card = `
                    <article class="event-card">
                        <div class="card-image">
                            <!-- يمكن استخدام مسار الصورة القادم من السيرفر إذا كان صالحاً -->
                            <img src="${event.image || 'images/web-dev-event.png'}" alt="${event.title}" onerror="this.src='images/web-dev-event.png'">
                            <span class="category-tag">فعالية</span>
                        </div>
                        <div class="card-content">
                            <h3>${event.title}</h3>
                            <p>${event.description}</p>
                            <div class="event-meta">
                                <span>📅 ${event.date}</span>
                                <span>🕒 ${event.time}</span>
                                <span>📍 ${event.location}</span>
                            </div>
                            <div class="card-footer">
                                <button class="btn-register" onclick="simulateRegistration(this)">سجل الآن</button>
                                <span class="participants">0 مشارك</span>
                            </div>
                        </div>
                    </article>
                `;
                container.innerHTML += card;
            });
        }
    } catch (error) {
        console.error("خطأ في جلب الفعاليات من السيرفر:", error);
    }
}

// تشغيل الدالة فور تحميل الصفحة
document.addEventListener('DOMContentLoaded', loadAllEvents);
