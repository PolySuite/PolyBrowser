function Apply()
{
if (window.opener)
{
	window.opener.returnValue = document.getElementById("poly-name-id").value;
}
window.returnValue = document.getElementById("poly-name-id").value;
self.close();
}