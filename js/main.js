const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const typewriter = document.getElementById('typewriter-text');
if (typewriter && !reducedMotion) {
    const lines = ['Welcome to my portfolio!', 'Enjoy your stay :D'];
    typewriter.replaceChildren();
    const spans = lines.map((line, index) => {
        if (index) typewriter.append(document.createElement('br'));
        const span = document.createElement('span');
        typewriter.append(span);
        return span;
    });
    let lineIndex = 0;
    let character = 0;
    function typeNext() {
        if (lineIndex >= lines.length) return;
        character += 1;
        spans[lineIndex].textContent = lines[lineIndex].slice(0, character);
        if (character >= lines[lineIndex].length) {
            lineIndex += 1;
            character = 0;
        }
        window.setTimeout(typeNext, character ? 42 : 168);
    }
    typeNext();
}
const gutter = document.getElementById('line-gutter');
const content = document.querySelector('.terminal-content');
let previousCount = 0;
function renderLineNumbers() {
    if (!gutter || !content) return;
    const contact = document.getElementById('contact');
    const height = contact ? contact.offsetTop + contact.offsetHeight : content.scrollHeight;
    const count = Math.max(1, Math.ceil(height / 28));
    if (count === previousCount) return;
    previousCount = count;
    gutter.replaceChildren(...Array.from({ length: count }, (_, index) => {
        const line = document.createElement('span');
        line.className = 'line-number';
        line.textContent = String(index + 1);
        return line;
    }));
}
renderLineNumbers();
if (content && 'ResizeObserver' in window) new ResizeObserver(renderLineNumbers).observe(content);
window.addEventListener('resize', renderLineNumbers);
const tabs = [...document.querySelectorAll('.terminal-tab')];
const sections = tabs.map(tab => document.querySelector(tab.getAttribute('href'))).filter(Boolean);
const tabBar = document.querySelector('.terminal-tab-bar');
function setActive(id) {
    tabs.forEach(tab => {
        const active = tab.getAttribute('href') === `#${id}`;
        tab.classList.toggle('active', active);
        if (active) tab.setAttribute('aria-current', 'location');
        else tab.removeAttribute('aria-current');
    });
}
function updateActiveSection() {
    const offset = (tabBar ? tabBar.getBoundingClientRect().bottom : 0) + 120;
    let current = sections[0];
    sections.forEach(section => {
        if (section.getBoundingClientRect().top <= offset) current = section;
    });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) current = sections.at(-1);
    if (current) setActive(current.id);
}
let scrollPending = false;
window.addEventListener('scroll', () => {
    if (scrollPending) return;
    scrollPending = true;
    window.requestAnimationFrame(() => {
        updateActiveSection();
        scrollPending = false;
    });
}, { passive: true });
updateActiveSection();
if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.about-box, .project-card, .contact-box').forEach(panel => {
        panel.addEventListener('pointermove', event => {
            const rect = panel.getBoundingClientRect();
            panel.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
            panel.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
        });
    });
}
const form = document.getElementById('contact-form');
if (form) {
    form.addEventListener('submit', event => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const data = new FormData(form);
        const name = String(data.get('name')).trim();
        const email = String(data.get('email')).trim();
        const message = String(data.get('message')).trim();
        if (!name || !message) {
            document.getElementById('form-status').textContent = 'Please add your name and a message.';
            return;
        }
        const subject = encodeURIComponent(`Portfolio message from ${name}`);
        const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nReply to: ${email}`);
        window.location.href = `mailto:miharia.ay@northeastern.edu?subject=${subject}&body=${body}`;
        document.getElementById('form-status').textContent = 'Your email app will open with this message. Send it there, or use the email link below.';
    });
}
