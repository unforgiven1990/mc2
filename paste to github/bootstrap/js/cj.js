
function return_attributes2(class_tab){
    var df = data[class_tab]; //this will get df
    var row =df[0];//this will get first row
    var columns = Object.keys(row); //this gets column
    return columns;
}



function return_attributes(class_tab){
    var df = data[class_tab]; //this will get df
    var potential_result=[]
    $.each(df, function(key,value) {
        var row =df[key];//this will get first row
        var new_result = Object.keys(row); //this gets column
        if (new_result.length >= potential_result.length){
            potential_result=new_result;
        }
    });

    return potential_result;
}

var selected_destination_class='';

function traverse_to(start_node, end_node, cy){

selected_destination_class=end_node;
var aStar = cy.elements().aStar({ root: "#"+start_node, goal: "#"+end_node });
var traverse_nodes=aStar.path.connectedNodes();

//add style
cy.$('.red').removeClass('red').addClass('edge_default');
$.each(traverse_nodes, function(node_key,node_class) {  node_class.addClass('red');});
$.each(aStar.path, function(edge_key,edge_obj) {  edge_obj.addClass('red').removeClass('edge_default');});

update_class_display();
return traverse_nodes;
}



function update_class_display(){
//when a destination node is selected, change a different filter to display on class html
//go to the destination class and provide display options

// part 1 direct attributes
var current_class=get_current_class();
var direct_lis='<h6 class="dropdown-header">'+current_class+' Attributes</h6>'
var direct_attributes=return_attributes(current_class);
$.each(direct_attributes , function(index, val) {

    if (val==current_class){return;}
  var direct_li= '<li class="dropdown-item"><div class="form-check">  <input class="form-check-input big-checkbox" type="checkbox" value="'+val.replace(" ","_")+'_filter" id="'+val.replace(" ","_")+'_filter" checked /><label class="form-check-label" for="'+val.replace(" ","_")+'_filter">&nbsp; '+val.replace(" ","_")+'</label></div></li>'
    direct_lis=direct_lis+direct_li;
});


//part 2 indirect attributes
var indirect_lis='<h6 class="dropdown-header">'+selected_destination_class+' Attributes</h6>'
var indirect_attributes=return_attributes(selected_destination_class);
$.each(indirect_attributes , function(index, val) {
if (val.includes("For ")){return;}
if (val.includes("By ")){return;}
  var indirect_li= '<li class="dropdown-item"><div class="form-check">  <input class="form-check-input big-checkbox" type="checkbox" value="'+val.replace(" ","_")+'_filter" id="'+val.replace(" ","_")+'_filter" checked /><label class="form-check-label" for="'+val.replace(" ","_")+'_filter">&nbsp; '+val.replace(" ","_")+'</label></div></li>'
    indirect_lis=indirect_lis+indirect_li;
});

//if destination class is same as current class, then dont display indirect attributes
if(current_class == selected_destination_class) {
var final_lis=direct_lis;
 }
else {
var final_lis=direct_lis+'<div class="dropdown-divider"></div>'+indirect_lis;
}

$("#filter_ul").html(final_lis); // replaces inner tag and their old data with new data
$("#dropdownMenuButton").text('Select '+selected_destination_class+' Attribute'); // replaces inner tag and their old data with new data
}


function get_current_class(){
 return $('#header').attr("data-current_class");
}


