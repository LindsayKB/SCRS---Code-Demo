
// This script is primarily for the initial search criteria form, but also contains some function used in the search results
var	amenities = {}; // used to store selected amenities requirements

function openSaved(){ // Used for displaying saved listings, including if user is following an email link
  $('#ajax-box').load('/controllers/saved.php #comparison-content',function(){
    $('#ajax-box').dialog( "option", "title", "Saved Listings" ).attr('rel','compare').dialog('open');
    $('.ajaxbox').attr('rel','purple');
  });
}

var priceSort = { // Used to toggle price order in search results by ascending or descending
	order : 'asc',
	toggle : function(){
		if (priceSort.order === 'asc'){
			priceSort.order = 'desc';
		} else {
			priceSort.order = 'asc';
		}
	}
};

//Set global variables
var previousBox;
var previousTitle;
var titleColor;
var newSearch;
var conductedSearch;
var showPopup = true;


$(function() {
    state = {}; // used to pass states to BBQ plugin for browser history (see show_results() in head.php for example)
    // INITIALIZE TABS
    $( "#tabs" ).tabs(); // Initialize the tabs for the search criteria page
    var $listings = $( "#listings" ).tabs({ // initialize the tabs for the search results/listings pages 
        tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
        add: function(event, ui) { /* function trriggered when a new listing tab is created */
           
            /* var state = {}, */
            /*  Get the id of this tab widget. */
            var id = 'listings',
            tabs = $('#tabs').tabs(),
 
            /* Get the index of this tab */
            current =  ui.index;
	  
            state[ id ] = current;
            $.bbq.pushState( state );	/* Switch to the new tab by changing the url hash (#) (bbq allows browser history back and forward buttons to work with using javascript) */
        }
    });
    
    // Reposition the dialog boxes for desktops when the browser is resized
    $(window).resize(function() {

      //$("#ajax-box").dialog("option", "height", $(window).height());
      $("#ajax-box").dialog("option", "position", "center");
      
      $("#ajax-box2").dialog("option", "position", "center");
      
      var left = $(".ajaxbox").css("left");
      left.replace("px", '');
      if( parseInt(left) <= 0 ){
        $(".ajaxbox").css("left", "0px");
      }
      
      left = $(".ajaxbox2").css("left");
      left.replace("px", ' ');
      if( parseInt(left) <= 0 ){
        $(".ajaxbox2").css("left", "0px");
      }
      
    });
    
    // Reposition the dialog boxes for mobile devices when the device is rotated.
    window.addEventListener("orientationchange", function() {
      $("#ajax-box").dialog("option", "position", "center");
      //$(".ui-widget-overlay").css("height", $(window).height());
    }, false);

    $.fn.digits = function(){
        return this.each(function(){
            $(this).val( $(this).val().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") );
        });
    }; // Add commas to the price box every three digits (e.g. 1,000,000)
    
    // BUYER LINK
    $('.buyer').live('click',function(){
      $("#ajax-box").dialog({
        modal: true,
        height: 'auto',
        width: '30%',
        autoOpen: false,
        dialogClass: 'ajaxbox'
    });
		$('#ajax-box').load('/controllers/messages.php #change-buyer',function(){
            $('#ajax-box').dialog( "option", "title", "Change Buyer" ).attr('rel','yourbuyers').dialog('open');
            $('.ajaxbox').attr('rel','blue');
        });
        return false;
    });
    $('.change-yes').live('click',function(){
      $('#ajax-box').dialog( "close" );
		  $('#pickmode').dialog('open');
    });
    $('.change-no').live('click',function(){
		  $('#ajax-box').dialog( "close" );
        return false;
    });

  $(document).ready(function(){
    var name = $(this).find('.name').text();
    var role = $(this).find('#role').text();
    if(role == 'guest'){
      $('.listing-broker').hide();
      $('#agent-menu').hide();
      $('#buyer-menu').hide();
      $('.tab-save').hide();
      $('#compare').hide();
      $('#compare2').hide();
      $('#guest-menu').show();
    }else if(role == 'agent'){
      $('#agent-menu').show();
      $('#guest-menu').hide();
      $('#buyer-menu').hide();
      $('#compare').hide();
      $('#compare2').hide();
    }else if(role == 'buyer'){
      $('#compare').hide();
      $('#compare2').hide();
      $('#agent-menu').hide();
      $('#guest-menu').hide();
      $('#buyer-menu').show();
    } 
  });
  
  // Resets the previous page session to the first criteria
  // page before reloading the page to go to the first page
  $('#edit').live('click',function(){
    $.get("/controllers/ajax.php", {
      setPreviousPage: 'true', //Call the PHP function
      value: "firstCriteria",
      success: function(result){
        console.log("Previous Page Set to First Criteria");
        $(document).ajaxStop(function() { location.reload(true); });
      },
      error: function(jqXHR, textStatus, errorThrown ) {
        //console.log(jqXHR);
        //console.log(textStatus);
        //console.log(errorThrown);
      }
    }); 
  });
    
    // Function performed when window is loading
    window.onload = function(){
      // Get URL
      var hash = (window.location.hash).replace('#', '');
      
      // Split the URL on ?
      str = hash.split("?");
      
      // Loads the search results using the buyer's formula
      if (str[0] == "buyerFormula") {
        conductedSearch = true;
        showPopup = false;
        if(typeof(str[2]) === 'undefined'){
          str[2] = false;
        }else{
          str[2] = str[2].split('_').join(' ');
        }
        $.ajax({
          type: "POST",
          url: "controllers/get-search-criteria.php",
          data: {"email": str[1], "name": str[2]},
          success: function(data){
            var criteria = JSON.parse(data);

            $.cookie("garage", "false");
      	    $.cookie("pool", "false");
            $.cookie("laundry", "false");
            $.cookie("doorman", "false");
            $.cookie("elevator", "false");
            $.cookie("pets", "false");
            $.cookie("fireplace", "false");
            $.cookie("healthclub", "false");
            $.cookie("prewar", "false");
            $.cookie("outdoor", "false");
            $.cookie("wheelchair", "false");
            
            $("#garage").attr("src", "images/amenities/garage.png").removeClass("selected");
            $("#pool").attr("src", "images/amenities/pool.png").removeClass("selected");
            $("#laundry").attr("src", "images/amenities/laundry.png").removeClass("selected");
            $("#doorman").attr("src", "images/amenities/doorman.png").removeClass("selected");
            $("#elevator").attr("src", "images/amenities/elevator.png").removeClass("selected");
            $("#pets").attr("src", "images/amenities/pets.png").removeClass("selected");
            $("#fireplace").attr("src", "images/amenities/fireplace.png").removeClass("selected");
            $("#healthclub").attr("src", "images/amenities/healthclub.png").removeClass("selected");
            $("#prewar").attr("src", "images/amenities/prewar.png").removeClass("selected");
            $("#outdoor").attr("src", "images/amenities/roofdeck.png").removeClass("selected");
            $("#wheelchair").attr("src", "images/amenities/wheelchair.png").removeClass("selected");
            
            $.cookie("searchName", criteria.name);
            $.cookie("minPrice", criteria.min_price);
            $.cookie("maxPrice", criteria.max_price);
            $.cookie("location", criteria.location_grade);
            $.cookie("building", criteria.building_grade);
            $.cookie("views", criteria.view_grade);
            $.cookie("bedroom", criteria.bedroom_area);
            $.cookie("living", criteria.living_area);
            $.cookie("minBedroom", criteria.bedrooms);

            if(criteria.neighborhoods.length < 7){
              criteria.neighborhoods.forEach(function(entry) {
                $.cookie(entry, "true");
              });
            }

            if(criteria.prop_type.length < 4){
              criteria.prop_type.forEach(function(entry) {
                $.cookie(entry, "true");
              });
            }
            
            criteria.amenities.forEach(function(entry){
              entry = entry.toLowerCase();
              $.cookie(entry, "true");
            });
            
            $( "#min_price" ).text(prices[criteria.min_price]["display"]).attr('data-price',prices[criteria.min_price]["price"]);
            $( "#max_price" ).text(prices[criteria.max_price]["display"]).attr('data-price',prices[criteria.max_price]["price"]);
            $("#price").slider('values',0,criteria.min_price);
            $("#price").slider('values',1,criteria.max_price);
            $("#price").slider('refresh');
            
            $("#bedrooms_slider").find("span").html(criteria.bedrooms);
            if(criteria.bedrooms == 0){
      				$('#bedrooms_box .grade_desc input').hide();
      				$('#bedrooms_box .grade_desc span').text('Studio');
      			} else if(criteria.bedrooms == 1){
      			$('#bedrooms_box .grade_desc input').show();
      				$('#bedrooms_box .grade_desc span').text(' Bedroom');
      			} else {
      			$('#bedrooms_box .grade_desc input').show();
      				$('#bedrooms_box .grade_desc span').text(' Bedrooms');
      			}
      		$( "#bedrooms" ).val( criteria.bedrooms );
            $("#bedrooms_slider").slider('value',criteria.bedrooms);
            $( "#bedrooms_slider" ).slider('refresh');
            
            $("#neighborhoods").multiselect("uncheckAll");
            $("#prop_type").multiselect("uncheckAll");
            
            if(criteria.neighborhoods.length < 7){
              criteria.neighborhoods.forEach(function(entry) {
                if(entry == "North"){
                  $("#ui-multiselect-neighborhoods-option-0").attr("checked", "true");
                }
                else if(entry == "Westside"){
                  $("#ui-multiselect-neighborhoods-option-1").attr("checked", "true");
                }
                else if(entry == "Eastside"){
                  $("#ui-multiselect-neighborhoods-option-2").attr("checked", "true");
                }
                else if(entry == "Chelsea"){
                  $("#ui-multiselect-neighborhoods-option-3").attr("checked", "true");
                }
                else if(entry == "SMG"){
                  $("#ui-multiselect-neighborhoods-option-4").attr("checked", "true");
                }
                else if(entry == "Village"){
                  $("#ui-multiselect-neighborhoods-option-5").attr("checked", "true");
                }
                else if(entry == "Lower"){
                  $("#ui-multiselect-neighborhoods-option-6").attr("checked", "true");
                }
                else{
                  // Do nothing
                }
              });
              $("#neighborhoods").val(criteria.neighborhoods);
              $("#neighborhoods-container .ui-multiselect").find(".ui-icon").next().html(criteria.neighborhoods.length + " neighborhoods");
            }
            
            if(criteria.neighborhoods.length < 7){
              criteria.neighborhoods.forEach(function(entry) {
                if(entry == "North"){
                  $("#ui-multiselect-neighborhoods-option-0").attr("checked", "true");
                }
                else if(entry == "Westside"){
                  $("#ui-multiselect-neighborhoods-option-1").attr("checked", "true");
                }
                else if(entry == "Eastside"){
                  $("#ui-multiselect-neighborhoods-option-2").attr("checked", "true");
                }
                else if(entry == "Chelsea"){
                  $("#ui-multiselect-neighborhoods-option-3").attr("checked", "true");
                }
                else if(entry == "SMG"){
                  $("#ui-multiselect-neighborhoods-option-4").attr("checked", "true");
                }
                else if(entry == "Village"){
                  $("#ui-multiselect-neighborhoods-option-5").attr("checked", "true");
                }
                else if(entry == "Lower"){
                  $("#ui-multiselect-neighborhoods-option-6").attr("checked", "true");
                }
                else{
                  // Do nothing
                }
              });
              $("#neighborhoods").val(criteria.neighborhoods);
              $("#neighborhoods-container .ui-multiselect").find(".ui-icon").next().html(criteria.neighborhoods.length + " neighborhoods");
            }

            if(criteria.prop_type.length < 4){
              var props = [];
              criteria.prop_type.forEach(function(entry) {
                if(entry == "Coop"){
                  $("#ui-multiselect-prop_type-option-0").attr("checked", "true");
                  props.push("1");
                }
                else if(entry == "Condo"){
                  $("#ui-multiselect-prop_type-option-1").attr("checked", "true");
                  props.push("2");
                }
                else if(entry == "House"){
                  $("#ui-multiselect-prop_type-option-2").attr("checked", "true");
                  props.push("4");
                }
                else if(entry == "Condop"){
                  $("#ui-multiselect-prop_type-option-3").attr("checked", "true");
                  props.push("5");
                }
                else{
                  // Do nothing
                }
              });
              $("#prop_type").val(props);
              $("#prop-container .ui-multiselect").find(".ui-icon").next().html(criteria.prop_type.length + " selected");
            }
            
            
            $("#location_grade").find("span").html(criteria.location_grade);
            $('#loc_desc').text($("#loc_"+criteria.location_grade).text());
            $("#location_grade").slider('value',criteria.location_grade);
            $("#location_grade").slider('refresh');
            
            $("#building_grade").find("span").html(criteria.building_grade);
            $('#buil_desc').text($("#buil_"+criteria.building_grade).text());
            $("#building_grade").slider('value',criteria.building_grade);
            $("#building_grade").slider('refresh');
            
            $("#views_grade").find("span").html(criteria.view_grade);
            $('#views_desc').text($("#views_"+criteria.view_grade).text());
            $("#views_grade").slider('value',criteria.view_grade);
            $("#views_grade").slider('refresh');
            
            if(size_grades[criteria.bedroom_area] !== 'XL'){
              $("#bedroom_grade").find("span").html(size_grades[criteria.bedroom_area]);
            }else{
              $("#bedroom_grade").find("span").html(size_grades[criteria.bedroom_area]).addClass("smaller");
            }
            $('#bedroom_desc').text($("#bedroom_"+criteria.bedroom_area).text());
            $("#bedroom_grade").slider('value',criteria.bedroom_area);
            $("#bedroom_grade").slider('refresh');
            
            if(size_grades[criteria.living_area] !== 'XL'){
              $("#living_grade").find("span").html(size_grades[criteria.living_area]);
            }else{
              $("#living_grade").find("span").html(size_grades[criteria.living_area]).addClass("smaller");
            }
            $('#living_desc').text($("#living_"+criteria.living_area).text());
            $("#living_grade").slider('value',criteria.living_area);
            $("#living_grade").slider('refresh');
            
            criteria.amenities.forEach(function(entry){
              entry = entry.toLowerCase();
              $("#"+entry).attr("src", "images/amenities/"+entry+"b.png").addClass("selected");
            });
          },
          error: function() {
            console.log("failed");
          }
        });
        
        window.location.hash = '';
        
        $.get("/controllers/ajax.php", {
          setListing: 'true', //Call the PHP function
          value: "false",
          success: function(result){
            console.log("Listing Saved");
          }
        });
        
        $.get("/controllers/ajax.php", {
          setOpenListings: 'true', //Call the PHP function
          value: "false",
          success: function(result){
            console.log("done");
          }
        });
        
        $.get("/controllers/ajax.php", {
          setPreviousPage: 'true', //Call the PHP function
          value: "firstCriteria",
          success: function(result){
            console.log("Previous Page Set to Results");
          }
        }); 
      }
      
      // Splits the address and calls the
      // address search results function
      if(str[0] == "address"){
        address = str[1].split('_').join(' ');
        show_results2(address);
      }
      
      // Resets all search criteria to default values
      if(str[0] == "newSearch"){
        showPopup = true;
        $.cookie("searchName", "");
        $.cookie("minPrice", 1);
        $.cookie("maxPrice", 20);
        $.cookie('location', 1);
        $.cookie("building", 1);
        $.cookie("views", 1);
		    $.cookie("bedroom", 1);
		    $.cookie("living", 1);
	      $.cookie("minBedroom", 0);
	      $.cookie("North", "false");
        $.cookie("Westside", "false");
	      $.cookie("Eastside", "false");
	      $.cookie("Chelsea", "false");
	      $.cookie("SMG", "false");
	      $.cookie("Village", "false");
	      $.cookie("Lower", "false");
	      $.cookie("Coop", "false");
	      $.cookie("Condo", "false");
	      $.cookie("House", "false");
	      $.cookie("Condop", "false");
	      $.cookie("garage", "false");
  	    $.cookie("pool", "false");
        $.cookie("laundry", "false");
        $.cookie("doorman", "false");
        $.cookie("elevator", "false");
        $.cookie("pets", "false");
        $.cookie("fireplace", "false");
        $.cookie("healthclub", "false");
        $.cookie("prewar", "false");
        $.cookie("outdoor", "false");
        $.cookie("wheelchair", "false");
        
        $( "#min_price" ).text(prices[1]["display"]).attr('data-price',prices[1]["price"]);
        $( "#max_price" ).text(prices[20]["display"]).attr('data-price',prices[20]["price"]);
        $("#price").slider('values',0,1);
        $("#price").slider('values',1,20);
        $("#price").slider('refresh');
        
        $("#bedrooms_slider").find("span").html(0);
        $('#bedrooms_box .grade_desc input').hide();
				$('#bedrooms_box .grade_desc span').text('Studio');
        $("#bedrooms_slider").slider('value',0);
        $( "#bedrooms_slider" ).slider('refresh');
        
        $("#neighborhoods").multiselect("uncheckAll");
        $("#prop_type").multiselect("uncheckAll");
        
        $("#location_grade").find("span").html(1);
        $('#loc_desc').text($("#loc_1").text());
        $("#location_grade").slider('value',0);
        $("#location_grade").slider('refresh');
        
        $("#building_grade").find("span").html(1);
        $('#buil_desc').text($("#buil_1").text());
        $("#building_grade").slider('value',0);
        $("#building_grade").slider('refresh');
        
        $("#views_grade").find("span").html(1);
        $('#views_desc').text($("#views_1").text());
        $("#views_grade").slider('value',0);
        $("#views_grade").slider('refresh');
        
        $("#bedroom_grade").find("span").html("S");
        $('#bedroom_desc').text($("#bedroom_1").text());
        $("#bedroom_grade").slider('value',1);
        $("#bedroom_grade").slider('refresh');
        
        $("#living_grade").find("span").html("S");
        $('#living_desc').text($("#living_1").text());
        $("#living_grade").slider('value',1);
        $("#living_grade").slider('refresh');
        
        $("#garage").attr("src", "images/amenities/garage.png").removeClass("selected");
        $("#pool").attr("src", "images/amenities/pool.png").removeClass("selected");
        $("#laundry").attr("src", "images/amenities/laundry.png").removeClass("selected");
        $("#doorman").attr("src", "images/amenities/doorman.png").removeClass("selected");
        $("#elevator").attr("src", "images/amenities/elevator.png").removeClass("selected");
        $("#pets").attr("src", "images/amenities/pets.png").removeClass("selected");
        $("#fireplace").attr("src", "images/amenities/fireplace.png").removeClass("selected");
        $("#healthclub").attr("src", "images/amenities/healthclub.png").removeClass("selected");
        $("#prewar").attr("src", "images/amenities/prewar.png").removeClass("selected");
        $("#outdoor").attr("src", "images/amenities/roofdeck.png").removeClass("selected");
        $("#wheelchair").attr("src", "images/amenities/wheelchair.png").removeClass("selected");
        
        window.location.hash = '';
        
        $.get("/controllers/ajax.php", {
          setListing: 'true', //Call the PHP function
          value: "false",
          success: function(result){
            console.log("Listing Saved");
          }
        });
        
        $.get("/controllers/ajax.php", {
          setOpenListings: 'true', //Call the PHP function
          value: "false",
          success: function(result){
            console.log("done");
          }
        });
        
        $.get("/controllers/ajax.php", {
          setPreviousPage: 'true', //Call the PHP function
          value: "firstCriteria",
          success: function(result){
            console.log("Previous Page Set to Results");
          }
        }); 
      }
    };
    
    // Defaults all search criteria
    $('#newSearch').live('click', function(){
      conductedSearch = false;
        $.cookie("searchName", "");
        $.cookie("minPrice", 1);
        $.cookie("maxPrice", 20);
        $.cookie('location', 1);
        $.cookie("building", 1);
        $.cookie("views", 1);
		    $.cookie("bedroom", 1);
		    $.cookie("living", 1);
	      $.cookie("minBedroom", 0);
	      $.cookie("North", "false");
        $.cookie("Westside", "false");
	      $.cookie("Eastside", "false");
	      $.cookie("Chelsea", "false");
	      $.cookie("SMG", "false");
	      $.cookie("Village", "false");
	      $.cookie("Lower", "false");
	      $.cookie("Coop", "false");
	      $.cookie("Condo", "false");
	      $.cookie("House", "false");
	      $.cookie("Condop", "false");
	      $.cookie("garage", "false");
  	    $.cookie("pool", "false");
        $.cookie("laundry", "false");
        $.cookie("doorman", "false");
        $.cookie("elevator", "false");
        $.cookie("pets", "false");
        $.cookie("fireplace", "false");
        $.cookie("healthclub", "false");
        $.cookie("prewar", "false");
        $.cookie("outdoor", "false");
        $.cookie("wheelchair", "false");
        
        $.get("/controllers/ajax.php", {
          setListing: 'true', //Call the PHP function
          value: "false",
          success: function(result){
            console.log("Listing Saved");
          }
        });
        
        $.get("/controllers/ajax.php", {
          setOpenListings: 'true', //Call the PHP function
          value: "false",
          success: function(result){
            console.log("done");
          }
        });
        
        $.get("/controllers/ajax.php", {
          setPreviousPage: 'true', //Call the PHP function
          value: "firstCriteria",
          success: function(result){
            console.log("Previous Page Set to Results");
            $(document).ajaxStop(function() { window.location = "http://homepik.com/search.php"; }); // Remove when using the reload function
          }
        }); 
    });
    
    // Sets session variables to false as they are
    // no longer being used.
    $("#redirecting").live('click', function(){
      $.get("/controllers/ajax.php", {
        setListing: 'true', //Call the PHP function
        value: "false",
        success: function(result){
          console.log("Address Search Listing False");
        }
      });
      
      $.get("/controllers/ajax.php", {
        setOpenListings: 'true', //Call the PHP function
        value: "false",
        success: function(result){
          console.log("done");
        }
      });
      
      $.get("/controllers/ajax.php", {
        setPreviousPage: 'true', //Call the PHP function
        value: "false",
        success: function(result){
          console.log("Previous Page Set to False");
          var role = $(document).find('#role').text();
            
          if(role == 'guest'){
          window.location = "http://homepik.com/users/logout.php";
          } else{
            window.location = "http://homepik.com/menu.php";
          }
        }
      });
    });
    
    // Defaults search criteria before logging user out.
    $('.logout').live('click', function(){
      
        $.cookie("minPrice", 1);
        $.cookie("maxPrice", 20);
        $.cookie('location', 1);
        $.cookie("building", 1);
        $.cookie("views", 1);
		    $.cookie("bedroom", 1);
		    $.cookie("living", 1);
	      $.cookie("minBedroom", 0);
	      $.cookie("North", "false");
        $.cookie("Westside", "false");
	      $.cookie("Eastside", "false");
	      $.cookie("Chelsea", "false");
	      $.cookie("SMG", "false");
	      $.cookie("Village", "false");
	      $.cookie("Lower", "false");
	      $.cookie("Coop", "false");
	      $.cookie("Condo", "false");
	      $.cookie("House", "false");
	      $.cookie("Condop", "false");
	      $.cookie("garage", "false");
  	    $.cookie("pool", "false");
        $.cookie("laundry", "false");
        $.cookie("doorman", "false");
        $.cookie("elevator", "false");
        $.cookie("pets", "false");
        $.cookie("fireplace", "false");
        $.cookie("healthclub", "false");
        $.cookie("prewar", "false");
        $.cookie("outdoor", "false");
        $.cookie("wheelchair", "false");
        
        location.assign("/users/logout.php");
    });
    
    
    //BEFORE INITILAIZING SLIDERS
    //FIND STORED VALUES (IF ANY)
    var minPrice = $.cookie("minPrice");
    var maxPrice = $.cookie("maxPrice");
    var locationGrade = $.cookie("location");
  	var buildingGrade = $.cookie("building");
  	var viewsGrade = $.cookie("views");
    var bedroomGrade = $.cookie("bedroom");
		var livingGrade = $.cookie("living");
	  var minBedroom = $.cookie("minBedroom");
  	var nhNorth = $.cookie("North");
  	var nhWestside = $.cookie("Westside");
  	var nhEastside = $.cookie("Eastside");
  	var nhChelsea = $.cookie("Chelsea");
  	var nhSMG = $.cookie("SMG");
  	var nhVillage = $.cookie("Village");
  	var nhLower = $.cookie("Lower");
  	var propCoop = $.cookie("Coop");
  	var propCondo = $.cookie("Condo");
  	var propHouse = $.cookie("House");
  	var propCondop = $.cookie("Condop");
  	var garage = $.cookie("garage");
  	var pool = $.cookie("pool");
  	var laundry = $.cookie("laundry");
  	var doorman = $.cookie("doorman");
  	var elevator = $.cookie("elevator");
  	var pets = $.cookie("pets");
  	var fireplace = $.cookie("fireplace");
  	var healthclub = $.cookie("healthclub");
  	var prewar = $.cookie("prewar");
  	var outdoor = $.cookie("outdoor");
  	var wheelchair = $.cookie("wheelchair");
  	
  	// IF NO STORED VAULES SET TO DEFAULT
    if(!minPrice)
    {
      minPrice = 1;
    }
    if(!maxPrice)
    {
      maxPrice = 20;
    }
    if(!locationGrade)
    {
      locationGrade = 1;
    }
    if(!buildingGrade)
    {
      buildingGrade = 1;
    }
    if(!viewsGrade)
    {
      viewsGrade = 1;
    }
    if(!bedroomGrade)
    {
      bedroomGrade = 1;
    }
    if(!livingGrade)
    {
      livingGrade = 1;
    }
    if(!minBedroom)
    {
      minBedroom = 0;
    }
    if (nhNorth == "true")
		{
		  $("#ui-multiselect-neighborhoods-option-0").attr("checked",true);
      $("option[value='North']").attr('selected','selected');
		}
		else
		{
		  //alert("Not true");
		}
		if (nhWestside == "true")
    {
      $("#ui-multiselect-neighborhoods-option-1").attr("checked",true);
      $("option[value='Westside']").attr('selected','selected');
    }
		if (nhEastside == "true")
    {
      $("#ui-multiselect-neighborhoods-option-2").attr("checked",true);
      $("option[value='Eastside']").attr('selected','selected');
    }
		if (nhChelsea == "true")
    {
      $("#ui-multiselect-neighborhoods-option-3").attr("checked",true);
      $("option[value='Chelsea']").attr('selected','selected');
    }
		if (nhSMG == "true")
    {
      $("#ui-multiselect-neighborhoods-option-4").attr("checked",true);
      $("option[value='SMG']").attr('selected','selected');
    }
		if (nhVillage == "true")
    {
      $("#ui-multiselect-neighborhoods-option-5").attr("checked",true);
      $("option[value='Village']").attr('selected','selected');
    }
		if (nhLower == "true")
    {
      $("#ui-multiselect-neighborhoods-option-6").attr("checked",true);
      $("option[value='Lower']").attr('selected','selected');
    }
    
    
		if (propCoop == "true")
    {
      $("#ui-multiselect-prop_type-option-0").attr("checked",true);
      $("option[value='1']").attr('selected','selected');
    }
		if (propCondo == "true")
    {
      $("#ui-multiselect-prop_type-option-1").attr("checked",true);
      $("option[value='2']").attr('selected','selected');
    }
		if (propHouse == "true")
    {
      $("#ui-multiselect-prop_type-option-2").attr("checked",true);
      $("option[value='4']").attr('selected','selected');
    }
		if (propCondop == "true")
    {
      $("#ui-multiselect-prop_type-option-3").attr("checked",true);
      $("option[value='5']").attr('selected','selected');
    }
		if (garage == "true")
    {
    	amenities["garage"] = true;
      $('img.amenity_icons[rel=garage]').attr('src','images/amenities/garageb.png').addClass('selected');
    }
    if (pool == "true")
    {
    	amenities["pool"] = true;
      $('img.amenity_icons[rel=pool]').attr('src','images/amenities/poolb.png').addClass('selected');
    }
    if (laundry == "true")
    {
    	amenities["laundry"] = true;
      $('img.amenity_icons[rel=laundry]').attr('src','images/amenities/laundryb.png').addClass('selected');
    }
    if (doorman == "true")
    {
    	amenities["doorman"] = true;
      $('img.amenity_icons[rel=doorman]').attr('src','images/amenities/doormanb.png').addClass('selected');
    }
    if (elevator == "true")
    {
    	amenities["elevator"] = true;
      $('img.amenity_icons[rel=elevator]').attr('src','images/amenities/elevatorb.png').addClass('selected');
    }
    if (pets == "true")
    {
    	amenities["pets"] = true;
      $('img.amenity_icons[rel=pets]').attr('src','images/amenities/petsb.png').addClass('selected');
    }
    if (fireplace == "true")
    {
    	amenities["fireplace"] = true;
      $('img.amenity_icons[rel=fireplace]').attr('src','images/amenities/fireplaceb.png').addClass('selected');
    }
    if (healthclub == "true")
    {
    	amenities["healthclub"] = true;
      $('img.amenity_icons[rel=healthclub]').attr('src','images/amenities/healthclubb.png').addClass('selected');
    }
    if (prewar == "true")
    {
    	amenities["prewar"] = true;
      $('img.amenity_icons[rel=prewar]').attr('src','images/amenities/prewarb.png').addClass('selected');
    }
    if (outdoor == "true")
    {
    	amenities["outdoor"] = true;
      $('img.amenity_icons[rel=outdoor]').attr('src','images/amenities/outdoorb.png').addClass('selected');
    }
    if (wheelchair == "true")
    {
    	amenities["wheelchair"] = true;
      $('img.amenity_icons[rel=wheelchair]').attr('src','images/amenities/wheelchairb.png').addClass('selected');
    }
    

    // LOCATION SLIDER
    $("#location_grade").slider({
        animate: true, 
        range: 'max', 
        min: 1, 
        max: 10, 
        value: locationGrade, /* default grade is 1 */
        slide: function(event, ui) { 
            /* Function to execute when sliding the location slider */
            showPopup = true;
			
			      /* var getGrade = $.cookie('location'); */
            var current_grade = '#loc_' + ui.value; /* get the selected grade */
            var locationGrade = ui.value;
            var current_desc = $(current_grade).text(); /* get the description for the selected grade (e.g. 'a safe residential street near a park') */
            $.cookie("location", locationGrade);
			
            $('#loc_desc').text(current_desc); /* insert the grade description into the text box */
            
 			if(ui.value < '10'){
				ui.sliderText =	'<span>'+ui.value+'</span>';
			} else {
				ui.sliderText =	'<span class="smaller">'+ui.value+'</span>';				
			}  

			$('#location_grade .ui-slider-handle').html(ui.sliderText); /* show the new grade in the slider handle */

        },
        create: function( event, ui ) {
          
        	/*Function to execute when initializing slider */
        	if(!locationGrade){
        	  ui.value = 1;
        	}
        	else{
        	  ui.value = locationGrade;
        	} 
        	$('#location_grade .ui-slider-handle').html('<span>'+ui.value+'</span>');
        	var current_grade = '#loc_' + ui.value; /* get the selected grade */
          var current_desc = $(current_grade).text(); /* get the description for the selected grade (e.g. 'a safe residential street near a park') */
			
            $('#loc_desc').text(current_desc);
        }
			
    }).addTouch();
    
     // BUILDING SLIDER
    $("#building_grade").slider({
        animate: true, 
        range: 'max', 
        min: 1, 
        max: 10, 
        value: buildingGrade, 
        slide: function(event, ui) {
            /* Function to execute when sliding the building slider */
            showPopup = true;

            var current_grade = '#buil_' + ui.value; /* get the selected grade */
            var buildingGrade = ui.value;
            var current_desc = $(current_grade).text();  /* get the description for the selected grade (e.g. 'a safe residential street near a park') */
			      $.cookie("building", buildingGrade);
			      
            $('#buil_desc').text(current_desc);  /* insert the grade description into the text box */
         
 			if(ui.value < '10'){
				ui.sliderText =	'<span>'+ui.value+'</span>';
			} else {
				ui.sliderText =	'<span class="smaller">'+ui.value+'</span>';				
			}           
			
			$('#building_grade .ui-slider-handle').html(ui.sliderText); /* show the new grade in the slider handle */
        },
        create: function( event, ui ) {
        	/* Function to execute when initializing slider */
        	
        	 if(!buildingGrade){
        	  ui.value = 1;
        	}
        	else{
        	  ui.value = buildingGrade;
        	} 
        	
        	$('#building_grade .ui-slider-handle').html('<span>'+ui.value+'</span>');
        	var current_grade = '#buil_' + ui.value; /* get the selected grade */
            var current_desc = $(current_grade).text();  /* get the description for the selected grade (e.g. 'a safe residential street near a park') */
			      
            $('#buil_desc').text(current_desc);
            return false;
        } 	
    }).addTouch();
    
    // VIEWS SLIDER
    $("#views_grade").slider({
        animate: true, 
        range: 'max', 
        min: 1, 
        max: 10, 
        value: viewsGrade, 
        slide: function(event, ui) {
            /* Function to execute when sliding the views slider */
            showPopup = true;
            var current_grade = '#views_' + ui.value; /* get the selected grade */
            var viewsGrade = ui.value;
            var current_desc = $(current_grade).text();  /* get the description for the selected grade (e.g. 'a safe residential street near a park') */
			      $.cookie("views", viewsGrade);
			      
            $('#views_desc').text(current_desc); /* insert the grade description into the text box */
         
 			if(ui.value < '10'){
				ui.sliderText =	'<span>'+ui.value+'</span>';
			} else {
				ui.sliderText =	'<span class="smaller">'+ui.value+'</span>';				
			}           
			
			$('#views_grade .ui-slider-handle').html(ui.sliderText); /* show the new grade in the slider handle */
        },
        create: function( event, ui ) {
        	/* Function to execute when initializing slider */
        if(!viewsGrade){
        	  ui.value = 1;
        	}
        	else{
        	  ui.value = viewsGrade;
        	} 
        	$('#views_grade .ui-slider-handle').html('<span>'+ui.value+'</span>'); 
        	var current_grade = '#views_' + ui.value; /* get the selected grade */
            var current_desc = $(current_grade).text();  /* get the description for the selected grade (e.g. 'a safe residential street near a park') */
			      
            $('#views_desc').text(current_desc);
            return false;
        } 	
			
    }).addTouch();
    
    /* Bedroom and living room grades use letters (M for medium, etc.) instead of numbers */
    size_grades = ['','S','M','L','XL'];
    
    // MASTER BEDROOM SIZE SLIDER
    $("#bedroom_grade").slider({
        animate: true, 
        range: 'max', 
        min: 1, 
        max: 4, 
        value: bedroomGrade, 
        slide: function(event, ui) {
            /* Function to execute when sliding the bedroom slider      */      
            showPopup = true;
            var current_grade = '#bedroom_' + ui.value; /* get the selected grade */
            var bedroomGrade = ui.value;
            var current_desc = $(current_grade).text();  /* get the description for the selected grade (e.g. 'a safe residential street near a park') */
            $.cookie("bedroom", bedroomGrade);

            $('#bedroom_desc').text(current_desc); /* insert the grade description into the text box */
         
 			if(size_grades[ui.value] !== 'XL'){
				ui.sliderText =	'<span>'+size_grades[ui.value]+'</span>';
			} else {
				ui.sliderText =	'<span class="smaller">'+size_grades[ui.value]+'</span>';				
			}           
			
			$('#bedroom_grade .ui-slider-handle').html(ui.sliderText); /* show the new grade in the slider handle */


        },
        create: function( event, ui ) {
        	/* Function to execute when initializing slider */
        	if(!bedroomGrade){
        	  ui.value = 1;
        	}
        	else{
        	  ui.value = bedroomGrade;
        	} 
        	$('#bedroom_grade .ui-slider-handle').html('<span>'+size_grades[ui.value]+'</span>');
        	var current_grade = '#bedroom_' + ui.value; /* get the selected grade */
            var current_desc = $(current_grade).text();  /* get the description for the selected grade (e.g. 'a safe residential street near a park') */

            $('#bedroom_desc').text(current_desc);
            return false;
        }

    }).addTouch();
    
    // LIVING ROOM SIZE SLIDER
    $("#living_grade").slider({
        animate: true, 
        range: 'max', 
        min: 1, 
        max: 4, 
        value: livingGrade, 
        slide: function(event, ui) {
           /* Function to execute when sliding the living room slider          */  
            showPopup = true;
            var current_grade = '#living_' + ui.value; /* get the selected grade */
            var livingGrade = ui.value;
            var current_desc = $(current_grade).text();  // get the description for the selected grade (e.g. 'a safe residential street near a park') */
            $.cookie("living", livingGrade);
            
            $('#living_desc').text(current_desc); /* insert the grade description into the text box */
         
 			if(size_grades[ui.value] !== 'XL'){
				ui.sliderText =	'<span>'+size_grades[ui.value]+'</span>';
			} else {
				ui.sliderText =	'<span class="smaller">'+size_grades[ui.value]+'</span>';				
			}           
			
			$('#living_grade .ui-slider-handle').html(ui.sliderText);/* show the new grade in the slider handle */


        },
        create: function( event, ui ) {
        	/* Function to execute when initializing slider */
        	if(!livingGrade){
        	  ui.value = 1;
        	}
        	else{
        	  ui.value = livingGrade;
        	} 
        	$('#living_grade .ui-slider-handle').html('<span>'+size_grades[ui.value]+'</span>');
        	var current_grade = '#living_' + ui.value; /* get the selected grade */
            var current_desc = $(current_grade).text();  // get the description for the selected grade (e.g. 'a safe residential street near a park') */
            
            $('#living_desc').text(current_desc);
            return false;
        }

    }).addTouch();

    // NEIGHBORHOODS SELECTOR
    $("#neighborhoods").multiselect({
        noneSelectedText: "All of Manhattan",
        selectedText: "# neighborhoods",
        height:'auto',
        multiple:true,
        header:false,
        position: {
            my: 'left top',
            at: 'left bottom',
            collision: 'none'
        },
         open: function(){
            	$('#amenities').addClass('shift');
            	$(this).parent().parent().parent().addClass("active");
            localStorage.sportive = $("#sportive").val();  
            	
        	},
       	close:  function(){
			$('#amenities').removeClass('shift'); 
			$(this).parent().parent().parent().removeClass("active");
            	
            } 

    });
    
    $('#neighborhoods-container').find(".ui-multiselect-checkboxes").change(function() {
      showPopup = true;
      $.cookie('neighborhoodChoice', $(this).val(), {expires: 365});
      $("#neighborhoods").val($.cookie('neighborhoodChoice'));
    });

    // PROPERTY TYPE SELECTOR
    $("#prop_type").multiselect({
      noneSelectedText: "Any Property Type",
      selectedText: "# selected",
      height:"auto",
      multiple:true,
      header:false,
      position: {
        my: 'left top',
        at: 'left bottom',
        collision: 'none'
      },
      open: function(){
        $('.continue').addClass('shift1');
          localStorage.property = $("#prop_type").val();  
      },
     	close:  function(){
    	  $('.continue').removeClass('shift1');
      }
    });
    
    $('#prop-container').find(".ui-multiselect-checkboxes").change(function() {
      showPopup = true;
      $.cookie('propertyChoice', $(this).val(), {expires: 365});
      $("#prop_type").val($.cookie('propertyChoice'));
    });

    // MINIMUM FLOOR (disabled)
    $("#min_floor").spinner();
		
    // PRICE	
    // Translate the slider value into price increments. "price" is the value submitted in the search request;
    // "display" is what's shown to the user.
		prices = [
			'', // no slider value of 0
			{"price":100000,"display":"100K"}, // if slider value is 1
			{"price":200000,"display":"200K"}, // if slider value is 2
			{"price":300000,"display":"300K"}, // if slider value is 3
			{"price":400000,"display":"400K"}, // if slider value is 4
			{"price":500000,"display":"500K"}, // if slider value is 5
			{"price":600000,"display":"600K"}, // if slider value is 6
			{"price":700000,"display":"700K"}, // if slider value is 7
			{"price":800000,"display":"800K"}, // if slider value is 8
			{"price":900000,"display":"900K"}, // if slider value is 9
			{"price":1000000,"display":"1M"}, // if slider value is 10
			{"price":1100000,"display":"1.1M"}, // if slider value is 11
			{"price":1200000,"display":"1.2M"}, // if slider value is 12
			{"price":1300000,"display":"1.3M"}, // if slider value is 13
			{"price":1400000,"display":"1.4M"}, // if slider value is 14
			{"price":1500000,"display":"1.5M"}, // if slider value is 15
			{"price":1600000,"display":"1.6M"}, // if slider value is 16
			{"price":1700000,"display":"1.7M"}, // if slider value is 17
			{"price":1800000,"display":"1.8M"}, // if slider value is 18
			{"price":1900000,"display":"1.9M"}, // if slider value is 19
			{"price":2000000,"display":"2M"}, // if slider value is 20
			{"price":2250000,"display":"2.25M"}, // if slider value is 21
			{"price":2500000,"display":"2.5M"}, // if slider value is 22
			{"price":2750000,"display":"2.75M"}, // if slider value is 23
			{"price":3000000,"display":"3M"}, // if slider value is 24
			{"price":3500000,"display":"3.5M"}, // if slider value is 25
			{"price":4000000,"display":"4M"}, // if slider value is 26
			{"price":6000000,"display":"6M"}, // if slider value is 27
			{"price":8000000,"display":"8M"}, // if slider value is 28
			{"price":12000000,"display":"12M"}, // if slider value is 29
			{"price":25000000,"display":"25M"}, // if slider value is 30
			{"price":50000000,"display":"50M"}, // if slider value is 31
			{"price":99000000,"display":"99M"},	 // if slider value is 32
		];

		// PRICE SLIDER
    $( "#price" ).slider({
        animate: true,
        range: 'true',
        min: 1,
        max: 32,
        values: [minPrice, maxPrice ],
        slide: function( event, ui ) {
            /* Function to execute when sliding the price slider */
            showPopup = true;
            //Make sure both arrows have at least a .1 gap
            if ( ( ui.values[ 0 ] + 0 ) >= ui.values[ 1 ] ) {
                return false;
          }
				
            var min_value = ui.values[0], max_value = ui.values[1];
            
            $.cookie("minPrice", min_value);
            $.cookie("maxPrice", max_value);
				
			/* set the display price for the user (e.g. 2.5M), and the data-price attribute will contain the value collected by the search function (e.g. 2500000) */
            $( "#min_price" ).text(prices[min_value]["display"]).attr('data-price',prices[min_value]["price"]);
            $( "#max_price" ).text(prices[max_value]["display"]).attr('data-price',prices[max_value]["price"]);

        },
        create: function( event, ui ) {
        	/* Function to execute when initializing slider */
        	$('#price .ui-slider-handle').first().html('<span>›</span');
        	$('#price .ui-slider-handle').first().attr("id", "min_price_slider");
        	$('#price .ui-slider-handle').last().html('<span>‹</span');
        	$('#price .ui-slider-handle').last().attr("id", "max_price_slider");
        	return false;
        }
    }).addTouch();
    if(minPrice != "null"){
      $( "#min_price" ).text(prices[minPrice]["display"]).attr('data-price',prices[minPrice]["price"]);
    }
    else{
      $( "#min_price" ).text(prices[1]["display"]).attr('data-price',prices[1]["price"]);
    }
    if(maxPrice != "null"){
      $( "#max_price" ).text(prices[maxPrice]["display"]).attr('data-price',prices[maxPrice]["price"]);
    }
    else{
      $( "#max_price" ).text(prices[20]["display"]).attr('data-price',prices[20]["price"]);
    }
				
    // NUMBER OF BEDROOMS		
    $( "#bedrooms_slider" ).slider({
        range: 'max',
        min: 0,
        max: 8,
        value: minBedroom,
        slide: function( event, ui ) {
            /* Function to execute when sliding the bedrooms slider    */       
            showPopup = true;
            var bedrooms = ui.value;		
            $( "#bedrooms" ).val( bedrooms);
            var minBedroom = bedrooms;
            $.cookie("minBedroom", minBedroom);

            ui.sliderText =	'<span>'+ui.value+'</span>';
			$('#bedrooms_box .ui-slider-handle').html(ui.sliderText); //* show the new grade in the slider handle */
			if(bedrooms == 0){
				$('#bedrooms_box .grade_desc input').hide();
				$('#bedrooms_box .grade_desc span').text('Studio');
			} else if(bedrooms == 1){
			$('#bedrooms_box .grade_desc input').show();
				$('#bedrooms_box .grade_desc span').text(' Bedroom');
			} else {
			$('#bedrooms_box .grade_desc input').show();
				$('#bedrooms_box .grade_desc span').text(' Bedrooms');
			}
				

        },
        create: function( event, ui ) {
        	/* Function to execute when initializing slider */
        	if(!minBedroom){
        	  ui.value = 0;
        	}
        	else{
        	  ui.value = minBedroom;
        	}
        	$( "#bedrooms" ).val(minBedroom);
        	$('#bedrooms_box .ui-slider-handle').html('<span>'+ui.value+'</span>');
          if(minBedroom == 0){
    				$('#bedrooms_box .grade_desc input').hide();
    				$('#bedrooms_box .grade_desc span').text('Studio');
    			} else if(minBedroom == 1){
    			$('#bedrooms_box .grade_desc input').show();
    				$('#bedrooms_box .grade_desc span').text(' Bedroom');
    			} else {
    			$('#bedrooms_box .grade_desc input').show();
    				$('#bedrooms_box .grade_desc span').text(' Bedrooms');
    			}
    			return false;
        }
    }).addTouch();
    $( "#bedrooms" ).val(minBedroom);
    
    $( "#bedrooms_slider_register" ).slider({
        range: 'max',
        min: 0,
        max: 8,
        value: minBedroom,
        slide: function( event, ui ) {
            /* Function to execute when sliding the bedrooms slider    */       
			      showPopup = true;
            var bedrooms = ui.value;							
            $( "#bedrooms" ).val(bedrooms);
            var minBedroom = bedrooms; 
            $.cookie("minBedroom", minBedroom);
            
            ui.sliderText =	'<span>'+ui.value+'</span>';
			$('#bedrooms_box .ui-slider-handle').html(ui.sliderText); //* show the new grade in the slider handle */
			if(bedrooms == 0){
				$('#bedrooms_box .grade_desc input').hide();
				$('#bedrooms_box .grade_desc span').text('Studio');
			} else if(bedrooms == 1){
			$('#bedrooms_box .grade_desc input').show();
				$('#bedrooms_box .grade_desc span').text(' Bedroom');
			} else {
			$('#bedrooms_box .grade_desc input').show();
				$('#bedrooms_box .grade_desc span').text(' Bedrooms');
			}
				

        },
        create: function( event, ui ) {
        	/* Function to execute when initializing slider */
        	  ui.value = 0;
        	$('#bedrooms_box .ui-slider-handle').html('<span>'+ui.value+'</span>');
        	if(minBedroom == 0){
    				$('#bedrooms_box .grade_desc input').hide();
    				$('#bedrooms_box .grade_desc span').text('Studio');
    			} else if(minBedroom == 1){
    			$('#bedrooms_box .grade_desc input').show();
    				$('#bedrooms_box .grade_desc span').text(' Bedroom');
    			} else {
    			$('#bedrooms_box .grade_desc input').show();
    				$('#bedrooms_box .grade_desc span').text(' Bedrooms');
    			}
    			return false;
        }
    }).addTouch();
    $( "#bedrooms" ).val(minBedroom);


    // ROOM DIMENSIONS 
    // Translate width and length into square foot area 
    function numeric(numeric) {
        var replaced = numeric.replace(/[^0-9\.]/g,'');
        return replaced;
    }

    $("#bedroom_width,#bedroom_length,#living_width,#living_length").change(function(){
			 
        var bedroom_width = $("#bedroom_width").val(),
        bedroom_length = $("#bedroom_length").val(),
        living_width = $("#living_width").val(),
        living_length = $("#living_length").val();
			
        bedroom_width = numeric(bedroom_width);
        bedroom_length = numeric(bedroom_length);
        living_width = numeric(living_width);
        living_length = numeric(living_length);
			
			
        var bedroom_area = (bedroom_length * bedroom_width),
        living_area = (living_length * living_width);
			
        if (bedroom_area == 0){
             bedroom_area = (bedroom_length + bedroom_width);
            }
        if (living_area == 0){
             living_area = (living_length + living_width);
            }

		
        if (bedroom_area > 0){
            $("#bedroom_area").text(bedroom_area);
        }
        if (living_area > 0){
            $("#living_area").text(living_area);
        }
		
			
    });


    // Prevent letters or symbols from being entered into numerical fields by the user
    $('.numbersOnly').keyup(function () {
        this.value = this.value.replace(/[^0-9\.]/g,'');
    }) ; 
    $('.numbersOnly2').keyup(function () {
        this.value = this.value.replace(/[^0-9\,]/g,'');
    }); 
    $('.numbersOnly2').blur(function () {
        $(this).digits();
    }); 

    // AJAX DIALOG BOX 
    // JQuery UI dialog to be filled and reused with any content later via AJAX
    $("#ajax-box").dialog({
        modal: true,
        height: 'auto',
        width: '800px',
        maxWith: '80%',
        autoOpen: false,
        dialogClass: 'ajaxbox'
    });

    // ADDING A COMMENT IN THE AGENT FOLDER
     $("#add-comment").live('click', function(){
        var list_num = $(this).attr('data-list-numb');
        var buyer = $(this).attr('data-buyer');
        var agent = $("#agent").attr('data-user');
        var list_url = 'http://homepik.com/controllers/add-comment.php?listnum=' + list_num + '&buyer=' + buyer;
        $("#ajax-box2").dialog({
              modal: true,
              height: '400',
              width: 'auto',
              autoOpen: false,
              dialogClass: 'ajaxbox',
              buttons: {
                "Add Comment": function(){
                  $(this).dialog("destroy");
                  listing = $('#ajax-box2 #listing').val();	
                  user = $('#ajax-box2 #user').val();	
                  agent = $('#ajax-box2 #agent').val();	
                  console.log(agent);
                  newcomments = $('#ajax-box2 #comments').val();
                  $.get("/controllers/ajax.php", {
                      addComment: 'true', //Call the PHP function
                      user: user,
                      comments: newcomments,
                      listing: listing, //Put variables into AJAX variables
                      success: function(result){
                        $(document).ajaxStop(function() { location.reload(true); });
                      }
                  });
                },
                "Cancel": function(){
                  $(this).dialog("destroy");
                }
              },
              close: function() {
                $( this ).dialog( "destroy" );
              }
          });
                $('#ajax-box2').load(list_url,function(){
                $('#ajax-box2').dialog( "option", "title", "Add A Comment" ).dialog('open');
                $('#ajax-box2 #listing').val(list_num);
                $('#ajax-box2 #user').val(buyer);
                $('#ajax-box2 #agent').val(agent);
                $("#ajax-box2").parent().attr('rel', 'orange');
                $(this).css('font-weight','normal');
                
                if((navigator.userAgent.match(/iPad/i) != null) == true && ((Math.abs(window.orientation) === 0) || (Math.abs(window.orientation) === 180))){
                  $('.ajaxbox').css("left", "25%")
                }
          
               });
     });
     
          $("#browse").live('click', function(){
        $("#ajax-box2").dialog({
              modal: true,
              height: '400',
              width: 'auto',
              autoOpen: false,
              dialogClass: 'ajaxbox',
              buttons: {
                "Browse": function(){
                  $(this).dialog("destroy");
                  $.get("/controllers/ajax.php", {
                      addComment: 'true', //Call the PHP function
                      user: user,
                      comments: newcomments,
                      listing: listing, //Put variables into AJAX variables
                      success: function(result){
                        $(document).ajaxStop(function() { location.reload(true); });
                      }
                  });
                },
                "Cancel": function(){
                  $(this).dialog("destroy");
                }
              },
              close: function() {
                $( this ).dialog( "destroy" );
              }
          });
                $('#ajax-box2').load(list_url,function(){
                $('#ajax-box2').dialog( "option", "title", "Add A Comment" ).dialog('open');
                $('#ajax-box2 #listing').val(list_num);
                $('#ajax-box2 #user').val(buyer);
                $('#ajax-box2 #agent').val(agent);
                $("#ajax-box2").parent().attr('rel', 'orange');
                $(this).css('font-weight','normal');
                
                if((navigator.userAgent.match(/iPad/i) != null) == true && ((Math.abs(window.orientation) === 0) || (Math.abs(window.orientation) === 180))){
                  $('.ajaxbox').css("left", "25%")
                }
          
               });
     });
     
     // EDITING OR DELETING A COMMENT IN THE AGENT FOLDER
     $("#edit-comment").live('click', function(){
        var list_num = $(this).attr('data-list-numb');
        var buyer = $(this).attr('data-buyer');
        var agent = $("#agent").attr('data-user');
        var comments = $(this).attr('comment');
        var list_url = 'http://homepik.com/controllers/add-comment.php?listnum=' + list_num + '&buyer=' + buyer;
        $("#ajax-box2").dialog({
              modal: true,
              height: '400',
              width: 'auto',
              autoOpen: false,
              dialogClass: 'ajaxbox',
              buttons: {
                "Delete Comment": function(){
                  listing = $('#ajax-box2 #listing').val();	
                  user = $('#ajax-box2 #user').val();	
                  agent = $('#ajax-box2 #agent').val();	
                  console.log(agent);
                  $.get("/controllers/ajax.php", {
                      deleteComment: 'true', //Call the PHP function
                      user: user,
                      listing: listing, //Put variables into AJAX variables
                      success: function(result){
                        $(document).ajaxStop(function() { location.reload(true); });
                      }
                  });
                  
                  $(this).dialog("destroy");
                },
                "Update Comment": function(){
                  $(this).dialog("destroy");
                  listing = $('#ajax-box2 #listing').val();	
                  user = $('#ajax-box2 #user').val();	
                  agent = $('#ajax-box2 #agent').val();	
                  console.log(agent);	
                  newcomments = $('#ajax-box2 #comments').val();
                  $.get("/controllers/ajax.php", {
                      addComment: 'true', //Call the PHP function
                      user: user,
                      comments: newcomments,
                      listing: listing, //Put variables into AJAX variables
                      success: function(result){
                        $(document).ajaxStop(function() { location.reload(true); });
                      }
                  });
                },
                "Cancel": function(){
                  $(this).dialog("destroy");
                }
              },
              close: function() {
                $( this ).dialog( "destroy" );
              }
          });
                $('#ajax-box2').load(list_url,function(){
                $('#ajax-box2').dialog( "option", "title", "Edit A Comment" ).dialog('open');
                $('#ajax-box2 #listing').val(list_num);
                $('#ajax-box2 #user').val(buyer);
                $('#ajax-box2 #agent').val(agent);
                $("#ajax-box2 #comments").val(comments);
                $("#ajax-box2").parent().attr('rel', 'orange');
                $(this).css('font-weight','normal');
                
                if((navigator.userAgent.match(/iPad/i) != null) == true && ((Math.abs(window.orientation) === 0) || (Math.abs(window.orientation) === 180))){
                  $('.ajaxbox').css("left", "25%")
                }
               });
     });
     
     // ADDING A COMMENT IN THE BUYER FOLDER
     $("#add-comment-buyer").live('click', function(){
        var list_num = $(this).attr('data-list-numb');
        var buyer = $(this).attr('data-buyer');
        var agent = $("#agent").attr('data-user');
        var list_url = 'http://homepik.com/controllers/add-comment.php?listnum=' + list_num + '&buyer=' + buyer;
        $("#ajax-box2").dialog({
              modal: true,
              height: '400',
              width: 'auto',
              autoOpen: false,
              dialogClass: 'ajaxbox',
              buttons: {
                "Add Comment": function(){
                  $(this).dialog("destroy");
                  listing = $('#ajax-box2 #listing').val();	
                  user = $('#ajax-box2 #user').val();	
                  agent = $('#ajax-box2 #agent').val();
                  newcomments = $('#ajax-box2 #comments').val();
                  
                  $.get("/controllers/ajax.php", {
                      addComment: 'true', //Call the PHP function
                      user: user,
                      agent: agent,
                      comments: newcomments,
                      listing: listing, //Put variables into AJAX variables
                      success: function(result){
                        $(document).ajaxStop(function() { location.reload(true); });
                      }
                  });
                },
                "Cancel": function(){
                  $(this).dialog("destroy");
                }
              },
              close: function() {
                $( this ).dialog( "destroy" );
              }
          });
                $('#ajax-box2').load(list_url,function(){
                $('#ajax-box2').dialog( "option", "title", "Add A Comment" ).dialog('open');
                $('#ajax-box2 #listing').val(list_num);
                $('#ajax-box2 #user').val(buyer);
                $('#ajax-box2 #agent').val(agent);
                $("#ajax-box2").parent().attr('rel', 'orange');
                $(this).css('font-weight','normal');
                if((navigator.userAgent.match(/iPad/i) != null) == true && ((Math.abs(window.orientation) === 0) || (Math.abs(window.orientation) === 180))){
                  $('.ajaxbox').css("left", "25%")
                }
               });
     });
     
     // EDITING OR DELETING COMMENT IN THE BUYER FOLDER
     $("#edit-comment-buyer").live('click', function(){
        var list_num = $(this).attr('data-list-numb');
        var buyer = $(this).attr('data-buyer');
        var comments = $(this).attr('comment');
        var agent = $("#agent").attr('data-user');
        var list_url = 'http://homepik.com/controllers/add-comment.php?listnum=' + list_num + '&buyer=' + buyer;
        $("#ajax-box2").dialog({
              modal: true,
              height: '400',
              width: 'auto',
              autoOpen: false,
              dialogClass: 'ajaxbox',
              buttons: {
                "Delete Comment": function(){
                  listing = $('#ajax-box2 #listing').val();	
                  user = $('#ajax-box2 #user').val();	
                  agent = $('#ajax-box2 #agent').val();	
                  console.log(agent);
                  $.get("/controllers/ajax.php", {
                      deleteComment: 'true', //Call the PHP function
                      user: user,
                      agent: agent,
                      listing: listing, //Put variables into AJAX variables
                      success: function(result){
                        $(document).ajaxStop(function() { location.reload(true); });
                      }
                  });
                  
                  $(this).dialog("destroy");
                },
                "Update Comment": function(){
                  $(this).dialog("destroy");
                  listing = $('#ajax-box2 #listing').val();	
                  user = $('#ajax-box2 #user').val();	
                  agent = $('#ajax-box2 #agent').val();	
                  console.log(agent);	
                  newcomments = $('#ajax-box2 #comments').val();
                  
                  console.log(newcomments);
                  $.get("/controllers/ajax.php", {
                      addComment: 'true', //Call the PHP function
                      user: user,
                      agent: agent,
                      comments: newcomments,
                      listing: listing, //Put variables into AJAX variables
                      success: function(result){
                        $(document).ajaxStop(function() { location.reload(true); });
                      }
                  });
                },
                "Cancel": function(){
                  $(this).dialog("destroy");
                }
              },
              close: function() {
                $( this ).dialog( "destroy" );
              }
          });
                $('#ajax-box2').load(list_url,function(){
                $('#ajax-box2').dialog( "option", "title", "Edit A Comment" ).dialog('open');
                $('#ajax-box2 #listing').val(list_num);
                $('#ajax-box2 #user').val(buyer);
                $('#ajax-box2 #agent').val(agent);
                $("#ajax-box2 #comments").val(comments);
                $("#ajax-box2").parent().attr('rel', 'orange');
                $(this).css('font-weight','normal');
                if((navigator.userAgent.match(/iPad/i) != null) == true && ((Math.abs(window.orientation) === 0) || (Math.abs(window.orientation) === 180))){
                  $('.ajaxbox').css("left", "25%")
                }
               });
     });

    $(document).ready(function(){
    var show= $('#showhidediv').val();
    if(show == " ") {
        $('#make-primary').show();
        $('#remove-primary').hide();
    }
    else if(show != " ")
    {
        $('#remove-primary').show();
        $('#make-primary').hide();
    }
});
    
    
  //Detect back button
  var detectBackOrForward = function(onBack, onForward) {
    hashHistory = [window.location.hash];
    historyLength = window.history.length;
 
  return function() {
    var hash = window.location.hash, length = window.history.length;
    if (hashHistory.length && historyLength == length) {
      if (hashHistory[hashHistory.length - 2] == hash) { //If you went backward
        hashHistory = hashHistory.slice(0, -1);
        onBack();
        $('#ajax-box').dialog("close");
        $('.scrollwrapper2').addClass("unhide-div");
       
      } else { //If you went forward
        hashHistory.push(hash);
        onForward();
        //alert("Number 2");
        //Do nothing
      }
    } else {
      hashHistory.push(hash);
      historyLength = length;
      //Do nothing
    }
  };
};

window.addEventListener("hashchange", detectBackOrForward(
  function() {
    console.log("back");
    
    // GO BACK TO THE SECOND CRITERIA PAGE IF ON SEARCH RESULTS
    URL = window.location.href;
    if(URL.indexOf("tabs=1") > -1 && URL.indexOf("listings") == -1){
      $.get("/controllers/ajax.php", {
        setPreviousPage: 'true', //Call the PHP function
        value: "secondCriteria",
        success: function(result){
          console.log("Previous Page Set to Second Criteria");
          window.location.replace("/search.php");
          $(".continue.details").click();
        }
      }); 
    }
  },
  function() {
    console.log("forward");
  }
)); 

    
    // BUYER FOLDER
    // If user followed an email link, open the folder right away:
    if ((typeof loadSaved !== 'undefined' &&loadSaved == true) || window.location.href.substring(window.location.href.length - 11) == '?saved=true') {
			openSaved();
		}
    $('#compare').click(function(){
      	openSaved();
      	console.log('yes');
        return false;
    });

    $('#compare2').click(function(){
    	var thisUrl = $(this).attr('rel');
        $('#ajax-box').load( thisUrl + ' #comparison-content',function(){
            $('#ajax-box').dialog( "option", "title", "Compare Saved Listings" ).attr('rel','compare').dialog('open');
            $('.ajaxbox').attr('rel','purple');
        });
        previousBox = thisUrl + ' #comparison-content';
        previousTitle = "Compare Saved Listings";
        titleColor = 'purple';
        return false;
    });
    
    // OPENS AGENT SELECTION POPUP IF THE BUYER HAS TWO AGENTS IF THERE
    // AREN'T TWO AGENTS THEN IT REDIRECTS TO THE BUYER'S FOLDER WITH
    // THE AGENTS EMAIL IN THE URL IF THEY HAVE ONLY ONE AGENT
    $('.my-listings').click(function(){
      console.log("clicked");
      var buyer = $(this).attr('data-buyer');
      var name = $(this).attr('data-name');
      var agent = $("#agent").attr('data-user');
      
      console.log(agent);
      console.log(buyer);
      
      $.ajax({
          type: "POST",
          url: "/controllers/check-buyer.php",
          data: {"email": buyer},
          success: function(data){
            console.log("success");
            var info = jQuery.parseJSON(data);
            
            if((info.P_agent != "" && info.P_agent != null) && (info.P_agent2 != "" && info.P_agent2 != null)){
              $("#ajax-box").dialog({
                  modal: true,
                  height: 'auto',
                  width: 'auto',
                  left: '150px',
                  autoOpen: false,
                  dialogClass: 'ajaxbox'
              });
                  $('#ajax-box').load('/controllers/agents.php #comparison-content',function(){
                      $('#ajax-box').dialog( "option", "title", "Agents" ).dialog('open');
                      $('.ajaxbox').attr('rel','purple').find('.ui-dialog-title').text(name+"'s Agents");
                      $('.ajaxbox').attr('rel','purple');
                      $("#ajax-box").dialog("option", "position", "center");
                      
                      var left = $(".ajaxbox").css("left");
                      left.replace("px", '');
                      if( parseInt(left) <= 0 ){
                        $(".ajaxbox").css("left", "0px");
                      }
                  });
                  
                  previousBox = '/controllers/agents.php #comparison-content';
                  previousTitle = "Agents";
                  return false;
            }
            else{
              console.log("else");
              if(agent != "" && agent != null){
                window.location = "http://homepik.com/controllers/saved.php?user="+buyer+"&agent="+agent;
              }
              else{
                window.location = "http://homepik.com/controllers/saved.php?user="+buyer;
              }
            }
          }
      });
        return false;
    });
    
    // REDIRECTS TO THE BUYER'S PROFILE
    $('.my-profile').click(function(){
      window.location = "http://homepik.com/controllers/buyer-profile.php";
      return false;
    });
    
    // OPENS A BUYER'S FOLDER WHEN CLICKED IN MANAGE BUYER'S
    $('.buyer-row').live('click',function(){ 
        var buyer = $(this).attr('data-user'),
        name = $(this).attr('data-name'),
        agent = $("#agent").attr("data-user");

        window.location = "http://homepik.com/controllers/saved.php?user="+buyer+"&agent="+agent;
    });

    // REDIRCTS TO THE BUYER'S FOLDER WITH THE AGENT'S EMAIL
    // IN THE URL TO BE USED IN THE SAVED.PHP FOLDER
    $('.agent-row').live('click',function(){ 
        var agent = $(this).attr('data-user');
        var buyer = $(this).attr('data-buyer'),
        name = $(this).attr('data-name');

        window.location = "http://homepik.com/controllers/saved.php?user="+buyer+"&agent="+agent;
    });
    
    $("#testing-btn").live('click',function(){
      console.log("clicked");
    });

    // OPENS A POPUP AND DISPLAYS ONE OF THE MESSAGES
    // LOCATED IN THE MESSAGE FOLDER WITH THE GIVE ID
    $('.buyerNote').live('click',function(){
        $("#ajax-box").dialog({
          modal: true,
          height: 'auto',
          width: '20%',
          autoOpen: false,
          dialogClass: 'ajaxbox'
      });
          $('#ajax-box').load('/controllers/messages.php #buyer-note',function(){
            $('#ajax-box').dialog( "option", "title", "Note" ).attr('rel','yourbuyers').dialog('open');
            $('.ajaxbox').attr('rel','blue');
        });
          return false;
    });
    
    // OPENS THE ADD BUYER POPUP AND PERFORMS VARIOUS CHECKS
    // IF VALID CALLS AJAX TO ADD BUYER ELSE PRINTS ERROR MESSAGES
    $('#add-buyer').live('click',function(){
      $('#ajax-box2').dialog('destroy');
        $("#ajax-box").dialog({
          modal: true,
          height: 'auto',
          width: '500px',
          autoOpen: false,
          dialogClass: 'ajaxbox',
          buttons: {
            "Add Buyer": function(){
              var firstname = $('#buyer-firstname').val(),
        		  lastname = $('#buyer-lastname').val(),
        		  email = $('#buyer-email').val(),
        		  agentEmail = $('#agent-email').val();
        		  var emailReg = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        		  var emailValid = emailReg.test(email);
        	  
        	    // CHECK IF ANY OF THE INPUTS ARE BLANK IF SO DISPLAY ERROR POPUP
          	  if(firstname == "" || lastname == "" || email == ""){
          	    $("#ajax-box2").dialog({
                      modal: true,
                      height: 'auto',
                      width: '275px',
                      autoOpen: false,
                      dialogClass: 'ajaxbox',
                      buttons: {
                        Ok: function(){
                          $(this).dialog("destroy");
                        }
                      },
                      close: function() {
                        $( this ).dialog( "destroy" );
                      }
                  });
                  $('#ajax-box2').load('/controllers/messages.php #addBuyerInfo',function(){
                      $('#ajax-box2').dialog( "option", "title", "Buyer Information" ).dialog('open');
                      $('#ajax-box2').parent().attr('rel', 'purple');
                  });
          	  }
          	  // CHECK IF THE EMAIL IS VALID IF NOT DISPLAY ERROR POPUP
          	  else if (!emailValid) {
          	    $("#ajax-box2").dialog({
                      modal: true,
                      height: 'auto',
                      width: '275px',
                      autoOpen: false,
                      dialogClass: 'ajaxbox',
                      buttons: {
                        Ok: function(){
                          $(this).dialog("destroy");
                        }
                      },
                      close: function() {
                        $( this ).dialog( "destroy" );
                      }
                  });
                  $('#ajax-box2').load('/controllers/messages.php #invalidBuyerEmail',function(){
                      $('#ajax-box2').dialog( "option", "title", "Invalid Email" ).dialog('open');
                       $('#ajax-box2').parent().attr('rel', 'purple');
                  });
          	  }
          	  // CHECK IF THE EMAIIL IS A BELLMARC EMAIL IF SO DISPLAY ERROR POPUP
          	  else if(email.indexOf("@bellmarc.com") != -1){
          	    $("#ajax-box2").dialog({
                      modal: true,
                      height: 'auto',
                      width: '275px',
                      autoOpen: false,
                      dialogClass: 'ajaxbox',
                      buttons: {
                        Ok: function(){
                          $(this).dialog("destroy");
                        }
                      },
                      close: function() {
                        $( this ).dialog( "destroy" );
                      }
                  });
                  $('#ajax-box2').load('/controllers/messages.php #addBuyerEmail',function(){
                      $('#ajax-box2').dialog( "option", "title", "Buyer Email" ).dialog('open');
                       $('#ajax-box2').parent().attr('rel', 'purple');
                  });
          	  }
          	  else{
          	    $.ajax({
                    type: "POST",
                    url: "/controllers/check-buyer.php",
                    data: {"email": email},
                    success: function(data){
                      console.log("success");
                      var info = jQuery.parseJSON(data);
                      
                      // CHECK IF ACCOUNT EXISTS IF NOT CREATE ONE
              	      if(info == null){
              	        
              	        $('#ajax-box').dialog( "option", "title", "Add A New Buyer" ).dialog('destroy');
              	        
                    	  $.get("/controllers/ajax.php", {
                          addBuyer: 'true',
                          firstname: firstname,
                          lastname: lastname,
                          email: email,
                          success: function(result){
                            $(document).ajaxStop(function() { window.location = "http://homepik.com/controllers/buyers.php"; });
                          }
                        });
                        
                    		// Add the new buyer to the Buyer Mode and Save Listing popups
                    		$('#buyerMode, #buyerSave').prepend('<option value="'+email+'">'+lastname+', '+firstname+'</option>');
                    		var buyer = {};
                    		  
                    		// Make the new buyer the current Active Buyer
                    		buyer.name = '+lastname+', '+firstname+';
                    		buyer.email = email;
                    		$('#buyerMode').val(buyer.email);        
              	       }
              	       else{
              	         // IF ACCOUNT EXISTS CHECK IF THEY HAVE AT LEAST ONE AGENT
              	         // IF NOT ASSIGN AGENT AS ONE OF BUYER'S AGENTS
              	         if(info.P_agent == "" || info.P_agent == null){
              	           $.get("/controllers/ajax.php", {
                                AddPrimary: 'true',
                                email: email
                            });
                          
                            $("#ajax-box2").dialog({
                                modal: true,
                                height: 'auto',
                                width: '265px',
                                autoOpen: false,
                                dialogClass: 'ajaxbox',
                                buttons: {
                                  Ok: function(){
                                    $(this).dialog("destroy");
                                    window.location = "http://homepik.com/controllers/buyers.php";
                                  }
                                },
                                close: function() {
                                  $( this ).dialog( "destroy" );
                                }
                            });
                            $('#ajax-box2').load('/controllers/messages.php #addBuyerPrimary',function(){
                                $('#ajax-box2').dialog( "option", "title", "Adding Buyer" ).dialog('open');
                                 $('#ajax-box2').parent().attr('rel', 'purple');
                            });
                            
                            $('#ajax-box').dialog( "option", "title", "Add A New Buyer" ).dialog('close');
              	         }
              	         // IF THEY HAVE ONE AGENT CHECK IF THEY HAVE TWO AGENTS
              	         // IF ONLY HAVE ONE ASSIGN AGENT AS SECOND AGENT 
              	         else if((info.P_agent != '' && info.P_agent != null) && (info.P_agent2 == '' || info.P_agent2 == null)){
              	           
              	           $.ajax({
                            type: "POST",
                            url: "http://homepik.com/controllers/check-agent.php",
                            data: {"getEmail":"true", "id":info.P_agent},
                            success: function(data){
                              var aEmail = JSON.parse(data);
                              
                              // CHECK IF EMAIL OF AGENT TRYING TO ADD IS ALREADY ASSIGNED
                              // IF NOT ADDED AGENT, IF SO DISPLAY POPUP WITH MESSAGE
                  	           if(agentEmail != aEmail){
                    	           $.get("/controllers/ajax.php", {
                                      AddPrimary2: 'true',
                                      email: email
                                  });
                
                                  $("#ajax-box2").dialog({
                                      modal: true,
                                      height: 'auto',
                                      width: '265px',
                                      autoOpen: false,
                                      dialogClass: 'ajaxbox',
                                      buttons: {
                                        Ok: function(){
                                          $(this).dialog("destroy");
                                          window.location = "http://homepik.com/controllers/buyers.php";
                                        }
                                      },
                                      close: function() {
                                        $( this ).dialog( "destroy" );
                                      }
                                  });
                                  $('#ajax-box2').load('/controllers/messages.php #addBuyerPrimary2',function(){
                                      $('#ajax-box2').dialog( "option", "title", "Adding Buyer" ).dialog('open');
                                       $('#ajax-box2').parent().attr('rel', 'purple');
                                  });
                                  
                                  $('#ajax-box').dialog( "option", "title", "Add A New Buyer" ).dialog('close');
                  	           }
                  	           else{
                  	             $("#ajax-box2").dialog({
                                      modal: true,
                                      height: 'auto',
                                      width: '265px',
                                      autoOpen: false,
                                      dialogClass: 'ajaxbox',
                                      buttons: {
                                        Ok: function(){
                                          $(this).dialog("destroy");
                                          window.location = "http://homepik.com/controllers/buyers.php";
                                        }
                                      },
                                      close: function() {
                                        $( this ).dialog( "destroy" );
                                      }
                                  });
                                  $('#ajax-box2').load('/controllers/messages.php #alreadyAgent',function(){
                                      $('#ajax-box2').dialog( "option", "title", "Adding Buyer" ).dialog('open');
                                       $('#ajax-box2').parent().attr('rel', 'purple');
                                  });
                                  
                                  $('#ajax-box').dialog( "option", "title", "Add A New Buyer" ).dialog('close');
                  	           }
                              }
              	           });  
              	         }
              	         // IF THEY HAVE TWO AGENTS DISPLAY POPUP WITH ALERT
              	         else{
              	           $("#ajax-box2").dialog({
                                modal: true,
                                height: 'auto',
                                width: '265px',
                                autoOpen: false,
                                dialogClass: 'ajaxbox',
                                buttons: {
                                  Ok: function(){
                                    $(this).dialog("destroy");
                                    $('#ajax-box').dialog( "option", "title", "Add A New Buyer" ).dialog('destroy');
                                  }
                                },
                                close: function() {
                                  $( this ).dialog( "destroy" );
                                }
                            });
                            $('#ajax-box2').load('/controllers/messages.php #addBuyerExists',function(){
                                $('#ajax-box2').dialog( "option", "title", "Buyer Exists" ).dialog('open');
                                 $('#ajax-box2').parent().attr('rel', 'purple');
                            });
              	         }
              	       }
              	       
                    },
                    error: function(){
                      console.log("failed");
                    }
                  });
          	  }
              $(this).dialog("destroy");
            }
          },
          close: function() {
            $( this ).dialog( "destroy" );
          }
      });
          $('#ajax-box').load('/controllers/add-buyer.php .addBuyer',function(){
            $('#ajax-box').dialog( "option", "title", "Add A New Buyer" ).attr('rel','yourbuyers').dialog('open');
            $('.ajaxbox').attr('rel','blue');
            $('.ajaxbox').css('display','block');
            if(screen.width == 768){
              $('.ajaxbox').css('left','30%');
            }
            if(screen.width == 1024){
              $('.ajaxbox').css('left','20%');
            }
        });
        previousBox = '/controllers/add-buyer.php .addBuyer';
        previousTitle = "Add A New Buyer";
          return false;
    });

    // BUTTON IN THE GUEST REGISTRATION POPUP. REDIRECTS TO GUEST REGISTRATION
    $('.guest-register button').live('click', function(){
        var register = $('input[name=member]:checked').val();
        if(register == 'Yes')
        {
          window.location = "http://homepik.com/controllers/guest-register.php";
        }
        else
        {
          $('#ajax-box').dialog("close");
        }
	
        return false;

    });
    
      $('.guest-register-complete button').live('click', function(){
        var firstname = $('#guest-firstname').val(),
        lastname = $('#guest-lastname').val(),
        email = $('#guest-email').val(),
        telephone = $('#guest-telephone').val(),
        code = $('#guest-agentcode').val(),
        comments = $('#guest-comments').val(),
        register = $('input[name=guest-terms]:checked').val();
	
        $.get("/controllers/ajax.php", {
            guesterRegister: 'true',
            firstname: firstname,
            lastname: lastname,
            email: email,
            telephone: telephone,
            code: code,
            comments: comments,
            register: register,
        }, 
        
        alert("You have registered!"));
	
        return false;

    });
    
    // EMAIL SAVED LISTINGS
    $('#email_saved').live('click',function(){
        var buyer = $(this).attr('data-buyer');
        
        //$('#ajax-box').dialog( "option", "title", "My Listings" ).dialog('close');
        $("#ajax-box2").dialog({
            modal: true,
            height: 'auto',
            width: 'auto',
            autoOpen: false,
            dialogClass: 'ajaxbox'
        });
        $('#ajax-box2').load('/controllers/email-chart.php #email-chart-buyer',function(){
            $('#ajax-box2').dialog( "option", "title", "Email List" ).dialog('open');
             $('#ajax-box2').parent().attr('rel', 'purple');
             if((navigator.userAgent.match(/iPad/i) != null) == true && ((Math.abs(window.orientation) === 0) || (Math.abs(window.orientation) === 180))){
              $('.ajaxbox').css("left", "25%")
            }
        });
        
        return false;

    });
    
    //LOG IN AS GUEST
     $('.guest-login').live('click',function(){
         window.location = "http://homepik.com/search.php";
    });  
    
    // TOGGLE TO ARCHIVED BUYERS IN MANAGE BUYERS
    $('#archivedBuyers').live('click', function(){
      $(".archivedBuyers").toggle();
      $(".activeBuyers").toggle();
      
      $("#archivedBuyers").toggle();
      $("#activeBuyers").toggle();
    });
    
    // TOGGLE TO ACTIVE BUYERS IN MANAGE BUYERS
    $('#activeBuyers').live('click', function(){
      $(".archivedBuyers").toggle();
      $(".activeBuyers").toggle();
      
      $("#archivedBuyers").toggle();
      $("#activeBuyers").toggle();
    });
    
    // ARCHIVE BUYER (when buyer is no longer active)
    $('#archive-buyer').live('click',function(){
        var buyer = $(this).attr('data-user');
        console.log("Buyer" + buyer);
        
        $.get("/controllers/ajax.php", {
          archiveBuyer: 'true',
          buyer: buyer,
          success: function(result){
            console.log("success");
            $(document).ajaxStop(function() { location.reload(true); });
          },
          error: function(){
            console.log("failed");
          }
        });

        return false;

    });

    // ACTIVATE BUYER (bring buyer back from archive)
    $('#activate-buyer').live('click',function(){
        var buyer = $(this).attr('data-user');

        $.get("/controllers/ajax.php", {
          activateBuyer: 'true',
          buyer: buyer,
          success: function(result){
            $(document).ajaxStop(function() { location.reload(true); });
          }
        });

        return false;

    });

    // DELETE BUYER
    $('#delete-buyer').live('click',function(){
        var buyer = $(this).attr('data-user');
        var name = $(this).attr('data-name');
        
        $("#ajax-box2").dialog({
          autoOpen: false,
          height: 240,
          width: 365,
          modal: true,
          buttons: {   
            Yes: function() {   
              
              $.get("/controllers/ajax.php", {
                deleteBuyer: 'true',
                buyer: buyer,
                success: function(result){
                  $(document).ajaxStop(function() { location.reload(true); });
                }
              });

              $( this ).dialog( "destroy" );

            },
            No: function() {    
              $( this ).dialog( "destroy" );
            }  
          },
          close: function() {
            $( this ).dialog( "destroy" );
          }   
        });
         $('#ajax-box2').load('/controllers/messages.php #deleteBuyer',function(){
            $('#ajax-box2').dialog( "option", "title", "Permanently Delete Buyer" ).dialog('open');
            $("#ajax-box2").parent().attr('rel', 'orange');
            $("#deleteBuyer").find("#name").html(name);
         });
    });

    // CLEAR SAVED LISTING IN BUYER FOLDER
    $('#clear_saved').live('click', function(){
      
      $("#ajax-box2").dialog({
          autoOpen: false,
          height: 225,
          width: 275,
          modal: true,
          buttons: {   
            Yes: function() {   
              var buyer = $("#buyerEmail").attr('data-user');
              var agent = $("#agent").attr('data-user');
              
              console.log(buyer);
      
              $.get("/controllers/ajax.php", {
                  clear_saved: 'true', 
                  buyer: buyer,
                  agent: agent,
                  success: function(result){
                    $(document).ajaxStop(function() { location.reload(true); });
                  }
              });
              
              $( this ).dialog( "destroy" );
            },
            No: function() {    
              $( this ).dialog( "destroy" );
            }  
          },
          close: function() {
            $( this ).dialog( "destroy" );
          }
        });
         $('#ajax-box2').load('/controllers/messages.php #clearListings',function(){
            $('#ajax-box2').dialog( "option", "title", "Clear All Listings" ).dialog('open');
            $("#ajax-box2").parent().attr('rel', 'green');
            if((navigator.userAgent.match(/iPad/i) != null) == true && ((Math.abs(window.orientation) === 0) || (Math.abs(window.orientation) === 180))){
              $('.ajaxbox').css("left", "25%")
            }
         });
      
        return false;
    });

    // SAVE ALL LISTINGS IN AGENT FOLDER TO BUYER
    $('#save_all_listings').live('click', function(){
        var user = $(this).attr('data-buyer');

        $("#ajax-box2").dialog({
          autoOpen: false,
          height: 300,
          width: 350,
          modal: true,
          dialogClass: 'ajaxbox',
          buttons: {
              "Save": function() {
                var buyer = $("#buyerSave").val();
                console.log(buyer);
                
                $.get("/controllers/ajax.php",{
                  saveAll: 'true',
                  buyer: buyer,
                  success: function(data){
                    //console.log(data);
                  }
                }); 
              
                $( this ).dialog( "destroy" );
              },
              "Cancel": function(){
                $( this ).dialog( "destroy" );
              }
          },
          close: function() {
            $( this ).dialog( "destroy" );
          }
        });
        $('#ajax-box2').load('/controllers/save-all-listings.php #save-all-listings',function(){
            $('#ajax-box2').dialog( "option", "title", "Save All Listings to Buyer" ).dialog('open');
            $("#ajax-box2").parent().attr('rel', 'green');
            if((navigator.userAgent.match(/iPad/i) != null) == true && ((Math.abs(window.orientation) === 0) || (Math.abs(window.orientation) === 180))){
              $('.ajaxbox').css("left", "25%")
            }
        });
    });
    
    $('#open_email_queued').live('click', function(){
        var buyer = $(this).attr('data-buyer');

        $("#ajax-box2").dialog({
        modal: true,
        height: 'auto',
        width: 'auto',
        autoOpen: false,
        dialogClass: 'ajaxbox'
    });
        $('#ajax-box2').load('/controllers/email-chart.php #email-chart-agent',function(){
            $('#ajax-box2').dialog( "option", "title", "Email List" ).dialog('open');
            $('#ajax-box2').parent().attr('rel','purple');
            if((navigator.userAgent.match(/iPad/i) != null) == true && ((Math.abs(window.orientation) === 0) || (Math.abs(window.orientation) === 180))){
              $('.ajaxbox').css("left", "25%")
            }
        });

        return false;
    }); 

    // EMAIL EVERYTHING IN AGENT'S SAVED FOLDER
   $('.email-chart-submit').live('click', function(){
        var agent = $("#ajax-box2").find( "#agent" ).val();
        var toEmail = $( "#end-email" ).val();
        var comments = $( "#comments" ).val();
        
        console.log(agent);

         $.get("/controllers/ajax.php", {
            agentEmail: agent,
            toEmail: toEmail,
            comments: comments,
            emailChart: 'true',
        }, function(data){
            $('#ajax-box2').dialog( "option", "title", "Email List" ).dialog('close');
        }); 
        
        return false;
    }); 
    
     // EMAIL EVERYTHING IN BUYER'S SAVED FOLDER
   $('.email-chart-buyer-submit').live('click', function(){
        var buyer = $("#buyerEmail").attr('data-user');
        var toEmail = $( "#end-email" ).val();
        var comments = $("#ajax-box2").find( "#comments" ).val();
        var agent = $("#agent").attr('data-user');
        
        console.log(buyer);

         $.get("/controllers/ajax.php", {
            email: buyer,
            toEmail: toEmail,
            comments: comments,
            agent: agent,
            email_saved: 'true', 
        }, function(data){
            $('#ajax-box2').dialog( "option", "title", "Email List" ).dialog('close');
        }); 
        
        return false;
    });  
    
    // DELETE ONE LISTING IN AGENT FOLDER
    $('#clear_one_queued').live('click', function(){
        var del_id = $(this).attr('rel');
        var buyer = $(this).attr('data-buyer');
        //Put listing ID in variable

        $.get("/controllers/ajax.php", {
            clear_one_queued: 'true', 
            buyer: buyer,
            delete_id: del_id
        }, function(){
            $(document).ajaxStop(function() { location.reload(true); });
         }); 
         return false;
    });

    // DELETE ONE LISTING FROM BUYER'S FOLDER
    $('#clear_one_saved').live('click', function(){
      var delete_id = $(this).attr('rel');
      var buyer = $(this).attr('data-buyer');
      var agent = $("#agent").attr('data-user');

      $("#ajax-box2").dialog({
          autoOpen: false,
          height: 225,
          width: 275,
          modal: true,
          buttons: {   
            Yes: function() {
              
              $.get("/controllers/ajax.php", {
                  clear_one_saved: 'true', 
                  buyer: buyer,
                  agent: agent,
                  delete_id: delete_id,
                  success: function(result){
                    $(document).ajaxStop(function() { location.reload(true); });
                  }
               });
               
              $( this ).dialog( "destroy" );
            },
      
            No: function() {    
              $( this ).dialog( "destroy" );
              
            }  
          },
          close: function() {
            $( this ).dialog( "destroy" );
          }
        });
         $('#ajax-box2').load('/controllers/messages.php #clearListing',function(){
            $('#ajax-box2').dialog( "option", "title", "Delete Listing" ).dialog('open');
            $("#ajax-box2").parent().attr('rel', 'green');
            if((navigator.userAgent.match(/iPad/i) != null) == true && ((Math.abs(window.orientation) === 0) || (Math.abs(window.orientation) === 180))){
              $('.ajaxbox').css("left", "25%")
            }
         });
      return false;
    });
    
    // DELETE EVERYTHING IN AGENT'S SAVED FOLDER
    $('#clear_queued').live('click', function(){
      
      $("#ajax-box2").dialog({
          autoOpen: false,
          height: 225,
          width: 275,
          modal: true,
          buttons: {   
            Yes: function() {   
              var buyer = $(this).attr('data-buyer');
    		
        			$.get("/controllers/ajax.php", {
        				clear_queued: 'true', 
        				buyer: buyer,
        				success: function(result){
                  $(document).ajaxStop(function() { location.reload(true); });
                }
        			});
      			
              $( this ).dialog( "destroy" );
            },
    
            No: function() {    
              $( this ).dialog( "destroy" );
            }  
          },
          close: function() {
            $( this ).dialog( "destroy" );
          }
        });
         $('#ajax-box2').load('/controllers/messages.php #clearListings',function(){
            $('#ajax-box2').dialog( "option", "title", "Clear All Listings" ).dialog('open');
            $("#ajax-box2").parent().attr('rel', 'green');
            if((navigator.userAgent.match(/iPad/i) != null) == true && ((Math.abs(window.orientation) === 0) || (Math.abs(window.orientation) === 180))){
              $('.ajaxbox').css("left", "25%")
            }
         });
        return false;
    });
    
    // GET BROWSER POP-UP
    $('#browse').live( "click", function() {
        alert("Browse click event worked!");
    });
    
    // CLICKING A SAVED LISTING IN A BUYER FOLDER
    // OR AGENT FOLDER DISPLAYS THAT LISTINGS
    $('.saved-row').live('click', function(){
        $('#ajax-box2').dialog("destroy");
        var list_num = $(this).attr('data-list-numb');
        var code = $(this).attr('session-code');
        var address = $(this).attr('data-address');
        var list_url = 'http://homepik.com/controllers/profile.php?list_numb=' + list_num + '&code=' + code;
        dataId = $(this).attr('data-id');

        $.get("/controllers/ajax.php", {
            savedViewed: 'true', 
            listNum: list_num, 
            dataId: dataId
        }, function(){ });
        $(this).css('font-weight','normal');
        
        window.location = 'http://homepik.com/controllers/single-listing.php?list_numb=' + list_num;
    });

    // PRINT
    $('.print').live('click',function(){
        window.print();
    });
    
    // COLUMN SORTING IN RESULTS PAGES
    $('.ui-jqgrid-sortable').click(function(){
      var column = $(this).attr('id');
      column = column.replace('jqgh_','');
      var sortorder = 'desc';
      grid = $("#list");
        
  		if (column == 'price'){
  		  priceSort.toggle(); // toggles price between ascending or descending
  		  sortorder = priceSort.order;
  		}	
		
		  if(column != "amen"){
		    $("#list").setGridParam({
            sortname: column, 
            sortorder: sortorder,
            page: 1,
            gridComplete: function hideLoad(){
              $("#loading").css("display", "none");
            }
        }).trigger('reloadGrid');
      }

        if(column == "address"){
          $('#jqgh_address').css("font-weight", "bold").css("font-size", "18px");
          $('#jqgh_price').css("font-weight", "normal").css("font-size", "17px");
    		  $('#jqgh_amen').css("font-weight", "normal").css("font-size", "17px");
    		  $('#jqgh_loc').css("font-weight", "normal").css("font-size", "17px");
    		  $('#jqgh_bld').css("font-weight", "normal").css("font-size", "17px");
    		  $('#jqgh_vws').css("font-weight", "normal").css("font-size", "17px");
    		  $('#jqgh_vroom_sqf').css("font-weight", "normal").css("font-size", "17px");
        }
        else if(column == "price"){
          $('#jqgh_address').css("font-weight", "normal").css("font-size", "17px");
          $('#jqgh_price').css("font-weight", "bold").css("font-size", "18px");
    		  $('#jqgh_amen').css("font-weight", "normal").css("font-size", "17px");
    		  $('#jqgh_loc').css("font-weight", "normal").css("font-size", "17px");
    		  $('#jqgh_bld').css("font-weight", "normal").css("font-size", "17px");
    		  $('#jqgh_vws').css("font-weight", "normal").css("font-size", "17px");
    		  $('#jqgh_vroom_sqf').css("font-weight", "normal").css("font-size", "17px");
        }
        else if(column == "loc"){
          $('#jqgh_address').css("font-weight", "normal").css("font-size", "17px");
          $('#jqgh_price').css("font-weight", "normal").css("font-size", "17px");
    		  $('#jqgh_amen').css("font-weight", "normal").css("font-size", "17px");
    		  $('#jqgh_loc').css("font-weight", "bold").css("font-size", "18px");
    		  $('#jqgh_bld').css("font-weight", "normal").css("font-size", "17px");
    		  $('#jqgh_vws').css("font-weight", "normal").css("font-size", "17px");
    		  $('#jqgh_vroom_sqf').css("font-weight", "normal").css("font-size", "17px");
        }
        else if(column == "bld"){
          $('#jqgh_address').css("font-weight", "normal").css("font-size", "17px");
          $('#jqgh_price').css("font-weight", "normal").css("font-size", "17px");
    		  $('#jqgh_amen').css("font-weight", "normal").css("font-size", "17px");
    		  $('#jqgh_loc').css("font-weight", "normal").css("font-size", "17px");
    		  $('#jqgh_bld').css("font-weight", "bold").css("font-size", "18px");
    		  $('#jqgh_vws').css("font-weight", "normal").css("font-size", "17px");
    		  $('#jqgh_vroom_sqf').css("font-weight", "normal").css("font-size", "17px");
        }
        else if(column == "vws"){
          $('#jqgh_address').css("font-weight", "normal").css("font-size", "17px");
          $('#jqgh_price').css("font-weight", "normail").css("font-size", "17px");
    		  $('#jqgh_amen').css("font-weight", "normal").css("font-size", "17px");
    		  $('#jqgh_loc').css("font-weight", "normal").css("font-size", "17px");
    		  $('#jqgh_bld').css("font-weight", "normal").css("font-size", "17px");
    		  $('#jqgh_vws').css("font-weight", "bold").css("font-size", "18px");
    		  $('#jqgh_vroom_sqf').css("font-weight", "normal").css("font-size", "17px");
        }
        else if(column == "vroom_sqf"){
          $('#jqgh_address').css("font-weight", "normal").css("font-size", "17px");
          $('#jqgh_price').css("font-weight", "normal").css("font-size", "17px");
    		  $('#jqgh_amen').css("font-weight", "normal").css("font-size", "17px");
    		  $('#jqgh_loc').css("font-weight", "normal").css("font-size", "17px");
    		  $('#jqgh_bld').css("font-weight", "normal").css("font-size", "17px");
    		  $('#jqgh_vws').css("font-weight", "normal").css("font-size", "17px");
    		  $('#jqgh_vroom_sqf').css("font-weight", "bold").css("font-size", "18px");
        }
        else{
          // Do nothing
        }

    });

        // SEARCH RESULTS AMENITIES MENU
        $('#jqgh_amen').live('hover',function(){
            $('.amenitiesmenu').show();
        });
        $('.amenitiesmenu:not(.criterion)').live('mouseleave',function(){
            $('.amenitiesmenu').hide();
        });
        $('.table-header').live('mouseleave',function(){
            $('.amenitiesmenu').hide();
        });        
        $('#jqgh_price').live('hover',function(){
        	  $('.amenitiesmenu').hide();
        });
        $('#jqgh_loc').live('hover',function(){
        	 $('.amenitiesmenu').hide();
        });
        $('#jqgh_bld').live('hover',function(){
        	 $('.amenitiesmenu').hide();
        });
        $('#jqgh_vws').live('hover',function(){
        	 $('.amenitiesmenu').hide();
        });
        $('#jqgh_vroom_sqf').live('hover',function(){
        	 $('.amenitiesmenu').hide();
        });
        
        $('#jqgh_amen').live('click',function(){
        	 $('.amenitiesmenu').hide();
        });
        $("#closeMenu").live("click",function(){
          $('.amenitiesmenu').hide();
        });

        $('.amenitiesmenu .amenity_icons').live('click',function(){
            var amenity = $(this).attr('rel');
            showPopup = true;
            
            if(amenities[amenity] === true){
                amenities[amenity] = false; // this is the value submitted by the search function
                $('img.amenity_icons[rel='+amenity+']').attr('src','http://homepik.com/images/amenities/'+amenity+'.png').removeClass('selected'); // change the icon color
                $.cookie(amenity, "false");
            } else {
                amenities[amenity] = true; // this is the value submitted by the search function
                $('img.amenity_icons[rel='+amenity+']').attr('src','http://homepik.com/images/amenities/'+amenity+'b.png').addClass('selected'); // change the icon color
                $.cookie(amenity, "true");
            }
            
            	if (!$(this).parents('.amenitiesmenu').hasClass("criterion")) {
            	  $("#noListings").hide();
        		    $("#list").jqGrid('GridUnload');
        		    
        		    var url = window.location.href;    
                if (url.indexOf('/search.php') > -1){
            		  jqgrid();
                }
                else if(url.indexOf('/addressSearch.php') > -1){
                  address = $("#addressSearch").attr("data-address");
                  addressSearch(address);
                }
			        }
        });
        
        // Show amenities options when clicking button on search page
        $('#amenities button').live('click',function(){
        	$('#amenities .amenitiesmenu').toggle();
        	$('#searchbtn').toggleClass('shift2');
        	$('#amenities').toggleClass('amenities-adjust');
        	$('#amenities .selectborder').toggleClass('top-border-hidden');
        }); 


    // BBQ HISTORY PLUGIN

    $(function(){
  
        // The "tab widgets" to handle.
        var tabs = $('.ui-tabs'),
    
        // This selector will be reused when selecting actual tab widget A elements.
        tab_a_selector = 'ul.ui-tabs-nav a';
  
        // Enable tabs on all tab widgets. The `event` property must be overridden so
        // that the tabs aren't changed on click, and any custom event name can be
        // specified. Note that if you define a callback for the 'select' event, it
        // will be executed for the selected tab whenever the hash changes.
        tabs.tabs({
            event: 'change'
        });
  
        // Define our own click handler for the tabs, overriding the default.
        tabs.find( tab_a_selector ).click(function(){
            var state = {},
      
            // Get the id of this tab widget.
            id = $(this).closest( '.ui-tabs' ).attr( 'id' ),
      
            // Get the index of this tab.
            idx = $(this).parent().prevAll().length;
    
            // Set the state!
            state[ id ] = idx;
            $.bbq.pushState( state );
        });

        // PERFOMRING A SEARCH USING BUYER FORMULA
        // IF THERE ARE NONE DISPLAYS ERROR POPUP
        // IF ONE AUTO REDIRECT TO SEARCH CRITERIA
        // IF MORE THAN ONE SELECTION POPUP APPEARS
        $("#buyerSearch").live('click', function(){
          var buyer = $(this).attr("data-user");
          var searchName = $(this).attr("data-name");
          console.log(buyer);
          
          if(searchName == ""){
            $.ajax({
              type: "POST",
              url: "http://homepik.com/controllers/check-criteria.php",
              data: {"email": buyer},
              success: function(data){
                console.log("success");
                
                var num = data[data.length -1];
                
                if(num == 0){
                  $("#ajax-box2").dialog({
                      modal: true,
                      height: 'auto',
                      width: '20%',
                      autoOpen: false,
                      dialogClass: 'ajaxbox',
                      buttons : {
                    Ok: function(){
                      $(this).dialog("close");
                      }
                    }
                  });
                      $('#ajax-box2').load('/controllers/messages.php #no-formula',function(){
                        $('#ajax-box2').dialog( "option", "title", "No Formula" ).attr('rel','yourbuyers').dialog('open');
                        $('#ajax-box2').parent().attr('rel', 'blue');
                        //$('.ajaxbox').attr('rel','blue');
                    });
                }
                else{
                  if(String(window.location).indexOf('menu.php') != -1)
                  {
                    window.location = "http://homepik.com/search.php#buyerFormula?"+buyer;
                  }
                  else if(String(window.location).indexOf('search.php') != -1)
                  {
                    window.location.assign("http://homepik.com/search.php#buyerFormula?"+buyer);
                    location.reload();
                  }
                  else{
                    window.location = "http://homepik.com/search.php#buyerFormula?"+buyer;
                  }
                }
                
              },
              error: function(){
                console.log("failed");
              }
            });
          }
          else{
            $.ajax({
              type: "POST",
              url: "http://homepik.com/controllers/check-criteria.php",
              data: {"email": buyer, "name": searchName},
              success: function(data){
                console.log("success");
                
                var num = data[data.length -1];
                
                if(num == 0){
                   $("#ajax-box2").dialog({
                    modal: true,
                    height: 'auto',
                    width: '245px',
                    autoOpen: false,
                    dialogClass: 'ajaxbox',
                    buttons : {
                  Ok: function(){
                    $(this).dialog("close");
                    }
                  }
                });
                    $('#ajax-box2').load('/controllers/messages.php #no-formula',function(){
                      $('#ajax-box2').dialog( "option", "title", "No Formula" ).attr('rel','yourbuyers').dialog('open');
                      $('#ajax-box2').parent().attr('rel', 'blue');
                      $('#ajax-box2').parent().css('display', 'block');
                      $('#ajax-box2').css('height', '70px');
                  });
                }
                else{

                  $.get("/controllers/ajax.php", {
                      saveBuyer: 'true', //Call the PHP function
                      email: buyer, //Put variables into AJAX variables
                      success: function(result){
                        console.log("buyer saved");
                      }
                  });
                  
                  while(searchName.indexOf(" ") != -1){
                    searchName = searchName.replace(" ", "_");
                  }

                  if(String(window.location).indexOf('menu.php') != -1)
                  {
                    window.location = "http://homepik.com/search.php#buyerFormula?"+buyer+"?"+searchName;
                  }
                  else if(String(window.location).indexOf('search.php') != -1)
                  {
                    window.location.assign("http://homepik.com/search.php#buyerFormula?"+buyer+"?"+searchName);
                    location.reload();
                  }
                  else{
                    window.location = "http://homepik.com/search.php#buyerFormula?"+buyer+"?"+searchName;
                  }
                }
                
              },
              error: function(){
                console.log("failed");
              }
            });
          }
        });
        
        // IF ENTER KEY IS PRESSED WHEN SEARCH AN ADDRESS
        // CALL THE SEARCHADDRESS FUNCTION BELOW
        $("#searchAddress").keyup(function(event){
            if(event.keyCode == 13){
                $(".searchAddress").click();
            }
        });
        
        // PREPARES THE ADDRESS FOR SEARCH IN THE DATABASE
        // REDIRECTS TO ADDRESSSEARCH.PHP
        $(".searchAddress").live('click', function(){
          
          $("#noListings").hide();
          var address = $("#searchAddress").val();
          
          $.get("/controllers/ajax.php", {
            setListing: 'true', //Call the PHP function
            value: "false",
            success: function(result){
              console.log("Listing Saved");
            }
          });
          
          $.get("/controllers/ajax.php", {
            setOpenListings: 'true', //Call the PHP function
            value: "false",
            success: function(result){
              console.log("Reset Listings done");
            }
          });
          
          $.get("/controllers/ajax.php", {
            setAddress: 'true', //Call the PHP function
            address: address,
            success: function(result){
              console.log("Address set");
            }
          });
          
          $.get("/controllers/ajax.php", {
            setViewingResults: 'true', //Call the PHP function
            value: "false",
            success: function(result){
              console.log("Viewing Results Set to False");
            }
          });
          
          $("#addressSearch").attr("data-address", address);
          
          address = address.toUpperCase();
          address = address.replace(".", "");
          address = address.split(' ');

          if(address[address.length - 1] == 'AVE' || address[address.length - 1] == 'ST' || address[address.length - 1] == 'BLVD' || address[address.length - 1] == 'CT' || address[address.length - 1] == 'RD' || address[address.length - 1] == 'DR'){
            address[address.length - 1] = address[address.length - 1].replace("AVE", "avenue");
            address[address.length - 1] = address[address.length - 1].replace("ST", "street");
            address[address.length - 1] = address[address.length - 1].replace("BLVD", "boulevard");
            address[address.length - 1] = address[address.length - 1].replace("CT", "court");
            address[address.length - 1] = address[address.length - 1].replace("RD", "road");
            address[address.length - 1] = address[address.length - 1].replace("DR", "drive");
          }
          if(address[1] == 'N' || address[1] == 'E' || address[1] == 'S' || address[1] == 'W'){
            address[1] = address[1].replace("N", "north");
            address[1] = address[1].replace("E", "east");
            address[1] = address[1].replace("S", "south");
            address[1] = address[1].replace("W", "west");
          }

          address = address.join(' ');
          address = address.toLowerCase();
          var ad = address.split(' ').join('_');
          
          if(String(window.location).indexOf('menu.php') != -1 || String(window.location).indexOf('search.php') != -1){
            $.get("/controllers/ajax.php", {
              setListing: 'true', //Call the PHP function
              value: "http://homepik.com/addressSearch.php#address?"+ad,
              success: function(result){
                console.log("Listing Saved");
              }
            });
            
            $.get("/controllers/ajax.php", {
              setPreviousPage: 'true', //Call the PHP function
              value: "false",
              success: function(result){
                console.log("Previous Page Set to False");
                $(document).ajaxStop(function() { window.location = "http://homepik.com/addressSearch.php#address?"+ad; });
              }
            }); 
          }
          else{
            ad = ad.split('_').join('%');
            $("#list").setGridParam({
              search: true,
              postData: {address: ad}
            }).trigger('reloadGrid');
          }
        });
        
        // SCROLLS TO BOTTOM OF BUYER'S FOLDER TO VIEW FORMULAS (AGENT ONLY)
        $("#viewFormula").live('click', function(){
          window.scrollTo(0,2000);
        });

        // AGENT CONDUCTS SEARCH USING A BUYER'S SAVED FORMULA
        $(".conductSearch").live('click', function(){
          var buyer = $(this).attr('data-buyer');
          var searchName = $(this).attr('data-name');
          
          console.log(searchName);

          if(searchName == "" || searchName == null){
            $.ajax({
              type: "POST",
              url: "http://homepik.com/controllers/check-criteria.php",
              data: {"email": buyer, "search":"true"},
              success: function(data){
                console.log("success");
                searches = JSON.parse(data);
                
                if(searches.length == 0){
                  $("#ajax-box2").dialog({
                      modal: true,
                      height: 'auto',
                      width: '20%',
                      autoOpen: false,
                      dialogClass: 'ajaxbox',
                      buttons : {
                    Ok: function(){
                      $(this).dialog("close");
                      }
                    }
                  });
                      $('#ajax-box2').load('/controllers/messages.php #no-formula',function(){
                        $('#ajax-box2').dialog( "option", "title", "No Formula" ).attr('rel','yourbuyers').dialog('open');
                        $('#ajax-box2').parent().attr('rel', 'blue');
                    });
                }
                else if(searches.length == 1){
                  while(searches[0].indexOf(" ") != -1){
                    searches[0] = searches[0].replace(" ", "_");
                  }
                  
                  console.log(searches[0]);
                  
                  if(String(window.location).indexOf('menu.php') != -1)
                  {
                    window.location = "http://homepik.com/search.php#buyerFormula?"+buyer+"?"+searches[0];
                  }
                  else if(String(window.location).indexOf('search.php') != -1)
                  {
                    window.location.assign("http://homepik.com/search.php#buyerFormula?"+buyer+"?"+searches[0]);
                    location.reload();
                  }
                  else{
                    window.location = "http://homepik.com/search.php#buyerFormula?"+buyer+"?"+searches[0];
                  }
                }
                else{
                  
                  $("#ajax-box").dialog({
                      modal: true,
                      height: 'auto',
                      width: 'auto',
                      left: '150px',
                      autoOpen: false,
                      dialogClass: 'ajaxbox'
                  });
                  $('#ajax-box').load('/controllers/select-search.php #comparison-content',function(){
                      $('#ajax-box').dialog( "option", "title", "Buyer Formulas" ).dialog('open');
                      $('.ajaxbox').attr('rel','purple');
                      $("#ajax-box").dialog("option", "position", "center");
                  });
                  
                }
              },
              error: function(){
                console.log("failed");
              }
            });
          }
          else{
            $.ajax({
              type: "POST",
              url: "http://homepik.com/controllers/check-criteria.php",
              data: {"email": buyer, "name": searchName},
              success: function(data){
                console.log("success");
                
                var num = data[data.length -1];
                
                if(num == 0){
                  $("#ajax-box2").dialog({
                      modal: true,
                      height: 'auto',
                      width: '20%',
                      autoOpen: false,
                      dialogClass: 'ajaxbox',
                      buttons : {
                    Ok: function(){
                      $(this).dialog("close");
                      }
                    }
                  });
                      $('#ajax-box2').load('/controllers/messages.php #no-formula',function(){
                        $('#ajax-box2').dialog( "option", "title", "No Formula" ).attr('rel','yourbuyers').dialog('open');
                        $('#ajax-box2').parent().attr('rel', 'blue');
                    });
                }
                else{
                  
                  while(searchName.indexOf(" ") != -1){
                    searchName = searchName.replace(" ", "_");
                  }
                  
                  if(String(window.location).indexOf('menu.php') != -1){
                    window.location = "http://homepik.com/search.php#buyerFormula?"+buyer+"?"+searchName;
                  }
                  else if(String(window.location).indexOf('search.php') != -1)
                  {
                    window.location.assign("http://homepik.com/search.php#buyerFormula?"+buyer+"?"+searchName);
                    location.reload();
                  }
                  else{
                    window.location ="http://homepik.com/search.php#buyerFormula?"+buyer+"?"+searchName;
                  }
                }
                
              },
              error: function(){
                console.log("failed");
              }
            });
          }
          
        });
        
        // AGENT VIEW OF MULTIPLE BUYER SAVED FORMULAS SELECTION AND REDIRECT
        $('.search-row').live('click',function(){ 
            var buyer = $(this).attr('data-buyer'),
            name = $(this).attr('data-name');
            
            while(name.indexOf(" ") != -1){
              name = name.replace(" ", "_");
            }
            
            if(String(window.location).indexOf('menu.php') != -1)
            {
              window.location = "http://homepik.com/search.php#buyerFormula?"+buyer+"?"+name;
            }
            else if(String(window.location).indexOf('search.php') != -1)
            {
              window.location.assign("http://homepik.com/search.php#buyerFormula?"+buyer+"?"+name);
              location.reload();
            }
            else{
              window.location= "http://homepik.com/search.php#buyerFormula?"+buyer+"?"+name;
            }
        });

        // CONTINUE BUTTON and SHOW RESULTS
        $('#submit-search-tab a, #address-box label').click(function(){
            show_results(); // this function is in head.php 
            return false;
        });

        $('.previous').click(function() {
          $.get("/controllers/ajax.php", {
            setPreviousPage: 'true', //Call the PHP function
            value: "firstCriteria",
            success: function(result){
              console.log("Previous Page Set to First Criteria");
            }
          }); 
        });

        $('.continue').click(function() { // bind click event to link

          var buyer = $(this).attr('data-buyer');
            if($(this).attr('id') == "searchbtn" && buyer !== "guest@email.com" && buyer.indexOf('@bellmarc.com') == -1 && showPopup == true)
            {
              // ASK IF BUYER WANTS TO SAVE SEARCH
              $("#ajax-box").dialog({
                modal: true,
                height: 'auto',
                width: '250px',
                autoOpen: false,
                dialogClass: 'ajaxbox',
              });
              $('#ajax-box').load('/controllers/save-criteria-msg.php?'+buyer+' #save-search',function(){
                $('#ajax-box').dialog( "option", "title", "Save Criteria?" ).dialog('open');
                $('.ajaxbox').attr('rel','pink');
                $("#ajax-box").find("#searchName").val($.cookie("searchName"));
                if((navigator.userAgent.match(/iPad/i) != null) == true && ((Math.abs(window.orientation) === 0) || (Math.abs(window.orientation) === 180))){
                  $('.ajaxbox').css("left", "45%");
                }
              });
              return false;
            }
            
          var state = {},
      
            // Get the id of this tab widget.
            id = $(this).closest( '.ui-tabs' ).attr( 'id' ),
 
            tabs = $('#tabs').tabs(),
 
            // Get the index of this tab.
            current = tabs.tabs('option', 'selected');
	  
            current = (current + 1);

            next = (current + 1);
            if (next == 0 || next == 1 || next == 2  ) {
                // Set the state!
                state[ id ] = current;
                $.bbq.pushState( state );
                tabs.tabs('select', current); // switch to next tab
                
                $.get("/controllers/ajax.php", {
                  setPreviousPage: 'true', //Call the PHP function
                  value: "secondCriteria",
                  success: function(result){
                    console.log("Previous Page Set to Second Criteria");
                  }
                }); 
            } else {
              show_results(); // this function is in head.tpl.php 
            }
        });
       
       // SAVING A SEARCH AS A BUYER'S FORMULA
        $('.save-search').live('click',function() {
          var	searchName = $("#ajax-box").find("#searchName").val(),
          location_grade = $('#location_grade').slider("value"),
          neighborhoods = $( 'input[name="multiselect_neighborhoods"]:checked' ),
          prop_type = $( 'input[name="multiselect_prop_type"]:checked' ),
          building_grade = $('#building_grade').slider("value"),
          views_grade = $('#views_grade').slider("value"),
          min_floor = $('#min_floor').val(),
          bedrooms = $( "#bedrooms_slider" ).slider("value"),
          min_price = $('#min_price').attr('data-price'),
          max_price = $('#max_price').attr('data-price'),
          living_area = $('#living_grade').slider("value"),
          bedroom_area = $('#bedroom_grade').slider("value");
          building_address = $('#address-search').val();

          var n = [];
          for(i=0; i < neighborhoods.length; i++){
            n.push(neighborhoods[i].value);
          }
          
          var p = [];
          for(i=0; i < prop_type.length; i++){
            p.push(prop_type[i].value);
          }
          
          // array for amenities
          var amen = [];
        
          if(n.length == 0){
            n.push("North");
            n.push("Westside");
            n.push("Eastside");
            n.push("Chelsea");
            n.push("SMG");
            n.push("Village");
            n.push("Lower");
          }
          
          if(p.length == 0){
            p.push("1");
            p.push("2");
            p.push("4");
            p.push("5");
          }
          
          if(amenities['garage'] === true){
            amen.push(1);
          }
          if(amenities['pool'] === true){
            amen.push(2);
          }
          if(amenities['laundry'] === true){
            amen.push(3);
          }
          if(amenities['doorman'] === true){
            amen.push(4);
          }
          if(amenities['elevator'] === true){
            amen.push(5);
          }
          if(amenities['pets'] === true){
            amen.push(6);
          }
          if(amenities['fireplace'] === true){
            amen.push(7);
          }
          if(amenities['healthclub'] === true){
            amen.push(8);
          }
          if(amenities['prewar'] === true){
            amen.push(9);
          }
          if(amenities['outdoor'] === true){
            amen.push(10);
          }
          if(amenities['wheelchair'] === true){
            amen.push(11);
          }
  
          $('#ajax-box').dialog( "option", "title", "My Profile" ).dialog('close');
            
          $.ajax({
            type: "POST",
            url: "controllers/save-criteria.php",
            data: {"name":searchName, "location":location_grade, "building":building_grade, "view":views_grade, "floor":min_floor, "bedrooms":bedrooms, "min_price":min_price, "max_price":max_price, "living_area":living_area, "bedroom_area":bedroom_area, "neighborhoods" : n, "prop_type":p, "amenities":amen},
            success: function(data){
              console.log("success");
              
              var state = {},
        
              // Get the id of this tab widget.
              id = $(this).closest( '.ui-tabs' ).attr( 'id' ),
   
              tabs = $('#tabs').tabs(),
   
              // Get the index of this tab.
              current = tabs.tabs('option', 'selected');
  	  
              current = (current + 1);
  
              next = (current + 1);
              if (next == 0 || next == 1 || next == 2  ) {
                  // Set the state!
                  state[ id ] = current;
                  $.bbq.pushState( state );
                  tabs.tabs('select', current); // switch to next tab
              } else {
                  show_results(); // this function is in head.php 
              }
              
            },
            error: function(){
              console.log("failed");
            }
          });
          
          return false;
        });
       
       // CONTINUES IF THEY DON'T WANT TO SAVE THE FORMULA
        $('.dont-save-search').live('click',function(){
          
          $('#ajax-box').dialog( "option", "title", "My Profile" ).dialog('close');
          
          var state = {},
      
            // Get the id of this tab widget.
            id = $(this).closest( '.ui-tabs' ).attr( 'id' ),
 
            tabs = $('#tabs').tabs(),
 
            // Get the index of this tab.
            current = tabs.tabs('option', 'selected');
            current = (current + 1);

            next = (current + 1);
            if (next == 0 || next == 1 || next == 2  ) {
                // Set the state!
                state[ id ] = current;
                $.bbq.pushState( state );
                tabs.tabs('select', current); // switch to next tab
            } else {
                show_results(); // this function is in head.php 
            }
          
        });
        
        // CHANGED FORMULA VIEW TO AN EDITABLE ONE
        $(".editFormula").live('click', function(){
          var email = $(this).attr('data-buyer');
          var searchName = $(this).attr('data-name');
          var formula = $(this).attr('id');
          
          if(searchName == ""){
            searchName = "false"
          }

          $.ajax({
                type: "POST",
                url: "http://homepik.com/controllers/get-search-criteria.php",
                data: {"email": email, "name": searchName},
                success: function(data){
                  var criteria = JSON.parse(data);
                  var neighborhoods = document.getElementsByName("neighborhood");
                  var properties = document.getElementsByName("property");
                  var amenities = document.getElementsByName("amenity");
                  
                  console.log(data);
                  
                  switch(criteria.min_price){
                    case "1": criteria.min_price = "100000";
                        break;
                    case "2": criteria.min_price = "200000";
                        break;
                    case "3": criteria.min_price = "300000";
                        break;
                    case "4": criteria.min_price = "400000";
                        break;
                    case "5": criteria.min_price = '500000';
                        break;
                    case "6": criteria.min_price = '600000';
                        break;
                    case "7": criteria.min_price = '700000';
                        break;
                    case "8": criteria.min_price = '800000';
                        break;
                    case "9": criteria.min_price = '900000';
                        break;
                    case "10": criteria.min_price = '1000000'; 
                        break;
                    case "11": criteria.min_price = '1100000';
                        break;
                    case "12": criteria.min_price = '1200000';
                        break;
                    case "13": criteria.min_price = '1300000';
                        break;
                    case "14": criteria.min_price = '1400000';
                        break;
                    case "15": criteria.min_price = '1500000';
                        break;
                    case "16": criteria.min_price = '1600000';
                        break;
                    case "17": criteria.min_price = '1700000';
                        break;
                    case "18": criteria.min_price = '1800000';
                        break;
                    case "19": criteria.min_price = '1900000';
                        break;
                    case "20": criteria.min_price = '2000000';
                        break;
                    case "21": criteria.min_price = '2250000';
                        break; 
                    case "22": criteria.min_price = '2500000';
                        break;
                    case "23": criteria.min_price = '2750000';
                        break;
                    case "24": criteria.min_price = '3000000';
                        break;
                    case "25": criteria.min_price = '3500000';
                        break;
                    case "26": criteria.min_price = '4000000';
                        break;
                    case "27": criteria.min_price = '6000000';
                        break;
                    case "28": criteria.min_price = '8000000';
                        break;
                    case "29": criteria.min_price = '12000000';
                        break;
                    case "30": criteria.min_price = '25000000';
                        break;
                    case "31": criteria.min_price = '50000000';
                        break;
                    case "32": criteria.min_price = '99000000';
                        break;
                  }
                  
                  switch(criteria.max_price){
                    case "1": criteria.max_price = "100000";
                        break;
                    case "2": criteria.max_price = "200000";
                        break;
                    case "3": criteria.max_price = "300000";
                        break;
                    case "4": criteria.max_price = "400000";
                        break;
                    case "5": criteria.max_price = '500000';
                        break;
                    case "6": criteria.max_price = '600000';
                        break;
                    case "7": criteria.max_price = '700000';
                        break;
                    case "8": criteria.max_price = '800000';
                        break;
                    case "9": criteria.max_price = '900000';
                        break;
                    case "10": criteria.max_price = '1000000'; 
                        break;
                    case "11": criteria.max_price = '1100000';
                        break;
                    case "12": criteria.max_price = '1200000';
                        break;
                    case "13": criteria.max_price = '1300000';
                        break;
                    case "14": criteria.max_price = '1400000';
                        break;
                    case "15": criteria.max_price = '1500000';
                        break;
                    case "16": criteria.max_price = '1600000';
                        break;
                    case "17": criteria.max_price = '1700000';
                        break;
                    case "18": criteria.max_price = '1800000';
                        break;
                    case "19": criteria.max_price = '1900000';
                        break;
                    case "20": criteria.max_price = '2000000';
                        break;
                    case "21": criteria.max_price = '2250000';
                        break; 
                    case "22": criteria.max_price = '2500000';
                        break;
                    case "23": criteria.max_price = '2750000';
                        break;
                    case "24": criteria.max_price = '3000000';
                        break;
                    case "25": criteria.max_price = '3500000';
                        break;
                    case "26": criteria.max_price = '4000000';
                        break;
                    case "27": criteria.max_price = '6000000';
                        break;
                    case "28": criteria.max_price = '8000000';
                        break;
                    case "29": criteria.max_price = '12000000';
                        break;
                    case "30": criteria.max_price = '25000000';
                        break;
                    case "31": criteria.max_price = '50000000';
                        break;
                    case "32": criteria.max_price = '99000000';
                        break;
                  }
                  
                  for(i=0; i<criteria.neighborhoods.length; i++){
                    switch (criteria.neighborhoods[i]) {
                          case "North": criteria.neighborhoods[i] = "Far Uptown";
                              break;
                          case "Westside": criteria.neighborhoods[i] = "Upper West Side";
                              break;
                          case "Eastside": criteria.neighborhoods[i] = "Upper East Side";
                              break;
                          case "Chelsea": criteria.neighborhoods[i] = "Midtown West";
                              break;
                          case "SMG": criteria.neighborhoods[i] = "Midtown East";
                              break;
                          case "Village": criteria.neighborhoods[i] = "East/West Village";
                              break;
                          case "Lower": criteria.neighborhoods[i] = "Downtown";
                              break;
                        };
                  }
                  
                  $("#buyer-"+formula+".editedFormula").find("#minpo").val(criteria.min_price);
                  $("#buyer-"+formula+".editedFormula").find("#maxpo").val(criteria.max_price);
                  $("#buyer-"+formula+".editedFormula").find("#mbo").val(criteria.bedrooms);
                  $("#buyer-"+formula+".editedFormula").find("#lo").val(criteria.location_grade);
                  $("#buyer-"+formula+".editedFormula").find("#bo").val(criteria.building_grade);
                  $("#buyer-"+formula+".editedFormula").find("#vo").val(criteria.view_grade);
                  $("#buyer-"+formula+".editedFormula").find("#bso").val(criteria.bedroom_area);
                  $("#buyer-"+formula+".editedFormula").find("#lso").val(criteria.living_area);
                  
                  for(i=0; i<criteria.neighborhoods.length; i++){
                    for(j=0; j<neighborhoods.length; j++){
                      neighborhood = neighborhoods[j].value.replace("_", " ");
                      neighborhood = neighborhood.replace("_", " ");
                      if(criteria.neighborhoods[i] == neighborhood){
                        neighborhoods[j].checked = true;
                      }
                    }
                  }
                  
                  for(i=0; i<criteria.prop_type.length; i++){
                    for(j=0; j<properties.length; j++){
                      if(criteria.prop_type[i] == properties[j].value){
                        properties[j].checked = true;
                      }
                    }
                  }
                  
                  for(i=0; i<criteria.amenities.length; i++){
                    for(j=0; j<amenities.length; j++){
                      if(criteria.amenities[i] == amenities[j].value){
                        amenities[j].checked = true;
                      }
                    }
                  }
                  
                  if(previousTitle == "My Profile"){
                    $('.ajaxbox').css('width', "840px");
                    $('#ajax-box').css('width', "805px");
                    $("#ajax-box").dialog("option", "position", "center");
                  }
                  
                  $(".editFormula#"+formula).hide();
                  $(".saveFormula#"+formula).show();
                  $(".shownFormula#buyer-"+formula).hide();
                  $(".editedFormula#buyer-"+formula).show();
                },
                error: function(jqXHR, textStatus, errorThrown ) {
              console.log(jqXHR);
              console.log(textStatus);
              console.log(errorThrown);
                }
            	});
        });
        
        // DISPLAYS THE EDITABLE FORMULA WHEN CLICKED
        $(".addFormula").live('click', function(){
          var formula = $(this).attr("id");
          $(".addFormula").hide();
          $(".saveFormula#"+formula).show();
          $(".editedFormula#buyer-"+formula).show();
          window.scrollTo(0,2000);
        });
        
        // SAVING A FORMULA IN EDITABLE VIEW AND
        // RELOADS PAGE TO SHOW CHANGES AND GO
        // BACK TO NORMAL VIEW
        $(".saveFormula").live('click', function(){
          var formula = $(this).attr("id");
          
          var email = $(this).attr("data-buyer");
          var searchName = $("#buyer-"+formula+".editedFormula").find("#searchName").val();
          var oldName = $("#buyer-"+formula+".editedFormula").find("#searchName").attr("data-name");
          var min_price = $("#buyer-"+formula+".editedFormula").find("#minpo").val();
          var max_price = $("#buyer-"+formula+".editedFormula").find("#maxpo").val();
          var bedrooms = $("#buyer-"+formula+".editedFormula").find("#mbo").val();
          var location_grade = $("#buyer-"+formula+".editedFormula").find("#lo").val();
          var building_grade = $("#buyer-"+formula+".editedFormula").find("#bo").val();
          var views_grade = $("#buyer-"+formula+".editedFormula").find("#vo").val();
          var bedroom_area = $("#buyer-"+formula+".editedFormula").find("#bso").val();
          var living_area = $("#buyer-"+formula+".editedFormula").find("#lso").val();
          var min_floor = "";
          
          console.log(oldName);
          
          var neighborhoods = [];
          var prop_type = [];
          var amen = [];
          
          $("#buyer-"+formula+".editedFormula").find("#no input:checked").each(function(){
            neighb = $(this).val().replace("_", " ");
            neighb = neighb.replace("_", " ");
            neighborhoods.push(neighb);
            
          });
          
          if(neighborhoods.length == 0){
            neighborhoods = ["North", "Westside", "Eastside", "Chelsea", "SMG", "Village", "Lower"];
          }
          
          $("#buyer-"+formula+".editedFormula").find("#po input:checked").each(function(){
            prop_type.push($(this).val());
          });
          
          if(prop_type.length == 0){
            prop_type = ["1", "2", "4", "5"];
          }
          
          $("#buyer-"+formula+".editedFormula").find("#ao input:checked").each(function(){
            amen.push($(this).val());
          });

          if(Number(min_price) >= Number(max_price)){
            //alert("The minimum price can't be more than the maximum price.");
            $("#ajax-box2").dialog({
                modal: true,
                height: 'auto',
                width: '275px',
                autoOpen: false,
                dialogClass: 'ajaxbox',
                buttons: {
                  Ok: function(){
                    $(this).dialog("destroy");
                  }
                },
                close: function() {
                  $( this ).dialog( "destroy" );
                }
            });
            $('#ajax-box2').load('/controllers/messages.php #priceRange',function(){
                $('#ajax-box2').dialog( "option", "title", "Price Range" ).dialog('open');
                 $('#ajax-box2').parent().attr('rel', 'blue');
                //$('.ajaxbox').attr('rel','purple');
            });
          }
          else{
            $.ajax({
              type: "POST",
              url: "http://homepik.com/controllers/save-criteria.php",
              data: {"email":email, "oldname":oldName, "name":searchName, "location":location_grade, "building":building_grade, "view":views_grade, "floor":min_floor, "bedrooms":bedrooms, "min_price":min_price, "max_price":max_price, "living_area":living_area, "bedroom_area":bedroom_area, "neighborhoods" : neighborhoods, "prop_type":prop_type, "amenities":amen},
              success: function(data){
                console.log("Criteria Saved");
                console.log(data);
                
                $(".editFormula#"+formula).show();
                $(".saveFormula#"+formula).hide();
                $(".shownFormula#buyer-"+formula).show();
                $(".editedFormula#buyer-"+formula).hide();

                $.get("/controllers/ajax.php", {
                    editFormulaEmail: 'true', //Call the PHP function
                    email: email,
                    success: function(result){
                      console.log("email sent");
                      $(document).ajaxStop(function() { location.reload(true); });
                      
                    }
                });
                
              },
              error: function(jqXHR, textStatus, errorThrown ) {
              console.log(jqXHR);
              console.log(textStatus);
              console.log(errorThrown);
              }
            });
          } 
        });
        
        // DELETING A SAVED BUYER FORMULA
        $(".deleteFormula").live('click', function(){
          var email = $(this).attr('data-buyer');
          var searchName = $(this).attr('data-name');
          
          console.log(email);
          console.log(searchName);
                
          $("#ajax-box2").dialog({
            autoOpen: false,
            height: 225,
            width: 275,
            modal: true,
            buttons: {   
              Yes: function() {   
                $.ajax({
                  type: "POST",
                  url: "http://homepik.com/controllers/delete-criteria.php",
                  data: {"email":email, "name":searchName},
                  success: function(data){
                    $(document).ajaxStop(function() { location.reload(true); });
                  },
                  error: function(){
                    console.log("failed");
                  }
                });
                
                $( this ).dialog( "destroy" );
              },
              No: function() {    
                $( this ).dialog( "destroy" );
              }  
            },
            close: function() {
              $( this ).dialog( "destroy" );
            }
          });
          $('#ajax-box2').load('/controllers/messages.php #deleteFormula',function(){
            $('#ajax-box2').dialog( "option", "title", "Delete Formula?" ).dialog('open');
            $("#ajax-box2").parent().attr('rel', 'green');
            $("#deleteFormula").find("#formulaName").html(searchName);
          });
        });
        
        // CHANGE TO AN EDITABLE INPUT WITH NAME ALREADY ENTERED
        $("#edit_name").live('click', function(){
          var name = $("#name").text();
          htmlString = '<input type="text" name="Name" value="'+name+'" id="newName">';
          $("#name").html( htmlString );
          
          $("#edit_name").html('<a style="color:#CC397B; cursor:pointer; text-decoration: underline;">save</a>');
          
          $("#edit_name").attr("id","save_name");
        });

        // CHANGE TO AN EDITABLE INPUT WITH PHONE ALREADY ENTERED
        $("#edit_phone").live('click', function(){
          phone = $("#phone").text();
          htmlString = '<input type="text" name="Phone" value="'+phone+'" id="newPhone">';
          $("#phone").html( htmlString );
          
          $("#edit_phone").html('<a style="color:#CC397B; cursor:pointer; text-decoration: underline;">save</a>');
          
          $("#edit_phone").attr("id","save_phone");
        });
        
        // CHANGE TO AN EDITABLE INPUT WITH EMAIL ALREADY ENTERED
        $("#edit_email").live('click', function(){
          email = $("#email").text();
          htmlString = '<input type="text" name="Email" value="'+email+'" id="newEmail" data-user="'+email+'">';
          $("#email").html( htmlString );
          
          $("#edit_email").html('<a style="color:#CC397B; cursor:pointer; text-decoration: underline;">save</a>');
          
          $("#edit_email").attr("id","save_email");
        });
        
        // CHANGE TO AN EDITABLE INPUT TO ADD AGENT CODE OR NAME
        $("#code").live('focus', function(){

          $.ajax({
            type: "POST",
            url: "http://homepik.com/controllers/get-agents.php",
            data: {"agent": "true"},
            success: function(data){
              var info = JSON.parse(data);
              
              $( "#code" ).autocomplete({
                source: info
              });
              
            },
            error: function(){
              console.log("failed");
            }
          });
        });
        
        // CHANGE TO AN EDITABLE INPUT TO ADD AGENT CODE OR NAME
        $("#code2").live('focus', function(){
          console.log("creating autofill");
          
          $.ajax({
            type: "POST",
            url: "http://homepik.com/controllers/get-agents.php",
            data: {"agent": "true"},
            success: function(data){
              
              var info = JSON.parse(data);
              
              $( "#code2" ).autocomplete({
                source: info
              });
              
            },
            error: function(){
              console.log("failed");
            }
          });
        });

        // ADDS ALL AGENTS TO INPUT TO ACT AS AUTOFILL
        $("#agents").live('change',function() {
         
          var code = $("#agents").val();
          
          $("#code").val(code);
        });
        
        // ADDS ALL AGENTS TO INPUT TO ACT AS AUTOFILL
        $("#agents2").live('change',function() {
         
          var code = $("#agents2").val();
          
          $("#code2").val(code);
        });
        
        // CHECKS IF INPUT IS VALID THEN ADDS FIRST AGENT
        $("#addAgent").live('click', function(){
          console.log("Code for adding 1st agent");
          code = $("#code").val();
          
          if(code.length == 3){
            $.ajax({
              type: "POST",
              url: "http://homepik.com/controllers/check-agent.php",
              data: {"code":code},
              success: function(data){
                var info = JSON.parse(data);
                
                console.log(info);
                
                if(info == "good"){
                  $.ajax({
                    type: "POST",
                    url: "http://homepik.com/controllers/change-buyer-info.php",
                    data: {"code":code},
                    success: function(data){
                      console.log("success");
                      
                      //data = data.substr(data.indexOf('{'), data.indexOf('}'));
                      var info = JSON.parse(data);
                      
                      $("#agentName").html(info.firstname + " " + info.lastname);
                      $("#delete_agent").html('<a style="color:#C74375; cursor:pointer; text-decoration: underline;">delete</a>');
                      $("#agentTitle").html("");
                      $("#agentPhone").html(info.cell_phone);
                      $("#addAgent").html("");
                      $("#agentEmail").html(info.e_mail);
                      
                      $(".secondAgent").css("display", "");
                      
                    },
                    error: function(){
                      console.log("failed");
                    }
                  });
                }
                else{
                  $("#ajax-box2").dialog({
                      modal: true,
                      height: 'auto',
                      width: '275px',
                      autoOpen: false,
                      dialogClass: 'ajaxbox',
                      buttons: {
                        Ok: function(){
                          $(this).dialog("destroy");
                        }
                      },
                      close: function() {
                        $( this ).dialog( "destroy" );
                      }
                  });
                  $('#ajax-box2').load('/controllers/messages.php #addPrimary',function(){
                      $('#ajax-box2').dialog( "option", "title", "Invalid Code" ).dialog('open');
                       $('#ajax-box2').parent().attr('rel', 'purple');
                      //$('.ajaxbox').attr('rel','purple');
                  });
                }
              },
              error: function(){
                console.log("failed");
              }
            });
          }
          else{
            var name = code.split(", ");
            
            firstname = name[1].replace(" ", "");
            lastname = name[0];
            
            $.ajax({
              type: "POST",
              url: "http://homepik.com/controllers/check-agent.php",
              data: {"name":"true", "firstname": firstname, "lastname": lastname},
              success: function(data){
                var info = JSON.parse(data);
                
                if(info.exists == "good"){
                  $.ajax({
                    type: "POST",
                    url: "http://homepik.com/controllers/change-buyer-info.php",
                    data: {"code":info.code},
                    success: function(data){
                      console.log("success");
                      
                      var info = JSON.parse(data);
                      
                      $("#agentName").html(info.firstname + " " + info.lastname);
                      $("#delete_agent").html('<a style="color:#C74375; cursor:pointer; text-decoration: underline;">delete</a>');
                      $("#agentTitle").html("");
                      $("#agentPhone").html(info.cell_phone);
                      $("#addAgent").html("");
                      $("#agentEmail").html(info.e_mail);
                      
                      $(".secondAgent").css("display", "");
                      
                    },
                    error: function(){
                      console.log("failed");
                    }
                  });
                }
                else{
                  $("#ajax-box2").dialog({
                      modal: true,
                      height: 'auto',
                      width: '275px',
                      autoOpen: false,
                      dialogClass: 'ajaxbox',
                      buttons: {
                        Ok: function(){
                          $(this).dialog("destroy");
                        }
                      },
                      close: function() {
                        $( this ).dialog( "destroy" );
                      }
                  });
                  $('#ajax-box2').load('/controllers/messages.php #addPrimary',function(){
                      $('#ajax-box2').dialog( "option", "title", "Invalid Code" ).dialog('open');
                       $('#ajax-box2').parent().attr('rel', 'purple');
                  });
                }
              },
              error: function(){
                console.log("failed");
              }
            });
            
          }
          
        });
        
        // CHECKS IF INPUT IS VALID THEN ADDS SECOND AGENT
        $("#addAgent2").live('click', function(){
          code = $("#code2").val();
          
          if(code.length == 3){
            $.ajax({
              type: "POST",
              url: "http://homepik.com/controllers/check-agent.php",
              data: {"code":code},
              success: function(data){
                var exists = JSON.parse(data);
                
                if(exists == "good"){
                  $.ajax({
                    type: "POST",
                    url: "http://homepik.com/controllers/change-buyer-info.php",
                    data: {"code2":code},
                    success: function(data){
                      var info = JSON.parse(data);
                      
                      $("#agent2Name").html(info.firstname + " " + info.lastname);
                      $("#delete_agent2").html('<a style="color:#C74375; cursor:pointer; text-decoration: underline;">delete</a>');
                      $("#agent2Title").html("");
                      $("#agent2Phone").html(info.cell_phone);
                      $("#addAgent2").html("");
                      $("#agent2Email").html(info.e_mail);
                      
                      $.ajax({
                        type: "POST",
                        url: "http://homepik.com/controllers/change-buyer-info.php",
                        data: {"updateListings":"true"},
                        success: function(data){
                          console.log("Listings Changed");
                        }
                      });
                      
                    },
                    error: function(){
                      console.log("failed");
                    }
                  });
                }
                else if(exists == "used"){
                  $("#ajax-box2").dialog({
                      modal: true,
                      height: 'auto',
                      width: '275px',
                      autoOpen: false,
                      dialogClass: 'ajaxbox',
                      buttons: {
                        Ok: function(){
                          $(this).dialog("destroy");
                        }
                      },
                      close: function() {
                        $( this ).dialog( "destroy" );
                      }
                  });
                  $('#ajax-box2').load('/controllers/messages.php #addSecondary',function(){
                      $('#ajax-box2').dialog( "option", "title", "Agent Assigned" ).dialog('open');
                       $('#ajax-box2').parent().attr('rel', 'purple');
                  });
                }
                else{
                  $("#ajax-box2").dialog({
                      modal: true,
                      height: 'auto',
                      width: '275px',
                      autoOpen: false,
                      dialogClass: 'ajaxbox',
                      buttons: {
                        Ok: function(){
                          $(this).dialog("destroy");
                        }
                      },
                      close: function() {
                        $( this ).dialog( "destroy" );
                      }
                  });
                  $('#ajax-box2').load('/controllers/messages.php #addPrimary',function(){
                      $('#ajax-box2').dialog( "option", "title", "Invalid Code" ).dialog('open');
                       $('#ajax-box2').parent().attr('rel', 'purple');
                  });
                }
              },
              error: function(){
                console.log("failed");
              }
            });
          }
          else{
            var name = code.split(", ");
            
            firstname = name[1].replace(" ", "");
            lastname = name[0];
            
            $.ajax({
              type: "POST",
              url: "http://homepik.com/controllers/check-agent.php",
              data: {"name":"true", "firstname": firstname, "lastname": lastname},
              success: function(data){
                var info = JSON.parse(data);
                
                if(info.exists == "good"){
                  $.ajax({
                    type: "POST",
                    url: "http://homepik.com/controllers/change-buyer-info.php",
                    data: {"code2":info.code},
                    success: function(data){
                      var info = JSON.parse(data);
                      
                      $("#agent2Name").html(info.firstname + " " + info.lastname);
                      $("#delete_agent2").html('<a style="color:#C74375; cursor:pointer; text-decoration: underline;">delete</a>');
                      $("#agent2Title").html("");
                      $("#agent2Phone").html(info.cell_phone);
                      $("#addAgent2").html("");
                      $("#agent2Email").html(info.e_mail);
                      
                      $.ajax({
                        type: "POST",
                        url: "http://homepik.com/controllers/change-buyer-info.php",
                        data: {"updateListings":"true"},
                        success: function(data){
                          console.log("Listings Changed");
                        }
                      });
                      
                    },
                    error: function(){
                      console.log("failed");
                    }
                  });
                }
                else if(info.exists == "used"){
                  $("#ajax-box2").dialog({
                      modal: true,
                      height: 'auto',
                      width: '275px',
                      autoOpen: false,
                      dialogClass: 'ajaxbox',
                      buttons: {
                        Ok: function(){
                          $(this).dialog("destroy");
                        }
                      },
                      close: function() {
                        $( this ).dialog( "destroy" );
                      }
                  });
                  $('#ajax-box2').load('/controllers/messages.php #addSecondary',function(){
                      $('#ajax-box2').dialog( "option", "title", "Agent Assigned" ).dialog('open');
                       $('#ajax-box2').parent().attr('rel', 'purple');
                  });
                }
                else{
                  $("#ajax-box2").dialog({
                      modal: true,
                      height: 'auto',
                      width: '275px',
                      autoOpen: false,
                      dialogClass: 'ajaxbox',
                      buttons: {
                        Ok: function(){
                          $(this).dialog("destroy");
                        }
                      },
                      close: function() {
                        $( this ).dialog( "destroy" );
                      }
                  });
                  $('#ajax-box2').load('/controllers/messages.php #addPrimary',function(){
                      $('#ajax-box2').dialog( "option", "title", "Invalid Code" ).dialog('open');
                       $('#ajax-box2').parent().attr('rel', 'purple');
                  });
                }
              },
              error: function(){
                console.log("failed");
              }
            });
            
          }
          
        });
        
        // DELETES FIRST AGENT AND REPLACES WITH SECOND AGENT
        $("#delete_agent").live('click', function(){
          var bool = "true";
          $.ajax({
            type: "POST",
            url: "http://homepik.com/controllers/change-buyer-info.php",
            data: {"delete":bool},
            success: function(data){
              console.log("success");

                if($("#agent2Name").html() != "No agent selected"){
                    
                $.ajax({
                  type: "POST",
                  url: "http://homepik.com/controllers/change-buyer-info.php",
                  data: {"update":"true"},
                  success: function(data){
                    console.log("success");
                        
                    $("#agentName").html($("#agent2Name").html());
                    $("#agentPhone").html($("#agent2Phone").html());
                    $("#agentEmail").html($("#agent2Email").html());
                        
                    $("#agent2Name").html("No agent selected");
                    $("#delete_agent2").html("");
                    $("#agent2Title").html("agent code");
                    $("#agent2Phone").html('<input type="text" name="code2" id="code2">');
                    $("#agents").css("top", "205px").attr("id", "agents2");
                    $("#addAgent2").html('<a style="color:#CC397B; cursor:pointer; text-decoration: underline;">add</a>');
                    $("#agent2Email").html("");
                  },
                  error: function(){
                    console.log("failed");
                  }
                });
              }
              else{
                $("#agentName").html("No agent selected");
                $("#delete_agent").html("");
                $("#agentTitle").html("agent code");
                $("#agentPhone").html('<input type="text" name="code" id="code">');
                $("#addAgent").html('<a style="color:#CC397B; cursor:pointer; text-decoration: underline;">add</a>');
                $("#agentEmail").html("");
                
                console.log("about to hide second input");
                $(".secondAgent").css("display", "none");
              }
            },
            error: function(){
              console.log("failed");
            }
          });
          
        });
        
        // DELETES SECOND AGENT
        $("#delete_agent2").live('click', function(){
          var bool = "true";
          $.ajax({
            type: "POST",
            url: "http://homepik.com/controllers/change-buyer-info.php",
            data: {"delete2":bool},
            success: function(data){
              console.log("success");
            
              $("#agent2Name").html("No agent selected");
              $("#delete_agent2").html("");
              $("#agent2Title").html("agent code");
              $("#agent2Phone").html('<input type="text" name="code2" id="code2">');
              $("#addAgent2").html('<a style="color:#CC397B; cursor:pointer; text-decoration: underline;">add</a>');
              $("#agent2Email").html("");
              
              $("#agent2Name").parent().addClass("secondAgent")
              $("#agent2Title").parent().addClass("secondAgent")
            
            },
            error: function(){
              console.log("failed");
            }
          });
          
        });
        
        // SAVES NAME CHANGE AND RELOADS PAGE TO DISPLAY CHANGE
        $("#save_name").live('click', function(){
          var name = $("#newName").val();
          
          if(name == ""){
            $("#ajax-box2").dialog({
                    modal: true,
                    height: 'auto',
                    width: '275px',
                    autoOpen: false,
                    dialogClass: 'ajaxbox',
                    buttons: {
                      Ok: function(){
                        $(this).dialog("destroy");
                      }
                    },
                    close: function() {
                      $( this ).dialog( "destroy" );
                    }
                });
                $('#ajax-box2').load('/controllers/messages.php #blankName',function(){
                    $('#ajax-box2').dialog( "option", "title", "Invalid Name" ).dialog('open');
                     $('#ajax-box2').parent().attr('rel', 'purple');
                });
          }
          else{
          
            nameArray = name.split(" ");
            
            $.ajax({
              type: "POST",
              url: "http://homepik.com/controllers/change-buyer-info.php",
              data: {"firstName":nameArray[0], "lastName":nameArray[1]},
              success: function(data){
                $("#name").html( name );
                $("#save_name").html('<a style="color:#CC397B; cursor:pointer; text-decoration: underline;">edit</a>');
                $("#save_name").attr("id","edit_name");
                $(document).ajaxStop(function() { location.reload(true); });
              },
              error: function(){
                console.log("failed");
              }
            });
          }
        });
        
        // SAVES PHONE
        $("#save_phone").live('click', function(){
          phone = $("#newPhone").val();
          
          if(phone == ""){
            $("#ajax-box2").dialog({
                    modal: true,
                    height: 'auto',
                    width: '275px',
                    autoOpen: false,
                    dialogClass: 'ajaxbox',
                    buttons: {
                      Ok: function(){
                        $(this).dialog("destroy");
                      }
                    },
                    close: function() {
                      $( this ).dialog( "destroy" );
                    }
                });
                $('#ajax-box2').load('/controllers/messages.php #blankPhone',function(){
                    $('#ajax-box2').dialog( "option", "title", "Invalid Phone" ).dialog('open');
                     $('#ajax-box2').parent().attr('rel', 'purple');
                });
          }
          else{
          
            var x = phone.replace(/\D/g,'');
            
            if (x.length == 10){
              y = '('+x[0]+x[1]+x[2]+')'+x[3]+x[4]+x[5]+'-'+x[6]+x[7]+x[8]+x[9]; // Reformat phone number
              phone = y;
            }
  
            $.ajax({
              type: "POST",
              url: "http://homepik.com/controllers/change-buyer-info.php",
              data: {"phone":phone},
              success: function(data){
                $("#phone").html( phone );
                $("#save_phone").html('<a style="color:#CC397B; cursor:pointer; text-decoration: underline;">edit</a>');
                $("#save_phone").attr("id","edit_phone");
              },
              error: function(jqXHR, textStatus, errorThrown ) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
              }
            });
          }
        });
        
        // CONFIRMS THE CHANGE THEN SAVES EMAIL
        $("#save_email").live('click', function(){
          email = $("#newEmail").val();
          old_email = $("#newEmail").attr("data-user");
          
          if(email == ""){
            $("#ajax-box2").dialog({
                    modal: true,
                    height: 'auto',
                    width: '275px',
                    autoOpen: false,
                    dialogClass: 'ajaxbox',
                    buttons: {
                      Ok: function(){
                        $(this).dialog("destroy");
                      }
                    },
                    close: function() {
                      $( this ).dialog( "destroy" );
                    }
                });
                $('#ajax-box2').load('/controllers/messages.php #blankEmail',function(){
                    $('#ajax-box2').dialog( "option", "title", "Invalid Email" ).dialog('open');
                     $('#ajax-box2').parent().attr('rel', 'purple');
                });
          }
          else{
            
            $("#ajax-box2").dialog({
                    modal: true,
                    height: 'auto',
                    width: '275px',
                    autoOpen: false,
                    dialogClass: 'ajaxbox',
                    buttons: {
                      Yes: function(){
                        $.ajax({
                          type: "POST",
                          url: "http://homepik.com/controllers/check-buyer.php",
                          data: {"email":email},
                          success: function(data){
                            var info = JSON.parse(data);
                            
                            if(info == null){
                              $.ajax({
                                type: "POST",
                                url: "http://homepik.com/controllers/change-buyer-info.php",
                                data: {"email":email},
                                success: function(data){
                                  $("#email").html( email );
                                  $("#save_email").html('<a style="color:#CC397B; cursor:pointer; text-decoration: underline;">edit</a>');
                                  $("#save_email").attr("id","edit_email");
                                  
                                  if(String(window.location).indexOf('menu.php') != -1){
                                    location.reload();
                                  }else if(String(window.location).indexOf('search.php') != -1){
                                    location.reload();
                                  }else if(String(window.location).indexOf('addressSearch.php') != -1){
                                    window.location.assign('/menu.php');
                                  }else{
                                    // Do nothing
                                  }
                                },
                                error: function(){
                                  console.log("failed");
                                }
                              });
                            }
                            else{
                              
                              if(email == old_email){
                                $("#email").html( email );
                                  
                                $("#save_email").html('<a style="color:#CC397B; cursor:pointer; text-decoration: underline;">edit</a>');
                                  
                                $("#save_email").attr("id","edit_email");
                              }
                              else{
                                $("#ajax-box2").dialog({
                                    modal: true,
                                    height: 'auto',
                                    width: '275px',
                                    autoOpen: false,
                                    dialogClass: 'ajaxbox',
                                    buttons: {
                                      Ok: function(){
                                        $(this).dialog("destroy");
                                      }
                                    },
                                    close: function() {
                                      $( this ).dialog( "destroy" );
                                    }
                                });
                                $('#ajax-box2').load('/controllers/messages.php #editEmail',function(){
                                    $('#ajax-box2').dialog( "option", "title", "Email Exists" ).dialog('open');
                                     $('#ajax-box2').parent().attr('rel', 'blue');
                                });
                              }
                              
                            }
                          },
                          error: function(){
                            
                          }
                        });
                        
                        $(this).dialog("destroy");
                      },
                      No: function(){
                        $(this).dialog("destroy");
                      }
                    },
                    close: function() {
                      $( this ).dialog( "destroy" );
                    }
                });
                $('#ajax-box2').load('/controllers/messages.php #changeEmail',function(){
                    $('#ajax-box2').dialog( "option", "title", "Change Email?" ).dialog('open');
                    $('#ajax-box2').parent().attr('rel', 'purple');
                    $("#changeEmail").find("#email").html(email); 
                });
          
            
          }
        });

        // Bind an event to window.onhashchange that, when the history state changes,
        // iterates over all tab widgets, changing the current tab as necessary.
        $(window).bind( 'hashchange', function(e) {
    
            // Iterate over all tab widgets.
            tabs.each(function(){
      
                // Get the index for this tab widget from the hash, based on the
                // appropriate id property. In jQuery 1.4, you should use e.getState()
                // instead of $.bbq.getState(). The second, 'true' argument coerces the
                // string value to a number.
                var	id = this.id,
                idx = e.getState( id, true ) || 0;
	  
                // Select the appropriate tab for this tab widget by triggering the custom
                // event specified in the .tabs() init above (you could keep track of what
                // tab each widget is on using .data, and only select a tab if it has
                // changed).
                $(this).find( tab_a_selector ).eq( idx ).triggerHandler( 'change' );
                // Show or hide search results and set header position to fixed or absolute
	  
                if(id == 'listings' && state['listings'] != undefined){
                    if (idx == 0) { // if changing back to the search results tab
                        $('#scrollwrapper').css('display','block');
			
                        /* for IE */
                        $('#new-thead .ui-jqgrid-htable').css('display','block');
                        $('#new-thead .ui-jqgrid-htable').css('display','table');
                        $('.ui-jqgrid .ui-jqgrid-hbox').css('border-bottom','1px solid #CCCCCC');
                        $('.table-header').css('position','absolute');
                        $('#address-box').addClass('results');
                        $('#key').show();
                        $('#results-tab a').html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Search Results');
                        window.scroll(0, scroll_to_y); // scroll_to_y is set in search.js, this returns them to how far they had scrolled in the search results before they had clicked to go to a listing page, 
                    } else if (idx != 0) { // if changing to a listing tab
                        $('#scrollwrapper').css('display','none');
                        $('#new-thead .ui-jqgrid-htable').css('display','none');	
                        $('.ui-jqgrid .ui-jqgrid-hbox').css('border-bottom','0px');	
                        $('.table-header').css('position','absolute');  
                        $('#address-box').removeClass('results');
                        //$('#key').hide();
                        $('#results-tab a').html('<span style="font-size:13px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Search Results</span>');
                    }
                }
	  
            });
        });
  
        // Since the event is only triggered when the hash changes, we need to trigger
        // the event now, if we want to use the hash the page may have loaded with.
        //  $(window).trigger( 'hashchange' );
  
        // CLOSE BUTTON 
 
        $( "#listings span.ui-icon-close" ).live( "click", function() {
            // Get the id of this tab widget.
 			
            var $listings = $('#listings').tabs(),
            index = $( "li", $listings ).index( $( this ).parent() );
            $('#listings').tabs( "remove", index );
			      tab_overflow(); // Handle tabs overflowing past the line (located in search.js)
            var tabs = $('#listings').tabs(),
            current = tabs.tabs('option', 'selected');
            if (current == 0) {
                var state = { };
                state [ 'listings' ] = 0;
                $.bbq.pushState( state );	
                $('#scrollwrapper').css('display','block');
                $('#new-thead .ui-jqgrid-htable').css('display','table');
                $('.ui-jqgrid .ui-jqgrid-hbox').css('border-bottom','1px solid #CCCCCC');
                $('.table-header').css('position','absolute');
            }
        });
        
        
    });

    $("#validate").validate();
    if(touch == true){
        myScroll = new iScroll('scroller', {
            desktopCompatibility:true
        });
    }

});
	
