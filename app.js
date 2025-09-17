const http = require('http');
const url = require('url');


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
	let urlObj = url.parse(req.url, true);
	console.log(urlObj);

	switch (urlObj.pathname)
	{
		case '/schedule':
			schedule(urlObj.query, res);
			break;
		case '/cancel':
			cancel(urlObj.query, res);
			break;
		default:
			error(404, 'pathname not found', res);
	}
});

function schedule(queryObj, res)
{
	if (!queryObj.name || !queryObj.time || !queryObj.day) //Checks for missing variables
	{
		return error (400, 'Missing information', res);
	}

	if (!availableTimes[queryObj.day]) //Checks for day specifically
	{
		return error(400, 'Requested day is invalid', res);
	}
	
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
	console.log('List of time slots: ', availableTimes); //Check in console
        console.log('List of appointments: ', appointments); //Check in console

       	res.writeHead(200, {'content-type': 'text/html'});
       	res.write('Appointment has been scheduled');
        res.end();
}

function cancel(queryObj, res)
{
	if (!queryObj.name || !queryObj.time || !queryObj.day) //Checks for missing variables
        {
                return error (400, 'Missing information', res);
        }

        if (!availableTimes[queryObj.day]) //Checks for day specifically
        {
                return error(400, 'Requested day is invalid', res);
        }

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
	console.log('List of time slots: ', availableTimes);
	console.log('List of appointments: ', appointments);

	res.writeHead(200, {'content-type': 'text/html'});
	res.write('Appointment has been cancelled');
	res.end();
}

function error(status, message, res)
{
	res.writeHead(status, {'content-type': 'text/plain'});
        res.write(message);
	res.end();
}


serverObj.listen(80, function() {console.log('Listening on Port 80')});
