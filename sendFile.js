const fs = require('fs');
const path = require('path');

// Function in seperate module to fulfill extra credit parameters
function sendFile(filePath, res)
{
	const publicPath = path.join(__dirname, '/public_html/', filePath); // ONLY look inside public_html folder 
	const contentType = getType(filePath);

	fs.readFile(publicPath, (err, data) =>
	{
		if (err)
		{
			sendResponse(res, 400, err.message, 'text/plain');
		}
		else
		{
			sendResponse(res, 200, data, contentType);
		}
	});
}

function getType(filePath)
{
	const ext = path.extname(filePath).toLowerCase(); // Catch capitals, convert to lower case
	const contentTypes = // Short list of extensions, can always add more if needed
        {
                '.html': 'text/html',
                '.js': 'application/javascript',
                '.css': 'text/css',
                '.txt': 'text/plain',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg'
        };

	return contentTypes[ext];
}

// Eliminate repetition. Handles write(), writeHead(), end(). Status is status code (200, 400, etc)
function sendResponse(res, status, body, contentType = 'text/plain')
{
	res.writeHead(status, {'Content-Type': contentType});
	res.end(body);
}

// Makes available to other files
module.exports = {sendFile, sendResponse};
