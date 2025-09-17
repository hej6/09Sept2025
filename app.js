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
			cancel();
			break;
		default:
			error(404, 'pathname not found', res);
	}
});

function schedule(queryObj, res)
{
	if (!availableTimes[queryObj.day])
	{
		return error(400, 'Day not recognized', res)
	}
	
	const index = availableTimes[queryObj.day].indexOf(queryObj.time); //Stores requested time slot

	if (index !== -1)
	{
		availableTimes[queryObj.day].splice(index, 1); //Remove time slot
		
		const newAppt = //Initializes and populates newAppt
		{
			name: queryObj.name,
			day: queryObj.day,
			time: queryObj.time
		};
		appointments.push(newAppt); //Adds newAppt to array
		console.log('List of appointments: ', appointments); //Display appointments array

		res.writeHead(200, {'content-type': 'text/html'});
                res.write('Scheduled');
		res.end();
	}
	else
		error(400, 'Cannot schedule', res);
}

function cancel()
{

}

function error(status, message, res)
{
	res.writeHead(status, {'content-type': 'text/plain'});
        res.write(message);
	res.end();
}


serverObj.listen(80, function() {console.log('Listening on Port 80')});
