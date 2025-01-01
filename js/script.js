document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const password_output = document.getElementById('passwordOutput');
    const strength_badge = document.getElementById('strengthBadge');
    const regenerate_btn = document.getElementById('regenerateBtn');
    const copy_btn = document.getElementById('copyBtn');
    const length_slider = document.getElementById('lengthSlider');
    const length_value = document.getElementById('lengthValue');
    const decrease_length = document.getElementById('decreaseLength');
    const increase_length = document.getElementById('increaseLength');
    const dark_theme_btn = document.getElementById('darkTheme');
    const light_theme_btn = document.getElementById('lightTheme');
    const html_element = document.documentElement;




    /**
     * Available characters for the password generator
     * @type {object}
     * @property {string} uppercase - Uppercase letters
     * @property {string} lowercase - Lowercase letters
     * @property {string} numbers - Numbers
     * @property {string} symbols - Symbols
     */
    const available_chars = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };





    /**
     * Sets the current theme of the application
     * @param {string} theme - The new theme
     */
    function set_theme(theme) {
        html_element.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        update_theme_buttons(theme);
    }



    /**
     * Updates the theme buttons' active states
     * @param {string} theme - The current theme
     */
    function update_theme_buttons(theme) {
        if (theme === 'dark') {
            dark_theme_btn.classList.add('active');
            light_theme_btn.classList.remove('active');
        } else {
            light_theme_btn.classList.add('active');
            dark_theme_btn.classList.remove('active');
        }
    }




    /**
     * Generates a random password based on selected criteria
     */
    function generate_password() {
        let chars_to_use = '';
        let password = '';

        if (uppercase.checked) chars_to_use += available_chars.uppercase;
        if (lowercase.checked) chars_to_use += available_chars.lowercase;
        if (numbers.checked) chars_to_use += available_chars.numbers;
        if (symbols.checked) chars_to_use += available_chars.symbols;

        if (!chars_to_use) {
            chars_to_use = available_chars.lowercase;
            lowercase.checked = true;
        }

        password_output.classList.add('changing');
        setTimeout(() => {
            const length = parseInt(length_slider.value);
            for (let i = 0; i < length; i++) {
                const random_index = Math.floor(Math.random() * chars_to_use.length);
                password += chars_to_use[random_index];
            }

            password_output.value = password;
            update_strength_badge(password);

            setTimeout(() => {
                password_output.classList.remove('changing');
            }, 500);
        }, 100);
    }





    /**
     * Updates the strength indicator badge
     * @param {string} password - The password to evaluate
     */
    function update_strength_badge(password) {
        const length = password.length;
        const has_upper = /[A-Z]/.test(password);
        const has_lower = /[a-z]/.test(password);
        const has_number = /[0-9]/.test(password);
        const has_symbol = /[^A-Za-z0-9]/.test(password);

        const variety_count = [has_upper, has_lower, has_number, has_symbol].filter(Boolean).length;

        let strength = '';
        let color = '';

        if (length < 8) {
            strength = 'Muy débil';
            color = 'var(--error-color)';
        } else if (length < 12 || variety_count < 2) {
            strength = 'Débil';
            color = 'var(--warning-color)';
        } else if (length < 16 || variety_count < 3) {
            strength = 'Moderada';
            color = 'var(--warning-color)';
        } else if (length < 20 || variety_count < 4) {
            strength = 'Fuerte';
            color = 'var(--success-color)';
        } else {
            strength = 'Muy fuerte';
            color = 'var(--success-color)';
        }

        strength_badge.textContent = strength;
        strength_badge.style.backgroundColor = color;
    }





    /**
     * Copies the generated password to clipboard
     */
    function copy_to_clipboard() {
        password_output.select();
        document.execCommand('copy');

        const original_text = copy_btn.textContent;
        copy_btn.textContent = '¡Copiado!';
        setTimeout(() => {
            copy_btn.textContent = original_text;
        }, 1500);
    }

    regenerate_btn.addEventListener('click', () => {
        generate_password();
        regenerate_btn.querySelector('svg').style.transform = 'rotate(0deg)';
        requestAnimationFrame(() => {
            regenerate_btn.querySelector('svg').style.transform = 'rotate(360deg)';
        });
    });

    copy_btn.addEventListener('click', copy_to_clipboard);

    length_slider.addEventListener('input', (e) => {
        length_value.textContent = e.target.value;
        generate_password();
    });




    /**
     * Decreases the length slider value by one and generates a new password
     */
    decrease_length.addEventListener('click', () => {
        const new_value = Math.max(8, parseInt(length_slider.value) - 1);
        length_slider.value = new_value;
        length_value.textContent = new_value;
        generate_password();
    });




    /**
     * Increases the length slider value by one and generates a new password
     */
    increase_length.addEventListener('click', () => {
        const new_value = Math.min(32, parseInt(length_slider.value) + 1);
        length_slider.value = new_value;
        length_value.textContent = new_value;
        generate_password();
    });




    dark_theme_btn.addEventListener('click', () => set_theme('dark'));
    light_theme_btn.addEventListener('click', () => set_theme('light'));

    const saved_theme = localStorage.getItem('theme') || 'dark';
    set_theme(saved_theme);

    [uppercase, lowercase, numbers, symbols].forEach(checkbox => {
        checkbox.addEventListener('change', generate_password);
    });

    generate_password();
}); 