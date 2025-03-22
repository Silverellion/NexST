document.getElementById("darkModeToggle").addEventListener("click", function () {
    let icon = document.getElementById("modeIcon");
    let panels = document.querySelectorAll(".white-panel");
    let sidepanel = document.querySelector(".sidepanel");

    if (icon.src.includes("dark-mode.svg")) {
        icon.src = "../icons/nav/light-mode.svg";
        panels.forEach(panel => panel.classList.add("dark-mode"));
        sidepanel.classList.add("dark-mode");
    } else {
        icon.src = "../icons/nav/dark-mode.svg";
        panels.forEach(panel => panel.classList.remove("dark-mode"));
        sidepanel.classList.remove("dark-mode");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const requiredFields = form.querySelectorAll("input, select");

    form.addEventListener("submit", function (event) {
        let isValid = true;

        requiredFields.forEach(field => {
            if (field.previousElementSibling && field.previousElementSibling.querySelector(".text-danger")) {
                if (!field.value.trim()) {
                    field.style.border = "2px solid rgb(191,0,0)"
                    isValid = false;
                } else {
                    field.style.border = "";
                }
            }
        });

        if (!isValid) {
            event.preventDefault();
        } else {
            form.reset();
        }
    });
});
