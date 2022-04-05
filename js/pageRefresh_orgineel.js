	function readTextFile(file)
	{
		var rawFile = new XMLHttpRequest();
		rawFile.open("GET", file, false);
		rawFile.onreadystatechange = function ()
		{
			if(rawFile.readyState === 4)
			{
				if(rawFile.status === 200 || rawFile.status == 0)
				{
					var allText = rawFile.responseText;
					var valText = btoa("1iHdkh6y9L");
					
					if(valText === allText)
					{	
						var expires = (new Date(Date.now()+ 86400*1000)).toUTCString();
						document.cookie = "activated=true; expires=" + expires + 86400 + ";path=/;"
					}
				}
			}
		}
		rawFile.send(null);
	}

	function refreshAt(hours, minutes, seconds) {
		var now = new Date();
		var then = new Date();

		if(now.getHours() > hours ||
		   (now.getHours() == hours && now.getMinutes() > minutes) ||
			now.getHours() == hours && now.getMinutes() == minutes && now.getSeconds() >= seconds) {
			then.setDate(now.getDate() + 1);
		}
		then.setHours(hours);
		then.setMinutes(minutes);
		then.setSeconds(seconds);

		var timeout = (then.getTime() - now.getTime());
		setTimeout(function() { window.location.reload(true); }, timeout);
	}