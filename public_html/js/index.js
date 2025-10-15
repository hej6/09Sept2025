// Click event handlers for respective buttons
document.getElementById("schedule").addEventListener("click", sendScheduleAJAX);
document.getElementById("cancel").addEventListener("click", sendCancelAJAX);
document.getElementById("check").addEventListener("click", sendCheckAJAX);

// Interface elements
let nameBox = document.getElementById("name");
let dayBox = document.getElementById("day");
let timeBox = document.getElementById("time");
let resultsDiv = document.getElementById("results");

// AJAX for schedule functionality
function sendScheduleAJAX()
{
	let AJAXObj = new XMLHttpRequest(); // Initialize AJAX
	AJAXObj.onerror = function() { errorHandler('Connection Error. Try again later'); } // Handles errors, mostly unnecessary
	AJAXObj.onload = function() // Outputs confirmation, or error message if necessary
	{
		if (this.status == 200)
			resultsDiv.innerHTML = '<p>' + this.responseText + '</p>';
		else
			errorHandler(this.status, this.responseText);
	};

	// encodeURIComponent to properly format URL. Annoying errors without it
	AJAXObj.open // Builds URL to send to server
	(
		'GET',
        	'/schedule?name=' + encodeURIComponent(nameBox.value) +
        	'&day='  + encodeURIComponent(dayBox.value) +
        	'&time=' + encodeURIComponent(timeBox.value)
	);

	AJAXObj.send(); // Send AJAX
}

// AJAX for cancel functionality
function sendCancelAJAX()
{
	let AJAXObj = new XMLHttpRequest();
	AJAXObj.onerror = function() { errorHandler('Connection Error. Try again later'); }
	AJAXObj.onload = function()
	{
		if (this.status == 200)
            		resultsDiv.innerHTML = '<p>' + this.responseText + '</p>';
        	else
            		errorHandler(this.status, this.responseText);
    	};

    	AJAXObj.open
	(
		'GET',
        	'/cancel?name=' + encodeURIComponent(nameBox.value) +
        	'&day='  + encodeURIComponent(dayBox.value) +
        	'&time=' + encodeURIComponent(timeBox.value)
    	);

    	AJAXObj.send();
}

// AJAX for check functionality
function sendCheckAJAX()
{
	let AJAXObj = new XMLHttpRequest();
    	AJAXObj.onerror = function() { errorHandler('Connection Error. Try again later'); }
    	AJAXObj.onload = function()
    	{
        	if (this.status == 200)
            		resultsDiv.innerHTML = '<p>' + this.responseText + '</p>';
        	else
            		errorHandler(this.status, this.responseText);
    	};

    	AJAXObj.open
	(
		'GET',
        	'/check?day='  + encodeURIComponent(dayBox.value) +
        	'&time=' + encodeURIComponent(timeBox.value)
    	);

    	AJAXObj.send();
}

// Displays error message popup
function errorHandler(status, responseText)
{
	let message;
	if (responseText && responseText.trim()) // trim() removes white space for elegant formatting
	{
		message = responseText.trim();
	}
	else
	{
		message = 'Status: ' + status; // Displays generic error message. Mostly unnecessary since handled above.
	}

	alert('Error: ' + message);
}
