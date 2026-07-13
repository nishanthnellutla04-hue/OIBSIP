let previousInput = "";
let operator = "";
let currentInput = "";
let justCalculated = false;

const display = document.getElementById("display");
const expression = document.getElementById("expression");
const buttons = document.querySelectorAll("button");

// Ripple effect: track mouse position on buttons
buttons.forEach(function (button) {
    button.addEventListener("mousemove", function (e) {
        const rect = button.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        button.style.setProperty("--x", x + "%");
        button.style.setProperty("--y", y + "%");
    });
});

// Update display with animation
function updateDisplay(value) {
    display.value = value;
    display.classList.remove("display-animate");
    void display.offsetWidth; // trigger reflow
    display.classList.add("display-animate");

    // Auto-shrink font if value is long
    if (value.length > 12) {
        display.style.fontSize = "28px";
    } else if (value.length > 8) {
        display.style.fontSize = "34px";
    } else {
        display.style.fontSize = "";
    }
}

// Update the expression line
function updateExpression(text) {
    expression.textContent = text;
}

// Button click handler
buttons.forEach(function (button) {
    button.addEventListener("click", function () {
        const value = button.textContent;

        // Button press animation
        button.classList.remove("btn-pressed");
        void button.offsetWidth;
        button.classList.add("btn-pressed");

        if (!isNaN(value)) {
            if (justCalculated) {
                currentInput = "";
                previousInput = "";
                operator = "";
                justCalculated = false;
                updateExpression("");
            }
            currentInput += value;
            updateDisplay(previousInput + operator + currentInput);
        } else if (value === ".") {
            if (!currentInput.includes(".")) {
                currentInput += ".";
                updateDisplay(previousInput + operator + currentInput);
            }
        } else if (value === "C") {
            currentInput = "";
            previousInput = "";
            operator = "";
            updateDisplay("");
            updateExpression("");
        } else if (value === "⌫") {
            currentInput = currentInput.slice(0, -1);
            updateDisplay(previousInput + operator + currentInput);
        } else if (
            value === "+" ||
            value === "-" ||
            value === "*" ||
            value === "/"
        ) {
            if (previousInput !== "" && operator !== "" && currentInput !== "") {
                let num1 = parseFloat(previousInput);
                let num2 = parseFloat(currentInput);
                let result;
                switch (operator) {
                    case "+": result = num1 + num2; break;
                    case "-": result = num1 - num2; break;
                    case "*": result = num1 * num2; break;
                    case "/": result = num1 / num2; break;
                }
                updateExpression(previousInput + " " + operator + " " + currentInput + " =");
                previousInput = result.toString();
            } else {
                previousInput = currentInput;
            }
            operator = value;
            currentInput = "";
            updateDisplay(previousInput + " " + operator);
        } else if (value === "=") {
            if (previousInput === "" || currentInput === "" || operator === "") {
                return;
            }
            let num1 = parseFloat(previousInput);
            let num2 = parseFloat(currentInput);
            let result;

            switch (operator) {
                case "+":
                    result = num1 + num2;
                    break;
                case "-":
                    result = num1 - num2;
                    break;
                case "*":
                    result = num1 * num2;
                    break;
                case "/":
                    if (num2 === 0) {
                        updateExpression(previousInput + " ÷ " + currentInput);
                        updateDisplay("Error");
                        currentInput = "";
                        previousInput = "";
                        operator = "";
                        return;
                    }
                    result = num1 / num2;
                    break;
            }

            updateExpression(previousInput + " " + operator + " " + currentInput + " =");
            updateDisplay(result);
            currentInput = result.toString();
            previousInput = "";
            operator = "";
            justCalculated = true;
        }
    });
});