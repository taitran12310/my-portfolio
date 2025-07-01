// Hàm lấy text theo ngôn ngữ từ window.i18nData
function getLangText(key, defaultValue) {
    const lang = window.i18n.getPreferredLanguage();
    if (window?.i18n?.data?.()?.[lang]) {
        const value = getNestedValue(window.i18n.data()[lang], key);
        return value;
    }
    return defaultValue;
}

// Function to get nested object value by dot notation
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : null;
    }, obj);
}

// Hàm lấy màu cho tech tag
function getTechColor(tech) {
    const tagColors = {
        'React': 'text-blue-600',
        'Node.js': 'text-green-600',
        'MongoDB': 'text-purple-600',
        'Vue.js': 'text-purple-600',
        'Firebase': 'text-yellow-600',
        'Tailwind': 'text-blue-600',
        'Tailwind CSS': 'text-cyan-500',
        'HTML/CSS': 'text-red-600',
        'JavaScript': 'text-yellow-600',
        'TypeScript': 'text-blue-400',
        'React Native': 'text-blue-600',
        'Expo': 'text-green-600',
        'OpenWeather API': 'text-purple-600',
        'Socket.io': 'text-blue-600',
        'Express.js': 'text-green-600',
        'Express': 'text-green-600',
        'PHP': 'text-blue-600',
        'WordPress': 'text-green-600',
        'jQuery': 'text-purple-600',
        'Bootstrap': 'text-blue-600',
        'Java': 'text-yellow-600',
        'C++': 'text-blue-600',
        'Python': 'text-green-600',
    };
    return tagColors[tech] || '';
}

function getAboutInfo() {
    const defaultValue = {
        name_label: 'Họ tên',
        name: 'Trần Tuấn Tài',
        birth_label: 'Năm sinh',
        birth: '1996',
        address_label: 'Quê quán',
        address: 'Đồng Nai',
        gender_label: 'Giới tính',
        gender: 'Nam',
        email_label: "Email",
        email: "taitran12310@gmail.com",
        phone_label: "Phone",
        phone: "+84 123 456 789"
    }
    return getLangText("about.info", defaultValue);
}

// Xuất ra window để file khác dùng
window.common = {
    getLangText,
    getTechColor,
    getNestedValue,
    getAboutInfo
};