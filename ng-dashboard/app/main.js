/**
 * Long
 */
 
$("#drop_down_selection").change(function () {
		var str = "";
		str = parseInt($("select option:selected").val()); 
		if(str == 0) {
			$("#dom_selection").hide();
			$("#vips_selection").hide();
		} else if (str == 1) {
			$("#dom_selection").show();
			$("#vips_selecion").hide();
		} else if (str == 2) {
			$("#dom_selection").hide();
			$("#vips_selection").show();
		}
});