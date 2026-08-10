document.addEventListener('DOMContentLoaded', function() {
    const role = localStorage.getItem('userRole');
    const token = localStorage.getItem('userToken');

    // تشغيل وظائف الأدمن فقط إذا كان الحساب Admin
    if (role === 'admin') {
        loadAdminEvents();
        loadRegistrationsCount();
        loadServiceRequests(token); // إضافة جلب طلبات الخدمات
        setupAddEventForm(token);
    }
});

// 1. جلب وعرض الفعاليات الحالية في جدول الأدمن مع زر الحذف
async function loadAdminEvents() {
    const tableBody = document.getElementById('admin-events-list');
    if (!tableBody) return;

    try {
        const res = await fetch('https://ertwa-backend.onrender.com/events');
        const events = await res.json();

        tableBody.innerHTML = '';
        if (Array.isArray(events) && events.length > 0) {
            events.forEach(ev => {
                tableBody.innerHTML += `
                    <tr>
                        <td><strong>${ev.title}</strong></td>
                        <td style="text-align: left;">
                            <button onclick="deleteEvent(${ev.id})" style="background:#e11d48; color:white; border:none; padding:5px 12px; border-radius:6px; cursor:pointer;">حذف</button>
                        </td>
                    </tr>
                `;
            });
        } else {
            tableBody.innerHTML = '<tr><td colspan="2">لا توجد فعاليات مضافة حالياً.</td></tr>';
        }
    } catch (err) {
        console.error('خطأ في جلب الفعاليات:', err);
    }
}

// 2. إرسال فعالية جديدة للسيرفر
function setupAddEventForm(token) {
    const form = document.getElementById('add-event-form');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const title = document.getElementById('event-title').value;
        const desc = document.getElementById('event-desc').value;
        const date = document.getElementById('event-date').value;
        const time = document.getElementById('event-time').value;
        const loc = document.getElementById('event-loc').value;

        const url = `https://ertwa-backend.onrender.com/events?title=${encodeURIComponent(title)}&description=${encodeURIComponent(desc)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}&location=${encodeURIComponent(loc)}&image=default.png&token=${token}`;

        try {
            const res = await fetch(url, { method: 'POST' });
            if (res.ok) {
                alert('تمت إضافة الفعالية بنجاح! 🎉');
                form.reset();
                loadAdminEvents(); // إعادة تحديث الجدول
            } else {
                alert('حدث خطأ أثناء إضافة الفعالية.');
            }
        } catch (err) {
            alert('تعذر الاتصال بالسيرفر.');
        }
    });
}

// 3. حذف فعالية من السيرفر
async function deleteEvent(eventId) {
    const token = localStorage.getItem('userToken');
    if (!confirm('هل أنت متاكد من حذف هذه الفعالية؟')) return;

    try {
        const res = await fetch(`https://ertwa-backend.onrender.com/events/${eventId}?token=${token}`, { method: 'DELETE' });
        if (res.ok) {
            alert('تم حذف الفعالية بنجاح.');
            loadAdminEvents();
        } else {
            alert('فشل الحذف: قد تتطلب هذه العملية صلاحيات إضافية من السيرفر.');
        }
    } catch (err) {
        console.error('خطأ أثناء الحذف:', err);
    }
}

// 4. جلب عرض قائمة وعدد المسجلين
async function loadRegistrationsCount() {
    try {
        const res = await fetch('https://ertwa-backend.onrender.com/registrations');
        const data = await res.json();
        if (Array.isArray(data)) {
            console.log(`إجمالي المسجلين في المنصة: ${data.length}`, data);
        }
    } catch (err) {
        console.warn('تعذر جلب قائمة المسجلين حالياً.');
    }
}

// 5. جلب وعرض طلبات الخدمات القادمة من البوابة الرقمية
async function loadServiceRequests(token) {
    const requestsTable = document.getElementById('admin-requests-list');
    if (!requestsTable) return;

    try {
        const res = await fetch(`https://ertwa-backend.onrender.com/service_requests?token=${token}`);
        const requests = await res.json();

        if (res.ok && Array.isArray(requests) && requests.length > 0) {
            requestsTable.innerHTML = '';
            requests.forEach(req => {
                requestsTable.innerHTML += `
                    <tr>
                        <td><strong>${req.client_name}</strong></td>
                        <td>${req.email}</td>
                        <td>${req.service_type}</td>
                        <td>${req.description}</td>
                        <td>${req.budget} ريال / ${req.timeline}</td>
                    </tr>
                `;
            });
        }
    } catch (err) {
        console.warn('تعذر جلب طلبات الخدمات حالياً.');
    }
}
