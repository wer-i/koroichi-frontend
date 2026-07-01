// ========================================
// 1. ДАННЫЕ
// ========================================

// Три тестовые заявки
let applications = [
    { course: 'Python для начинающих', date: '2026-07-10', payment: 'Наличными', status: 'Новая' },
    { course: 'Веб-разработка на JS', date: '2026-08-01', payment: 'Перевод по номеру телефона', status: 'Новая' },
    { course: 'Дизайн в Figma', date: '2026-09-15', payment: 'Наличными', status: 'Новая' }
];

// Пользователи (хранятся в браузере)
let users = JSON.parse(localStorage.getItem('users'));

// Если пользователей нет — создаём
if (!users || users.length === 0) {
    users = [
        { login: 'user123', password: '123456', fio: 'Иванов Иван', phone: '8(999)999-99-99', email: 'user@mail.ru' },
        { login: 'Admin', password: 'KorokNET', fio: 'Администратор', phone: '8(999)999-99-99', email: 'admin@site.com' }
    ];
    localStorage.setItem('users', JSON.stringify(users));
}

// ========================================
// 2. ФУНКЦИИ
// ========================================

// Переключение страниц
function showPage(id) {
    document.querySelectorAll('.page').forEach(function(p) {
        p.classList.remove('active');
    });
    document.getElementById(id).classList.add('active');
}

// Получить класс для статуса
function getStatusClass(status) {
    switch(status) {
        case 'Новая': return 'status-new';
        case 'Идёт обучение': return 'status-learning';
        case 'Обучение завершено': return 'status-done';
        default: return 'status-new';
    }
}

// Показать заявки пользователя
function renderApps() {
    var html = '';
    var container = document.getElementById('app-list');
    
    if (applications.length === 0) {
        html = '<p class="text-muted text-center">Заявок нет</p>';
    } else {
        for (var i = 0; i < applications.length; i++) {
            var app = applications[i];
            html += '<div class="app-item">';
            html += '<strong>' + app.course + '</strong><br>';
            html += 'Дата: ' + app.date + ' | Оплата: ' + app.payment;
            html += ' <span class="app-status ' + getStatusClass(app.status) + '">' + app.status + '</span>';
            html += '</div>';
        }
    }
    container.innerHTML = html;
}

// Показать заявки в админке (с кнопками управления)
function renderAdmin() {
    var html = '';
    var container = document.getElementById('admin-list');
    
    if (applications.length === 0) {
        html = '<p class="text-muted text-center">Заявок нет</p>';
    } else {
        for (var i = 0; i < applications.length; i++) {
            var app = applications[i];
            html += '<div class="app-item admin-app-item">';
            html += '<div class="d-flex justify-content-between align-items-center">';
            html += '<div>';
            html += '<strong>' + app.course + '</strong><br>';
            html += 'Дата: ' + app.date + ' | Оплата: ' + app.payment;
            html += ' <span class="app-status ' + getStatusClass(app.status) + '">' + app.status + '</span>';
            html += '</div>';
            html += '<div>';
            html += '<button class="btn btn-warning btn-sm status-btn" onclick="changeStatus(' + i + ', \'Идёт обучение\')">Идёт обучение</button>';
            html += '<button class="btn btn-info btn-sm status-btn" onclick="changeStatus(' + i + ', \'Обучение завершено\')">Завершено</button>';
            html += '<button class="btn btn-secondary btn-sm status-btn" onclick="changeStatus(' + i + ', \'Новая\')">Сброс</button>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
        }
    }
    container.innerHTML = html;
}

// ========================================
// 3. ИЗМЕНЕНИЕ СТАТУСА (глобальная функция)
// ========================================

function changeStatus(index, newStatus) {
    if (index >= 0 && index < applications.length) {
        applications[index].status = newStatus;
        renderAdmin();
        // Если пользователь на странице заявок — обновляем и там
        var appPage = document.getElementById('page-applications');
        if (appPage.classList.contains('active')) {
            renderApps();
        }
    }
}

// ========================================
// 4. РЕГИСТРАЦИЯ
// ========================================

