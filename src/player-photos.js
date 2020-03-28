// ======================
// WILL FIND AND EXPORT CORRECT PLAYER PHOTO 
// ======================




export const returnPlayerPhoto = function(player) {

	console.log(player)

	let photos = {

		0: "https://i.ibb.co/TrV7HxL/neymar.png",
		1: "https://i.ibb.co/pnt3vRq/debruyne.png",
		2: "https://i.ibb.co/V9VbJcw/isco.png",
		3: "https://i.ibb.co/VmrqMGz/quintero.png",
		4: "https://i.ibb.co/pzXhC9f/trippier.png",
		5: "https://i.ibb.co/0GdcCQR/coutinho.png",
		6: "https://i.ibb.co/wKN19TF/mertens.png",
		7: "https://i.ibb.co/s5gZhSr/pogba.png",
		// NEED TO CHANGE NUMBERS TO COMPENSATE FOR 2 x SUAREZ
		9: "https://i.ibb.co/yNFBLp6/suarez.png",
		10: "https://i.ibb.co/hVfNM1T/shaquiri.png",
		11: "https://i.ibb.co/ypH1Lm9/rebic.png",
		12: "https://i.ibb.co/W3MbCMZ/messi.png", 
		13: "https://i.ibb.co/6ZXX1MG/sigurdson.png",
		14: "https://i.ibb.co/GxvcBSh/griezmann.png",
		15: "https://i.ibb.co/JtTFfwt/modric.png",
		16: "https://i.ibb.co/6BDJhVg/rakitic.png",
		17: "https://i.ibb.co/x6sGC9R/cueva.png",
		18: "https://i.ibb.co/WGtnHrZ/mbappe.png",
		19: "https://i.ibb.co/VVrybv4/mane.png"

	}



	let result;

	Object.keys(photos).forEach(function(item) {
		if (item.toString() === player.toString()) {
			result = photos[item];
			//console.log(result);
		}
	})

	return result;
}