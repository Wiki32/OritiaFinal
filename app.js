document.addEventListener("DOMContentLoaded", () => {
    const doneButton = document.getElementById("done-button");
    const inputField = document.querySelector("input");

    const API_URL = "http://localhost:3000/names";

    function showNotification(message) {
        const notification = document.createElement("div");
        notification.textContent = message;
        notification.style.position = "fixed";
        notification.style.bottom = "20px";
        notification.style.right = "20px";
        notification.style.background = "#ed07ac";
        notification.style.color = "#e5e1e6";
        notification.style.padding = "10px 20px";
        notification.style.borderRadius = "10px";
        notification.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
        notification.style.fontSize = "16px";
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    async function checkName(name) {
        const response = await fetch(`${API_URL}/${encodeURIComponent(name)}`);
        if (!response.ok) return false;
        const data = await response.json();
        return data.exists;
    }

    async function addName(name) {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            showNotification(errorData.message || "An error occurred.");
            return null;
        }

        return await response.json();
    }

    if (doneButton) {
        doneButton.addEventListener("click", async () => {
            const userInput = inputField.value.trim();
            if (userInput === "") {
                showNotification("Please enter a name.");
                return;
            }

            const exists = await checkName(userInput);

            if (exists) {
                alert(`The name ${userInput} is in the database.`);
            } else {
                const result = await addName(userInput);
                if (result) {
                    showNotification(result.message);
                    inputField.value = ""; // Clear input field
                }
            }
        });
    }

    // Ensure the default theme is applied
    document.body.classList.add("light-theme");
});