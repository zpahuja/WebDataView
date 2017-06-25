/**
 * Created by Long
 */

console.log("Deactivate DOM Selection........");

if (typeof showBorderForDomSelection != 'function') {
	showBorderForDomSelection = function(){
		event.preventDefault();
	    event.target.style.border = "2px solid #FF0000";
	}
}

if (typeof hideBorderForDomSelection != 'function') {
	hideBorderForDomSelection = function (){    
		event.preventDefault();
	    event.target.style.border = "";
	}
}

document.removeEventListener("mouseover", showBorderForDomSelection);
document.removeEventListener("mouseout", hideBorderForDomSelection);