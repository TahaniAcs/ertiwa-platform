// admin.js - ملف متكامل لإدارة الفعاليات (إضافة - عرض - حذف)

window.onload = function() {
    const token = localStorage.getItem('userToken');
    if (!token) {
        alert('غير مصرح لك بدخول هذه الصفحة، يرجى تسجيل الدخول أولاً.');
        window.location.href = 'login.html'; 
        return;
    }
    // عند تحميل الصفحة، نجلب الفعاليات فوراً لعرضها في الجدول
    loadAdminEvents();
};

// 1. منطق إضافة فعالية جديدة
const addEventForm = document.getElementById('add-event-form');
if (addEventForm) {
    addEventForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const eventData = {
            title: document.getElementById('event-title') ? document.getElementById('event-title').value : "",
            description: document.getElementById('event-desc') ? document.getElementById('event-desc').value : "",
            date: document.getElementById('event-date') ? document.getElementById('event-date').value : "",
            time: document.getElementById('event-time') ? document.getElementById('event-time').value : "",
            location: document.getElementById('event-loc') ? document.getElementById('event-loc').value : "",
            image: document.getElementById('event-img') ? document.getElementById('event-img').value : ""
        };

        // استدعاء دالة الإضافة المحدثة من ملف api.js
        await addNewEvent(eventData); 
        await loadAdminEvents(); // تحديث الجدول فورياً بعد الإضافة
    });
}

// 2. دالة جلب الفعاليات وعرضها في الجدول
async function loadAdminEvents() {
    try {
        const response = await fetch('https://ertwa-backend.onrender.com/events');
        const list = document.getElementById('admin-events-list');
        
        if (!list) return; // للتأكد أننا في الصفحة الصحيحة
        
        if (!response.ok) {
            list.innerHTML = '<tr><td colspan="2" style="padding: 15px; text-align: center; color: #ef4444;">تعذر جلب الفعاليات من السيرفر.</td></tr>';
            return;
        }

        const events = await response.json();
        list.innerHTML = "";
        
        if (!Array.isArray(events) || events.length === 0) {
            list.innerHTML = '<tr><td colspan="2" style="padding: 15px; text-align: center; color: #64748b;">لا توجد فعاليات مضافة حالياً.</td></tr>';
            return;
        }
        
        events.forEach(ev => {
            list.innerHTML += `
                <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 15px;">${ev.title}</td>
                    <td style="padding: 15px; text-align: left;">
                        <button onclick="deleteEvent(${ev.id})" style="background:#ef4444; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; margin-left: 5px;">حذف</button>
                        <button onclick="editEvent(${ev.id})" style="background:#3b82f6; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer;">تعديل</button>
                    </td>
                </tr>`;
        });
    } catch (error) {
        console.error("خطأ في جلب الفعاليات:", error);
    }
}

// 3. دالة حذف فعالية
async function deleteEvent(eventId) {
    if (confirm("هل أنت متأكد من حذف هذه الفعالية؟")) {
        const token = localStorage.getItem('userToken');
        try {
            const response = await fetch(`https://ertwa-backend.onrender.com/events/${eventId}?token=${token}`, {
                method: 'DELETE',
                headers: { 'accept': 'application/json' }
            });
            
            if (response.ok) {
                alert("تم الحذف بنجاح");
                loadAdminEvents(); // تحديث الجدول فوراً
            } else {
                const data = await response.json().catch(() => ({}));
                alert(`فشل الحذف: ${data.message || 'تأكد من الصلاحيات والتوكن'}`);
            }
        } catch (error) {
            console.error("خطأ أثناء الحذف:", error);
            alert("حدث خطأ أثناء الاتصال بالسيرفر.");
        }
    }
}

// 4. دالة تعديل (مبدئية)
function editEvent(eventId) {
    alert("جارِ فتح نموذج التعديل للفعالية رقم: " + eventId);
}