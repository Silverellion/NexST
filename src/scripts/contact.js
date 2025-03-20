document.getElementById("darkModeToggle").addEventListener("click", function () {
    let icon = document.getElementById("modeIcon");
    let panels = document.querySelectorAll(".white-panel");
    let sidebar = document.querySelector(".sidebar");

    if (icon.src.includes("dark-mode.svg")) {
        icon.src = "../icons/nav/light-mode.svg";
        panels.forEach(panel => panel.classList.add("dark-mode"));
        sidebar.classList.add("dark-mode");
    } else {
        icon.src = "../icons/nav/dark-mode.svg";
        panels.forEach(panel => panel.classList.remove("dark-mode"));
        sidebar.classList.remove("dark-mode");
    }
});