document.getElementById('btn-register').onclick = function() {
    var login = document.getElementById('reg-login').value.trim();
    var pass = document.getElementById('reg-pass').value.trim();
    var fio = document.getElementById('reg-fio').value.trim();
    var phone = document.getElementById('reg-phone').value.trim();
    var email = document.getElementById('reg-email').value.trim();

    // Проверки
    if (!/^[a-zA-Z0-9]{6,}$/.test(login)) {
        alert('Логин должен содержать только латиницу и цифры, минимум 6 символов');
        return;
    }
    if (pass.length < 8) {
        alert('Пароль должен быть не менее 8 символов');
        return;
    }
    if (!/^[а-яА-Я\s]+$/.test(fio)) {
        alert('ФИО должно содержать только буквы кириллицы');
        return;
    }
    if (!/^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(phone)) {
        alert('Телефон должен быть в формате: 8(999)999-99-99');
        return;
    }
    if (!email.includes('@') || !email.includes('.')) {
        alert('Введите корректный Email');
        return;
    }

    // Проверка на существование
    var exists = false;
    for (var i = 0; i < users.length; i++) {
        if (users[i].login === login) {
            exists = true;
            break;
        }
    }
    if (exists) {
        alert('Пользователь с таким логином уже существует');
        return;
    }

    // Добавляем пользователя
    users.push({ login: login, password: pass, fio: fio, phone: phone, email: email });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Регистрация успешна');
    showPage('page-login');
};

// ========================================
// 5. ПЕРЕХОДЫ МЕЖДУ СТРАНИЦАМИ
// ========================================

document.getElementById('goto-login').onclick = function(e) {
    e.preventDefault();
    showPage('page-login');
};

document.getElementById('goto-register').onclick = function(e) {
    e.preventDefault();
    showPage('page-register');
};

// ========================================
// 6. ВХОД
// ========================================

document.getElementById('btn-login').onclick = function() {
    var login = document.getElementById('login-user').value.trim();
    var pass = document.getElementById('login-pass').value.trim();

    var user = null;
    for (var i = 0; i < users.length; i++) {
        if (users[i].login === login && users[i].password === pass) {
            user = users[i];
            break;
        }
    }

    if (!user) {
        alert('Неверный логин или пароль');
        return;
    }

    // Админ?
    if (login === 'Admin' && pass === 'KorokNET') {
        showPage('page-admin');
        renderAdmin();
        return;
    }

    // Обычный пользователь
    showPage('page-applications');
    renderApps();
};

// ========================================
// 7. ВЫХОД
// ========================================

document.getElementById('btn-logout').onclick = function() {
    document.getElementById('login-user').value = '';
    document.getElementById('login-pass').value = '';
    showPage('page-login');
};

document.getElementById('btn-admin-logout').onclick = function() {
    document.getElementById('login-user').value = '';
    document.getElementById('login-pass').value = '';
    showPage('page-login');
};

// ========================================
// 8. НОВАЯ ЗАЯВКА
// ========================================

document.getElementById('btn-new-app').onclick = function() {
    var form = document.getElementById('new-app-form');
    if (form.style.display === 'none') {
        form.style.display = 'block';
        this.textContent = 'Закрыть форму';
    } else {
        form.style.display = 'none';
        this.textContent = 'Новая заявка';
    }
};

document.getElementById('btn-submit-app').onclick = function() {
    var course = document.getElementById('app-course').value.trim();
    var date = document.getElementById('app-date').value;
    var payment = document.getElementById('app-payment').value;

    if (!course) {
        alert('Введите название курса');
        return;
    }
    if (!date) {
        alert('Выберите дату');
        return;
    }

    applications.push({ course: course, date: date, payment: payment, status: 'Новая' });

    document.getElementById('app-course').value = '';
    document.getElementById('app-date').value = '';
    document.getElementById('new-app-form').style.display = 'none';
    document.getElementById('btn-new-app').textContent = 'Новая заявка';

    renderApps();
    alert('Заявка отправлена');
};

// ========================================
// 9. СТАРТ
// ========================================

showPage('page-login');