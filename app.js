document.addEventListener("DOMContentLoaded", () => {
    const doneButton = document.getElementById("done-button");
    const inputField = document.querySelector("input");

    const API_URL = "https://oritiafinal.onrender.com/names"; // Corrected API URL

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
        notification.style.zIndex = "1000";
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    async function checkName(name) {
        try {
            const response = await fetch(`${API_URL}/${encodeURIComponent(name)}`);
            if (!response.ok) throw new Error("Error checking name");
            const data = await response.json();
            return data.exists;
        } catch (error) {
            console.error("Error fetching data:", error);
            showNotification("Error checking name. Please try again.");
            return false;
        }
    }

    async function addName(name) {
        try {
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
        } catch (error) {
            console.error("Error adding name:", error);
            showNotification("Error adding name. Please try again.");
            return null;
        }
    }

    if (doneButton) {
        doneButton.addEventListener("click", async () => {
            const userInput = inputField.value.trim();
            if (userInput === "") {
                showNotification("Please enter a name.");
                return;
            }

            showNotification("Checking name...");
            const exists = await checkName(userInput);

            if (exists) {
                showNotification(`The name ${userInput} is in the database.`);
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