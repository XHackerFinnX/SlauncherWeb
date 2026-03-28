function download() {
    window.location.href =
        "https://raw.githubusercontent.com/XHackerFinnX/SLauncher/main/SLInstaller.exe";
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    });
});

// Add animation on scroll for feature cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

document.querySelectorAll(".feature-card").forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(card);
});

// Parallax effect for background circles
document.addEventListener("mousemove", (e) => {
    const circles = document.querySelectorAll(".bg-circle");
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    circles.forEach((circle, index) => {
        const speed = (index + 1) * 20;
        circle.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
});

async function getLatestCommit() {
    const owner = "XHackerFinnX";
    const repo = "SLauncher";
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`;

    // Находим элемент, куда будем вставлять версию
    const versionElement = document.getElementById("version-badge");

    try {
        const response = await fetch(url, {
            headers: {
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const commits = await response.json();
        const latest = commits[0];

        // Берем первую строку сообщения (до переноса)
        let message = latest.commit.message.split("\n")[0];

        // Если сообщение длинное — обрезаем и добавляем многоточие
        if (message.length > 30) {
            message = message.substring(0, 27) + "...";
        }

        // Обновляем текст в бейдже, если элемент найден
        if (versionElement) {
            versionElement.textContent = `Версия ${message} доступна`;
        }

        return latest;
    } catch (error) {
        console.error("❌ Ошибка при получении коммита:", error);
        // В случае ошибки можно показать запасной текст
        if (versionElement) {
            versionElement.textContent = "Версия 1.6.2 доступна";
        }
    }
}

// Запускаем функцию после загрузки DOM
document.addEventListener("DOMContentLoaded", getLatestCommit);
