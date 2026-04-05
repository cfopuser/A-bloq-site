document.addEventListener('alpine:init', () => {
    Alpine.data('app', () => ({
        lang: 'he',
        darkMode: localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches),
        translations: window.translations,
        versions: window.versions,
        toggleTheme() {
            this.darkMode = !this.darkMode;
            localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
        },
        getImageSrc(name) {
            const folder = this.lang === 'he' ? 'Hebrew-images' : 'English-images';
            const mode = this.darkMode ? 'Darkmode' : 'Lightmode';
            return `Images/${folder}/${mode}/${name}.png`;
        },
        screenshots: [
            'status_empty', 'about_dialog', 'settings_app_mgmt', 
            'settings_security_1', 'settings_security_2', 'settings_hardware_network',
            'settings_network_apps', 'settings_apps_vpn', 'settings_vpn_ui_1', 
            'settings_ui_2', 'settings_ui_advanced', 'settings_advanced_actions_1', 
            'setup_device_owner', 'setup_welcome'
        ],
        init() {
            // Detect browser language
            this.lang = (navigator.language.startsWith('he')) ? 'he' : 'en';

            // Scroll Reveal Observer
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('section, header').forEach(el => observer.observe(el));
        }
    }));
});
