document.addEventListener('alpine:init', () => {
    Alpine.data('app', () => ({
        lang: 'he',
        darkMode: localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches),
        translations: window.translations,
        versions: [],
        totalDownloads: '',
        toggleTheme() {
            this.darkMode = !this.darkMode;
            localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
        },
        renderMarkdown(content) {
            if (!content) return '';
            return marked.parse(content);
        },
        getImageSrc(name) {
            if (!name) return '';
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
        async init() {
            // Detect browser language
            this.lang = (navigator.language.startsWith('he')) ? 'he' : 'en';

            // Fetch dynamic changelog
            try {
                const response = await fetch('js/changelog.json');
                this.versions = await response.json();
            } catch (e) {
                console.error('Failed to load changelog:', e);
            }

            // Scroll Reveal Observer
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });

            // Hide loader
            setTimeout(() => {
                document.getElementById('shutter-loader').classList.add('loader-hidden');
            }, 800);

            document.querySelectorAll('section, header').forEach(el => observer.observe(el));

            // Fetch GitHub downloads
            this.fetchDownloads();
        },
        async fetchDownloads() {
            try {
                const response = await fetch('https://api.github.com/repos/sesese1234/SecureGuardMDM/releases');
                if (!response.ok) return;
                const releases = await response.json();
                let count = 0;
                releases.forEach(release => {
                    if (release.assets) {
                        release.assets.forEach(asset => {
                            count += asset.download_count;
                        });
                    }
                });
                if (count > 0) {
                    this.totalDownloads = count.toLocaleString();
                }
            } catch (e) {
                console.error('Failed to fetch downloads:', e);
            }
        }
    }));
});
