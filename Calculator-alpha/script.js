let display = document.getElementById("display");

let buttons = document.querySelectorAll("button");

buttons.forEach(function(button){

    button.addEventListener("click", function(){

        let value = button.innerText;   

        if(value == "AC"){

            display.value = "";   

        }
        else if(value == "⌫"){

            display.value = display.value.slice(0,-1);

        }
        else if(value == "="){

            calculate();

        }
        else{

            display.value += value;

        }

    });

});

function calculate(){

    try{

        let expression = display.value.replace(/%/g,"/100");

        display.value = eval(expression);

    }
    catch{

        display.value = "Error";

        setTimeout(function(){

            display.value = "";

        },1000);

    }

}

document.addEventListener("keydown", function(e){

    let key = e.key;

    if(
        (key >= "0" && key <= "9") ||
        key == "+" ||
        key == "-" ||
        key == "*" ||
        key == "/" ||
        key == "."
    ){

        display.value += key;

    }
    else if(key == "Enter"){

        calculate();

    }
    else if(key == "Backspace"){

        display.value = display.value.slice(0,-1);

    }
    else if(key == "Escape"){

        display.value = "";

    }

});