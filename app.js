const http = require('http');
const url = require('url');
const {sendFile, sendResponse} = require('./sendFile'); //Extra credit module
const path = require('path'); //Needed for path parameter in sendFile

const availableTimes = 
{
    Monday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Tuesday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Wednesday: ["1:00", "1:30", "2:00", "2:30", "3:00", "4:00", "4:30"],
    Thursday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Friday: ["1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
};
const appointments = 
[
    {name: "James", day: "Wednesday", time: "3:30" },
    {name: "Lillie", day: "Friday", time: "1:00" }
];


let serverObj = http.createServer(function (req, res)
{
	console.log(req.url);
	let urlObj = url.parse(req.url, true);
	//console.log(urlObj); //Commented out to clean up console

	switch (urlObj.pathname) //Execute based on query input by user
	{
		case '/schedule':
			schedule(urlObj.query, res);
			break;
		case '/cancel':
			cancel(urlObj.query, res);
			break;
		case '/check':
			check(urlObj.query, res);
			break;
		default:
			let filepath;
			if (urlObj.pathname === '/')
			{
				filePath = 'index.html';
			}
			else
			{
				const filePath = urlObj.pathname.slice(1); //Removes '/' for pathing
			}
			sendFile(filePath, res);
	}
});

function schedule(queryObj, res)
{
	if (!checkRequest(queryObj, res)) return; //Basic checks
	
	const index = availableTimes[queryObj.day].indexOf(queryObj.time); //Stores requested time slot

	if (index === -1) //Checks time slot
	{
		return error(400, 'Requested time slot is invalid', res);	
	}
	
	//Run code if checks pass
	availableTimes[queryObj.day].splice(index, 1); //Remove time slot

	const newAppt = //Initializes and populates newAppt
	{
		name: queryObj.name,
		day: queryObj.day,
		time: queryObj.time
	};

	appointments.push(newAppt); //Adds newAppt to array
	sendResponse(res, 200, 'Appointment has been scheduled', 'text/html');
}

function cancel(queryObj, res)
{
	if (!checkRequest(queryObj, res)) return; //Basic checks

	const index = appointments.findIndex //Store index of appointment
	(
		a => a.name == queryObj.name &&
		     a.day == queryObj.day &&
		     a.time == queryObj.time
	);

	if (index === -1) //Checks for appointment
	{
		return error(400, 'Appointment not found', res);
	}
	
	const canceled = appointments.splice(index, 1)[0]; //Remove appointment
	availableTimes[canceled.day].push(canceled.time); //Restore removed time slot 
	sendResponse(res, 200, 'Appointment has been cancelled', 'text/html');
}

function check(queryObj, res)
{
	if (!queryObj.time || !queryObj.day) //Checks for missing variables
        {
                return error (400, 'Missing information', res);
        }

        if (!availableTimes[queryObj.day]) //Checks for day specifically
        {
                return error(400, 'Requested day is invalid', res);
        }

        const index = availableTimes[queryObj.day].indexOf(queryObj.time); //Stores requested time slot

        if (index != -1) //Checks time slot
        {
		sendResponse(res, 200, 'Appointment time is available', 'text/html');
        }
	else
	{
		return error(400, 'Appointment time not available', res);
	}
}

function error(status, message, res)
{
	res.writeHead(status, {'content-type': 'text/plain'});
        res.write(message);
	res.end();
}

function checkRequest(queryObj, res)
{
	if (!queryObj.name || !queryObj.time || !queryObj.day) //Checks for missing variables
        {
                return error (400, 'Missing information', res);
        }

        if (!availableTimes[queryObj.day]) //Checks for day specifically
        {
                return error(400, 'Requested day is invalid', res);
        }

	return true;
}

serverObj.listen(80, function() {console.log('Listening on Port 80')}); //Server listening on Port 80