function update_card_display(cy,event){
console.clear();

//update graph
var current_class = get_current_class();
var traverse_nodes=traverse_to(current_class, event.target.id(), cy);


    //update instance display
    //1. for each instance of the current class
    $('.card').each(function(i, obj) {
        if (i>0){}

        var card_instance = $(this).attr("id");
        var found_instances={};
        var starting_class=current_class; // is row ,left side of the table
        var starting_instance=card_instance;

        //2. traverse through their connected instances via precalculated classes they are connected to
        $.each(traverse_nodes, function(node_key,goal_class) {
            if(goal_class.id() == current_class){return;}else{

            }
            console.log("step2: ", starting_class," instance ", starting_instance," -> " , goal_class.id());

            var df =data[starting_class] // df compared to python

            //3. find the current df and go through each row of current df to find the current instance
            $.each(df, function(index,row) {


                //this row has no index element
                if (row[starting_class] === "undefined"){ return;}
                if (row[starting_class] === undefined){ return;}
                if (row[starting_class] === null){ return;}
                if (row[starting_class] == null){ return;}
                if ( !row[starting_class] ){ return;}


                console.log("step4: ", row[starting_class].replaceAll(" ","_"), ", ",starting_instance.replaceAll(" ","_"));

                //4. found the current instance row where starting_instance is the index column
                if (row[starting_class].replaceAll(" ","_").includes(starting_instance.replaceAll(" ","_"))) {
                    //console.log(card_instance,": ", starting_class,": ",goal_class.id(),": ", index,": ", row);
                    console.log("found ",);

                    //find the potential goal column For or By
                    var For_goal_class = "For " +goal_class.id();
                    var By_goal_class = "By " +goal_class.id();


                    var found=0; //0 means not found , 1 means For, 2 means By
                    if (Object.keys(row).includes(For_goal_class)){
                        found=1;
                        var found_instance = row[For_goal_class];
                    }else if (Object.keys(row).includes(By_goal_class)){
                        found=2;
                        var found_instance = row[By_goal_class];
                    }else{
                        found=3;
                    console.log("BUG ",Object.keys(row), ", " ,By_goal_class, ", ",For_goal_class );
                    }

                    if (found_instance == null){ return;}

                    //check if found is weird if it is not found, should not happen
                    if (found != 3){
                        //5. add instance to the found instances
                        //will be very difficult if it is multiple instances
                        //for now, lets consider only the first instance
                        console.log("step5: found ",goal_class.id(), found_instance);
                        console.log("step5: found ",goal_class.id(), found_instance.split(",")[0]);

                        found_instances[goal_class.id()]=found_instance.split(",")[0];
                        starting_instance=found_instance.split(",")[0]; // next step visit from this items perspective
                    }else{
                        //should not happen in theory
                        //alert("bug");
                    }
                }else{
                }
            });

            // set starting node as already traversed node
            starting_class=goal_class.id();
        });

        $('#'+card_instance+"_ul").empty();//clean up previous content

        //step 6
        $.each(found_instances , function(found_class, found_instance) {
        console.log("step6: create li ",found_class);
        $('#'+card_instance+"_ul").append($('<li>', {
            text : found_class+": "+found_instance
        }));//end of add card
        });

    });//end of step 1 for each loop


}




/*

$('#indirect_attribute').change(function(){
var indirect_class= $('#indirect_class').val();
var indirect_attribute= $('#indirect_attribute').val();

//hide all previous classes from direct attributes
$.each(current_class_attributes, function(attribute_key,attribute_value) {
$('.'+current_class_attributes[attribute_key].replaceAll(" ","_")+"_entry").hide();
});


//set initial state. not used at the moment
    $('#indirect_attribute').hide();
    $.each(data, function(key,value) {
      $('#indirect_class').append($('<option>', {
            value: key,
            text : key
        }));
    });



$('#indirect_class').change(function(){
    var tab=$('#indirect_class').val();
    var columns = return_attributes(tab)
    $('#indirect_attribute').show();
    $('#indirect_attribute').find('option').remove();
    $('#indirect_attribute').append($('<option>', {
            value: "Select Attribute",
            text : "Select Attribute"
        }));

    counter=0;
    $.each(columns, function(key,value) {
    //var row_column =row['Leader'] //this will get cell data from row 0 and column Leader

    $('#indirect_attribute').append($('<option>', {
            value: value,
            text : value
        }));
    counter++;
    });

    });

*/
