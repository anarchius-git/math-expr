var gameTime = 50;

///////////////////////////////////////////////////////
// Core Functions

function tokenizeExpression(exprString){
	// This takes a string and returns a list of tokens
	var tokenList = [];
	var multiCharToken = "";
	var multiCharExists = false;
	for(var i = 0; i < exprString.length; i++){
		//traverse through each character in the string
		if(["+","-","*","/","^","(",")"," "].indexOf(exprString.charAt(i)) > -1){
			// We have a single character delimiting token
			if(multiCharExists){
				// push the multi-character token close the multi-character token collection
				multiCharExists = false;
				tokenList.push(multiCharToken);
				multiCharToken = "";
			}
			if(exprString.charAt(i) != " "){
				// ignore the space character
				tokenList.push(exprString.charAt(i));
			}
		} else {
			// not a delimiting character, so add to your multiCharToken
			multiCharExists = true;
			multiCharToken += exprString.charAt(i);
		}
	}
	if(multiCharExists){
		// push the last token
		multiCharExists = false;
		tokenList.push(multiCharToken);
		multiCharToken = "";	
	}
	return tokenList;
}

function opLevel(opChar){
	// This function returns the operator precedence level
	switch(opChar){
		case "+":
		case "-":
			return 1;
		case "*":
		case "/":
			return 2;
		case "^":
			return 3;
		default:
			return -1;
	}
}

function inFixToPostFix(inFixArr, callbackFunction){
	// Takes an infix array and returns a postfix array
	var postFixArr = [];
	var tempStack = [];
	for(var i = 0; i < inFixArr.length; i++) {
		// call the callback function with the arrays after every iteration
		callbackFunction(postFixArr, tempStack, "log-infix-postfix");
		var currentToken = inFixArr[i];
		if(["+","-","*","/","^"].indexOf(currentToken) > -1){
			// This is an operator and a delimiter
			// Lets check the top of the temporary stack
			var tempStackTop = tempStack.slice(tempStack.length - 1);
			if(!tempStackTop.length){
				// If the stack is not empty (because the slice returned an empty array)
				tempStack.push(currentToken);
			} else if((tempStackTop[0] == "(") || (opLevel(currentToken) > opLevel(tempStackTop[0]))){
				// We got an open parenthesis or the operator priority of my token in hand is more than that of the priority of the top of the stack
				tempStack.push(currentToken);
			} else {
				// operator level of current token <= the top of stack
				// pop all the operators equal or greater in precedence or till a ( is encountered
				while(tempStackTop[0] != "(" && (opLevel(currentToken) <= opLevel(tempStackTop[0]))){
					postFixArr.push(tempStack.pop());
					tempStackTop = tempStack.slice(tempStack.length - 1); // peek at the next token in the temporary array
					if(!tempStackTop.length){
						break;
					}
				}
				tempStack.push(currentToken);
			}
		} else if(currentToken == "("){
			// open parenthesis
			tempStack.push(currentToken);
		} else if(currentToken == ")"){
			// closed parenthesis, so you need to pop everything until but not including the opening parenthesis
			var poppedToken = "";
			while(poppedToken != "("){
				poppedToken = tempStack.pop();
				if(poppedToken != "("){
					// push everything in the temporary stack except for the open parenthesis
					postFixArr.push(poppedToken);
				}
			}
		} else {
			// operand
			postFixArr.push(currentToken);
		}
	}
	while(tempStack.length){
		// empty the temp stack to the output
		postFixArr.push(tempStack.pop());
		callbackFunction(postFixArr, tempStack, "log-infix-postfix");
	}
	return postFixArr;
}

function solvePostFix(postFixArr, callbackFunction){
	// Solves a postfix function
	var tempStack = [];
	while(postFixArr.length){
		var currentToken = postFixArr.shift();
		if(["+","-","*","/","^"].indexOf(currentToken) > -1){
			// We scanned an operator
			if(tempStack.length > 1){
				// At least two operands in the temporary stack
				var operand2 = parseFloat(tempStack.pop());
				var operand1 = parseFloat(tempStack.pop());
				var result;
				switch (currentToken){
					case "+":
						result = operand1 + operand2;
						break;
					case "-":
						result = operand1 - operand2;
						break;
					case "*":
						result = operand1 * operand2;
						break;
					case "/":
						result = operand1 / operand2;
						break;
					case "^":
						result = operand1 ** operand2;
						break;
					default:
				}
				tempStack.push(result);
			}
		} else {
			// We scanned an operand
			tempStack.push(currentToken);
		}
		// call the callback function with the arrays after every iteration
		callbackFunction(postFixArr, tempStack, "log-postfix-eval");
	}
	return tempStack[tempStack.length - 1]; // Return the top of the stack
}

function formatList(listName){
	// Takes a list and formats it to the innertext of an element id
	var outputString = "";
	outputString += "[ ";
	for(var i = 0; i < listName.length; i++){
		outputString += " ";
		outputString += listName[i];
		outputString += " ";
		if(i < listName.length - 1){outputString += ","}
	}
	outputString += " ]";
	return outputString;
}

function logStacks(exprStack, tempStack, elementIDString){
	// This callback function logs the exprStack an the operator stack
	var logElement = document.getElementById(elementIDString);
	logElement.innerHTML += formatList(exprStack);
	logElement.innerHTML += "<mark>" + formatList(tempStack) + "</mark>&nbsp;";
	logElement.innerHTML += "<br/>";
	//console.log(exprStack);
	//console.log(tempStack);
}

///////////////////////////////////////////////////////
// Callable Functions

function evalExpresion(){
	// The callable function for evaluating an expression
	var exprInput = document.getElementById("expression-input");
	var expressionString = exprInput.value;
	document.getElementById("output-input").innerText = expressionString;
	
	// Clear the logs before we proceed
	document.getElementById("log-infix-postfix").innerHTML = "";
	document.getElementById("log-postfix-eval").innerHTML = "";
	
	var tokenList = tokenizeExpression(expressionString);
	console.log(tokenList);
	document.getElementById("output-tokens").innerText = formatList(tokenList);
	
	var postFixList = inFixToPostFix(tokenList, logStacks);
	console.log(postFixList);
	document.getElementById("output-postfix").innerText = formatList(postFixList);
	
	var result = solvePostFix(postFixList, logStacks);
	document.getElementById("output-result").innerText = result;
}