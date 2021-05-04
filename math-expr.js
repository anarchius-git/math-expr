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
		if(["+","-","*","/","(",")"," "].indexOf(exprString.charAt(i)) > -1){
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
	postFixArr = [];
	tempStack = [];
	for(var i = 0; i < inFixArr.length; i++) {
		// call the callback function with the arrays after every iteration
		callbackFunction(postFixArr, tempStack);
		var currentToken = inFixArr[i];
		if(["+","-","*","/","^"].indexOf(currentToken) > -1){
			// This is an operator
			// Lets check the top of the temporary stack
			var tempStackTop = tempStack.slice(tempStack.length - 1);
			if(!tempStackTop.length){
				// empty temporary stack
				tempStack.push(currentToken);
			} else if((tempStackTop[0] == "(") || (opLevel(currentToken) > opLevel(tempStackTop[0]))){
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
			// closed parenthesis
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
		callbackFunction(postFixArr, tempStack);
	}
	return postFixArr;
}

function printStacks(outputStack, operatorStack){
	console.log(outputStack);
	console.log(operatorStack);
}

///////////////////////////////////////////////////////
// Callable Functions

function evalExpresion(){
	// The callable function for evaluating an expression
	var exprInput = document.getElementById("expression-input");
	var expressionString = exprInput.value;
	var tokenList = tokenizeExpression(expressionString);
	console.log(tokenList);
	var postFixList = inFixToPostFix(tokenList, printStacks);
	console.log(postFixList);
}