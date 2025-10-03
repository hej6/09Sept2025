const fs = require('fs');

//Function in seperate module to fulfill extra credit parameters
function sendFile(path, res)
{
	const filePath = __dirname + '/public_html/' + path; //Always look inside public_html folder 

	fs.readFile(filePath, 'utf8', (err, data) =>
	{
		if (err)
		{
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end(err.message);
		}
		else
		{
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(data);
		}
	});
}

module.exports = sendFile;
