/* show available bikes and gear */

function availability() {
	fetch('https://achleiveprow.tk/bikes/type/standard')
	.then((res) => res.text())
	.then((data) => console.log(data))
}