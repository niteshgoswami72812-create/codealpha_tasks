const display = document.getElementById("display");
const history = document.getElementById("history");

const buttons = document.querySelectorAll(".btn");

let expression = "";


/* =========================
   BUTTON CLICK
========================= */

buttons.forEach(button => {

    button.addEventListener("click", () => {

        const value = button.textContent.trim();


        // Clear
        if (button.classList.contains("clear")) {

            expression = "";

            display.value = "";

            history.textContent = "";

            return;
        }


        // Delete
        if (button.classList.contains("delete")) {

            expression = expression.slice(0, -1);

            display.value = expression;

            return;
        }


        // Equal
        if (button.classList.contains("equal")) {

            calculate();

            return;
        }


        // Percentage
        if (button.classList.contains("percent")) {

            if (!expression) return;

            expression += "%";

            display.value = expression;

            return;
        }


        // Operator
        if (button.classList.contains("operator")) {

            const operator = convertOperator(value);

            addOperator(operator);

            return;
        }


        // Number / decimal
        if (button.classList.contains("number")) {

            if (value === ".") {

                addDecimal();

            } else {

                expression += value;

                display.value = expression;

            }
        }

    });

});


/* =========================
   OPERATOR CONVERSION
========================= */

function convertOperator(operator) {

    if (operator === "×") {
        return "*";
    }

    if (operator === "÷") {
        return "/";
    }

    if (operator === "−") {
        return "-";
    }

    return operator;
}


/* =========================
   ADD OPERATOR
========================= */

function addOperator(operator) {

    if (!expression) {

        if (operator === "-") {

            expression = "-";

            display.value = expression;
        }

        return;
    }


    const last = expression.slice(-1);


    if (["+", "-", "*", "/"].includes(last)) {

        expression = expression.slice(0, -1);
    }


    expression += operator;

    display.value = expression;
}


/* =========================
   DECIMAL
========================= */

function addDecimal() {

    const parts = expression.split(/[+\-*/]/);

    const currentNumber = parts[parts.length - 1];


    if (currentNumber.includes(".")) {
        return;
    }


    if (!currentNumber) {

        expression += "0.";

    } else {

        expression += ".";

    }


    display.value = expression;
}


/* =========================
   CALCULATE
========================= */

function calculate() {

    if (!expression) {
        return;
    }


    try {

        let calculation = expression;


        // Percentage
        calculation = calculation.replace(
            /(\d+(?:\.\d+)?)%/g,
            "($1/100)"
        );


        // Security check
        if (!/^[0-9+\-*/().%\s]+$/.test(calculation)) {

            throw new Error();
        }


        const result = Function(
            `"use strict"; return (${calculation})`
        )();


        if (!Number.isFinite(result)) {
            throw new Error();
        }


        history.textContent = expression
            .replace(/\*/g, "×")
            .replace(/\//g, "÷")
            .replace(/-/g, "−");


        expression = String(
            Number(result.toFixed(10))
        );


        display.value = expression;

    }

    catch {

        display.value = "Error";

        expression = "";

    }

}


/* =========================
   KEYBOARD SUPPORT
========================= */

document.addEventListener("keydown", event => {

    const key = event.key;


    // Numbers
    if (/[0-9]/.test(key)) {

        expression += key;

        display.value = expression;
    }


    // Decimal
    else if (key === ".") {

        addDecimal();
    }


    // Operators
    else if (["+", "-", "*", "/"].includes(key)) {

        addOperator(key);
    }


    // Equal
    else if (
        key === "Enter" ||
        key === "="
    ) {

        calculate();
    }


    // Delete
    else if (key === "Backspace") {

        expression = expression.slice(0, -1);

        display.value = expression;
    }


    // Clear
    else if (key === "Escape") {

        expression = "";

        display.value = "";

        history.textContent = "";
    }


    // Percentage
    else if (key === "%") {

        if (!expression) return;

        expression += "%";

        display.value = expression;
    }

});