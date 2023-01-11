var cy;
var cy2;
var dict_cy={};
var page_class;
var page_instance;


//general helper functions
function get_cy2() {
    return cy2;
}

function get_page_instance() {
    return $("#header").attr("data-current_instance");
}

function get_page_class() {
    return $('#header').attr("data-current_class");
}

function space2underscore(word) {
    if (typeof(word)=="string"){
        return word.replaceAll(" ", "_");
    }else{
        return word;
    }
}

function underscore2space(word) {
    if (typeof(word)=="string"){
        return word.replaceAll("_", " ");
    }else{
        return word;
    }
}

function checkdata(value) {
    if (!value) {
        return false;
    } else if (typeof value == 'undefined') {
        return false;
    } else if (typeof value === 'undefined') {
        return false;
    } else if (value == 'undefined') {
        return false;
    } else if (value === 'undefined') {
        return false;
    } else if (value == null) {
        return false;
    } else if (value === null) {
        return false;
    } else if (value.length == 0) {
        return false;
    } else if (value.length === 0) {
        return false;
    } else if (value.length == '') {
        return false;
    } else if (value.length === '') {
        return false;
    }
    return true;
}




//general replace pandas function

function noforby(word) {
    var result = word.replaceAll("For ", "");
    result = result.replaceAll("By ", "");
    return result;
}

function get_all_class() {
    result = [];
    $.each(data, function(key, value) {
        result.push(key);
    });
    return result;
}

function get_all_instance(class_tab){
var result=[];
var df=data[class_tab];
    $.each(df, function(key, row) {
        result.push(row[class_tab]);
    });
    return result;
}

function get_cell(df, index, col, tab) {
    var result;
    $.each(df, function(index_as_number, row) { //traversing through the rows of a df
        $.each(row, function(column, cell_data) { //traversing in 1 row, through the columns
            if (noforby(column) == col) { // we found the column. column matches
                if (index == row[tab]) { //index matches
                    result = cell_data;
                }
            }
        });
    });
    return result;
}


//return as label not as array
function get_class_columns(class_tab) {
    var df = data[class_tab]; //this will get df
    var potential_result = []
    $.each(df, function(key, value) {
        var row = df[key]; //this will get first row
        var new_result = Object.keys(row); //this gets column
        if (new_result.length >= potential_result.length) {
            potential_result = new_result;
        }
    });
    return potential_result;
}








function create_cy(id, current_class = '', current_instance = '', elements = []) {

   if(id=="cy"){

        var layout_style="breadthfirst";
   }else{

    var layout_style="concentric";
   }


    var cy = cytoscape({
        container: document.getElementById(id), // container to render in
        wheelSensitivity: 0.05,
        autounselectify: false,
        elements: elements, //list of graph elements to start with
        style: [ // the stylesheet for the graph
            {
                selector: 'node',
                style: {
                    'background-color': "#999",
                    'shape': 'round-rectangle',
                    'label': 'data(label)',
                    'width': '90px',
                    'height': '50px',
                    'color': '#fff',
                    'text-halign': 'center',
                    'text-valign': 'center',
                    'text-wrap': 'wrap',
                    'text-max-width': "5px",
                    'text-overflow-wrap': "whitespace",
                }
            },
            {
                selector: '.red',
                css: {
                    'background-color': '#0099ff',
                    'line-color': '#0099ff',
                    'z-index': 99999,
                }
            },
            {
                selector: '.bigger',
                css: {
                    'width': '120px',
                    'height': '70px',
                }
            },

            {
                selector: '.blue',
                css: {
                    'background-color': '#0099ff',
                }
            },

            {
                selector: 'edge.blue',
                css: {
                    'line-color': 'red',
                }
            },

            {
                selector: '.edge_default',
                css: {
                    'line-color': '#eee',
                    'z-index': -1,
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 4,
                    'target-arrow-color': '#ccc',
                    'target-arrow-shape': '',
                    'curve-style': 'bezier'
                }
            }
        ],

        layout: {
            name: layout_style,
            spacingFactor: 0.85,
            avoidOverlap: true,
            animate: true,
            animationDuration: 1000,
        },
        ready: function() {

        }
    });


    //initialization
    //cy.$('#' + page_class).addClass('bigger');//make instance node look bigger
    cy.$('#' + page_class).addClass('red'); // make instance node blue
    cy.$('#' + page_instance).addClass('red');

    cy.$('edge').addClass('edge_default');
    if (page_class != "index") {
        if (cy == "cy") {
            traverse_to(page_class, page_class, cy);
        }
    }



    // right click even to jump to next page
    cy.on('cxttap', 'node', function() {
        try { // your browser may block popups
            window.open(this.data('href'), "_self");
        } catch (e) { // fall back on url change
            window.location.href = this.data('href');
        }
    });


    // bind tapstart to edges and highlight the connected nodes
    cy.bind('tapstart', 'edge', function(event) {
        var connected = event.target.connectedNodes();
        //connected.addClass('blue');
    });


    // bind tapend to edges and remove the highlight from the connected nodes
    cy.bind('tapend', 'edge', function(event) {
        var connected = event.target.connectedNodes();
        //connected.removeClass('blue');
    });

    // bind tapend to node and remove the highlight from the connected nodes
    if (id == "cy") {
        cy.bind('tapstart', 'node', function(event) {
            var traverse_nodes = traverse_to(page_class, event.target.id(), cy);
            dict_cy["cy2"]=create_cy(id = "cy2", current_class = page_class, current_instance = page_instance, elements = generate_instance_elements(page_class, event.target.id()));
        }); //end of binding

    }else  if (id == "cy2"){
        cy.bind('tapstart', 'node', function(event) {
            //works
        }); //end of binding
    }




    $.each(dict_cy, function(key, value) {
        console.log("inbinding ",key," : " , value);
      });


    dict_cy[id]=cy;
    return cy
}




//generate class network
function generate_class_elements(current_class, current_instance) {
    var elements = []
    var all_class = get_all_class();

    //calculate nodes
    $.each(all_class, function(key, val) {
        if (current_class == val && checkdata(current_instance)) {
            var label = underscore2space(current_instance) + " (" + underscore2space(val) + ")";
        } else {
            var label = underscore2space(val);
        }

        elements.push({
            data: {
                'id': val,
                'label': label,
                'href': "../../page/" + val + "/" + val + ".html"
            }
        });
        //elements.push({data: {'id':val , 'label': label, 'href':"../../page/"+val+"/"+val+".html"} });
    });


    //calculate edges
    var all_class = get_all_class();
    var alreadydone = [];
    $.each(all_class, function(key, val) { //1. for each tab
        var all_attributes_labels = get_class_columns(val); //return all attributes of that particular class /tab
        $.each(all_attributes_labels, function(row_index, row_val) { //2. for each tab, for each column
            //console.log("compare: ",val, " vs ",row_val);
            if (row_val.includes("For ") || row_val.includes("By ")) {
                //console.log("yer");
                var replaced_val = row_val.replaceAll("By ", "");
                replaced_val = replaced_val.replaceAll("For ", "");
                //console.log("replaced val ",replaced_val);
                if (replaced_val == val) {
                    return; //index which is the class himself
                }
                if (all_class.includes(replaced_val)) {
                    if (!alreadydone.includes(val + replaced_val) && !alreadydone.includes(replaced_val + val)) {
                        elements.push({
                            data: {
                                'id': val + '_' + replaced_val,
                                'source': val,
                                'target': replaced_val
                            }
                        });
                        alreadydone.push(val + replaced_val);
                        alreadydone.push(replaced_val + val);
                    }
                }
            }


        });
    });

    return elements;
}





//generate instance network
function generate_instance_elements(current_class, target_class) {
    var elements = []
    var all_class = get_all_class();

    //check what user has selected on the first chart
    var aStar = dict_cy["cy"].elements().aStar({
        root: "#" + current_class,
        goal: "#" + target_class
    });
    var all_traversed_nodes = aStar.path;
    var cleared_path=[];
    for (var i = 0; i < all_traversed_nodes.length; i++) {
        if(i % 2 === 0) { // index is even
            cleared_path.push(all_traversed_nodes[i].id());
        }
    }


    //Do breadth first algorithm (= calculate node and edges together)
    //1. go through all traversed classes
    //2. find each instances. store instance in node form and store instance edge in a edge form a->b. list of edges
    //3. give these elements to create_cy

    var found_instance_node_list = [];
    var found_instance_edge_list = [];
    var source_class = current_class;
    var source_instance = get_page_instance();

    //push for first node
    found_instance_node_list.push({
        data: {
            'id': source_instance,
            'label': underscore2space(source_instance) + " (" + underscore2space(page_class) + ")",
            'href': "../../page/" + source_instance + "/" + source_instance + ".html"
        }
    });


    //first node
    var first_target_class = get_target_class(current_class, cleared_path);
    var a_nodes=[{source_class:page_class, target_class:first_target_class, source_instance:page_instance}];
    var elements=rekursive_traverse(a_nodes=a_nodes,cleared_path=cleared_path);
    //big split here, if we split here we use option 1, else option2
    $.each(elements, function(key, testentry) {
        console.log("elements: ", testentry);
    });

    elements.push({
        data: {
            'id': current_instance,
            'label': underscore2space(current_instance),
            'href': "../../page/" + current_class + "/" + current_instance + ".html"
        }
    });

    return elements;



    $.each(cleared_path, function(key, target_node) { //1. go through all traversed classes =  tab
        var target_class = target_node;

        //there is this traverse bug where the same class is calculated again via connected nodes
        if (target_class == current_class) {
            return;
        }

        //2. find list of current class =index to traversed class
        //console.log(source_class,", ", target_class);
        var cell_data_or_array = get_cell(df = data[source_class], index = source_instance, col = target_class, tab = source_class);
        console.log("1. ", source_class, " -> 2. ", target_class, " -> 3. ", source_instance, " found 4. ", cell_data_or_array);


        //add node and edges to found data if found
        if (cell_data_or_array) {
            var item_array = cell_data_or_array.split(",");
            $.each(item_array, function(key, found_instance) {
                //push node

                found_instance_node_list.push({
                    data: {
                        'id': found_instance,
                        'label': underscore2space(found_instance),
                        'href': "../../page/" + found_instance + "/" + found_instance + ".html"
                    }
                });


                //push edge
                found_instance_edge_list.push({
                    data: {
                        'id': source_instance + found_instance,
                        'source': space2underscore(source_instance),
                        'target': space2underscore(found_instance)
                    }
                });
                //found_instance_node_list.push("fu");
                //console.log("resultasdsad is ",found_instance_node_list);
            });
        }

        //prepare for next edge, always do
        source_class = target_class;

    });



    return found_instance_node_list.concat(found_instance_edge_list);

}



// each mission is just to find the next instance, provided column, tab , class,df
//1. stop condition is when the the source_class is last class in path
//2. find all untraversed nodes, and continue rekursive_traverse(sad)
//3. starting position of untraversed noes = current_class & current_instance
//4. result is a list of nodes + their connected edges in form of elements
//

/**
 * input a_node = [{instance:'', source_class:'', target_class''}]
 * input path = path of stuff [[source_class,target_class],[source_class, targetclass], ...]
 *
 * output [{node},{edge},{node}]
 *
 *                  {
                    data: {
                        'id': found_instance,
                        'label': underscore2space(found_instance),
                        'href': "../../page/" + found_instance + "/" + found_instance + ".html"
                    }

 */



function get_target_class(current_class, cleared_path){
    var helper_index;
    var result=-1;
    $.each(cleared_path, function(index, traversed_node) {
        if(traversed_node==current_class){
            helper_index=index;
            if (helper_index+1 == cleared_path.length){
                    //is last element, not more elements
                    //return -1;
            }else{
                //found the element
                result= cleared_path[helper_index+1];
            }
        }else{
            //console.log(traversed_node," botvs  ",current_class, "index is ",index);
        }
    });

return result;//not found current_node in path, which is strange,should not happen
}


//there are two version. 1 version to keep passing results, one version to aggregate results. option2
function rekursive_traverse(a_nodes, cleared_path, came="0"){
    if (checkdata(a_nodes==false)){
        return [];
    }


    if (a_nodes.length==0){//if list is 0 =  finished
        console.log("section 1. ", a_nodes, came);
        return [];
    }else if (a_nodes.length>1){// list has more than 1 node

        //do the first one, give the next one to rekursion
        var first_part=rekursive_traverse([a_nodes[0]], cleared_path, came="2.1");
        var other_part=rekursive_traverse(a_nodes.shift(), cleared_path, came="2.2");

        return first_part.concat(other_part);
    }else if (a_nodes.length=1){ // list has exactly 1 node

        //if a_nodes is undefined, then continue
        //expand of existing information
        try{
            var source_class=a_nodes[0]["source_class"];
            var target_class=a_nodes[0]["target_class"];
            var source_instance=a_nodes[0]["source_instance"];
        }catch{
            console.log("section 3.1 ", a_nodes, came);
            return [];
        }

        console.log("section 3.2 ", a_nodes, came);



        if (target_class==-1){
            console.log("section 3.3 ", a_nodes, came);
            return []; // the node has children but user doesnt want to see it. potential bug
        }


        //initialize for rekursion
        var next_a_nodes=[];//array instance name, tab, class

        //initialize for cy
        var found_instance_for_cy=[];//array instance name, tab, class
        var found_edge_for_cy=[];//array

        //now everyhing can be traversed, is not last path class.
        var cell_data=get_cell(df=data[source_class], index=source_instance, col=target_class, tab=source_class)
        if (checkdata(cell_data)){
            //do nothing
        }else{
            cell_data="";
        }


        //traverse thorugh all results to see comma items
        $.each(cell_data.split(","), function(cell_index, cell_content) {

            //if found instance has no data, ''
            if (cell_content==''){
                return;
            }

            //prepare for next rekursion
            var next_target_class = get_target_class(source_class=target_class, cleared_path=cleared_path);
            next_a_nodes.push({source_class:target_class, target_class:next_target_class, source_instance:cell_content});


            //result for cy nodes
            var one_found_node={
                data: {
                    'id': cell_content,
                    'label': underscore2space(cell_content),
                    'href': "../../page/" + target_class + "/" + cell_content + ".html"
                }
            };
            found_instance_for_cy.push(one_found_node);


            //result for cy edges
            var one_found_edge={
                data: {
                    'id': source_instance+cell_content,
                    'source': source_instance,
                    'target': cell_content
                }
            };
            found_edge_for_cy.push(one_found_edge);


        });


        var found_together=found_instance_for_cy.concat(found_edge_for_cy);

        //general: always let founded instance traverse to their instance
        //specific: if their target_class==-1(not in path) or i
        console.log("end node ",a_nodes);
        return found_together.concat(rekursive_traverse(a_nodes=next_a_nodes, cleared_path=cleared_path , came="3"));

    }

}




var selected_destination_class = '';
function traverse_to(start_node, end_node, cy) {

    selected_destination_class = end_node;
    var friking_elements = cy.elements();
    var aStar = friking_elements.aStar({
        root: "#" + start_node,
        goal: "#" + end_node
    });
    var traverse_nodes = aStar.path.connectedNodes();

    //add style
    cy.$('.red').removeClass('red').addClass('edge_default');
    $.each(traverse_nodes, function(node_key, node_class) {
        node_class.addClass('red');
    });
    $.each(aStar.path, function(edge_key, edge_obj) {
        edge_obj.addClass('red').removeClass('edge_default');
    });

    //update_class_display();
    return traverse_nodes;
}



function update_select(select_id, options){
    var final_lis='';
    $.each(options, function(index, val) {

        if (select_id=="#filter_class"){
            var new_li = '<option value="'+val+'" >Vs '+underscore2space(val)+'</option>';
        }else{
            var new_li = '<option value="'+val+'" >'+underscore2space(val)+'</option>';
        }

        final_lis=final_lis+new_li;
    });
    $(select_id).html(final_lis);
}

function produce_lis(a_lis){
var ul="";
var lis="";

$.each(a_lis, function(index, item) {
var li="<li>"+underscore2space(item)+"</li>";
lis=lis+li;
});

return "<ul>"+lis+"</ul>";
}


function display_instance_attribute_aslist(instance,instance_class){
var df=data[instance_class];
var lis="";

    $.each(df, function(df_index, row) {
        if(row[instance_class]==instance){
            $.each(row, function(row_index, cell_data) {
                if (typeof(cell_data)!="string"){
                    var li="<li>"+row_index+": "+underscore2space(cell_data)+"</li>";
                    lis=lis+li;

                }else if (cell_data.includes(",")){
                    var li="<li>"+row_index+": "+produce_lis(cell_data.split(","))+"</li>";
                    lis=lis+li;
                }else{
                    var li="<li>"+row_index+": "+underscore2space(cell_data)+"</li>";
                    lis=lis+li;
                }

            });
        }
    });

    var ul="<ul>"+lis+"</ul>";

return ul ;
}

function get_layout_options(){
var result=["cose", "random", "concentric","grid","circle", "breadthfirst"];
return result;
}


$(document).ready(function() {
    page_class = get_page_class();
    page_instance = get_page_instance();
    //initialization filter class and instance to allow dropdown to be selected
    //get all vailable tabs
    update_select("#filter_class",get_all_class());
    update_select("#layoutselect", get_layout_options());
    $('#layoutselect').change(function(){
        var selected_layout = $('#layoutselect').val();
        var layout = dict_cy["cy2"].layout({
            name: selected_layout
        });

        layout.run();
    });

    $('#filter_class').change(function(){
        var all_instances=get_all_instance($("#filter_class").find(":selected").val());
        var selected_class = $('#filter_class').val();
        $("#versus").empty();
        update_select("#filter_instance",["Specify "+selected_class].concat(all_instances));
    });
    //select the current class
    $('#filter_class').val(page_class).change();

     $('#filter_instance').change(function(){
        var selected_instance = $('#filter_instance').val();
        var selected_class = $('#filter_class').val();
        var ul= display_instance_attribute_aslist(instance=selected_instance,instance_class=selected_class);
        $('#versus').html(ul);
    });


    //$('#filter_instance').addClass('blue');




    if (page_class == "index") { //index page
        cy = create_cy(id = "cy", current_class = '', current_instance = '', elements = generate_class_elements(page_class, page_instance));
        cy.$('node').addClass('blue'); //highlight and make all nodes blue

    } else if (checkdata(page_class) && checkdata(page_instance)) { //instance page
        cy = create_cy(id = "cy", current_class = page_class, current_instance = page_instance, elements = generate_class_elements(page_class, page_instance));

    } else if (page_class != "" && page_instance == "") { // class page
        cy = create_cy(id = "cy", current_class = page_class, current_instance = '', elements = generate_class_elements(page_class, page_instance));

    }

});
















/**
 *
 *
 * //update instance display
    //1. for each instance of the current class
    $('.card').each(function(i, obj) {
        if (i > 0) {}

        var card_instance = $(this).attr("id");
        var found_instances = {};
        var starting_class = current_class; // is row ,left side of the table
        var starting_instance = card_instance;

        //2. traverse through their connected instances via precalculated classes they are connected to
        $.each(traverse_nodes, function(node_key, goal_class) {
            if (goal_class.id() == current_class) {
                return;
            } else {

            }
            //console.log("step2: ", starting_class," instance ", starting_instance," -> " , goal_class.id());

            var df = data[starting_class] // df compared to python

            //3. find the current df and go through each row of current df to find the current instance
            $.each(df, function(index, row) {


                //this row has no index element
                if (row[starting_class] === "undefined") {
                    return;
                }
                if (row[starting_class] === undefined) {
                    return;
                }
                if (row[starting_class] === null) {
                    return;
                }
                if (row[starting_class] == null) {
                    return;
                }
                if (!row[starting_class]) {
                    return;
                }


                //console.log("step4: ", row[starting_class].replaceAll(" ","_"), ", ",starting_instance.replaceAll(" ","_"));

                //4. found the current instance row where starting_instance is the index column
                if (row[starting_class].replaceAll(" ", "_").includes(starting_instance.replaceAll(" ", "_"))) {
                    //console.log(card_instance,": ", starting_class,": ",goal_class.id(),": ", index,": ", row);
                    //console.log("found ",);

                    //find the potential goal column For or By
                    var For_goal_class = "For " + goal_class.id();
                    var By_goal_class = "By " + goal_class.id();


                    var found = 0; //0 means not found , 1 means For, 2 means By
                    if (Object.keys(row).includes(For_goal_class)) {
                        found = 1;
                        var found_instance = row[For_goal_class];
                    } else if (Object.keys(row).includes(By_goal_class)) {
                        found = 2;
                        var found_instance = row[By_goal_class];
                    } else {
                        found = 3;
                        //console.log("BUG ",Object.keys(row), ", " ,By_goal_class, ", ",For_goal_class );
                    }

                    if (found_instance == null) {
                        return;
                    }

                    //check if found is weird if it is not found, should not happen
                    if (found != 3) {
                        //5. add instance to the found instances
                        //will be very difficult if it is multiple instances
                        //for now, lets consider only the first instance
                        //console.log("step5: found ",goal_class.id(), found_instance);
                        //console.log("step5: found ",goal_class.id(), found_instance.split(",")[0]);

                        found_instances[goal_class.id()] = found_instance.split(",")[0];
                        starting_instance = found_instance.split(",")[0]; // next step visit from this items perspective
                    } else {
                        //should not happen in theory
                        //alert("bug");
                    }
                } else {}
            });

            // set starting node as already traversed node
            starting_class = goal_class.id();
        });

        $('#' + card_instance + "_ul").empty(); //clean up previous content

        //step 6
        $.each(found_instances, function(found_class, found_instance) {
            //console.log("step6: create li ",found_class);
            $('#' + card_instance + "_ul").append($('<li>', {
                text: found_class + ": " + found_instance
            })); //end of add card
        });

    }); //end of step 1 for each loop





    function update_class_filter_options() {
    //when a destination node is selected, change a different filter to display on class html
    //go to the destination class and provide display options

    // part 1 direct attributes
    var current_class = get_page_class();
    var direct_lis = '<h6 class="dropdown-header">' + current_class + ' Attributes</h6>'
    var direct_attributes = get_class_columns(current_class);
    $.each(direct_attributes, function(index, val) {

        if (val == current_class) {
            return;
        }
        var direct_li = '<li class="dropdown-item"><div class="form-check">  <input class="form-check-input big-checkbox" type="checkbox" value="' + val.replace(" ", "_") + '_filter" id="' + val.replace(" ", "_") + '_filter" checked /><label class="form-check-label" for="' + val.replace(" ", "_") + '_filter">&nbsp; ' + val.replace(" ", "_") + '</label></div></li>'
        direct_lis = direct_lis + direct_li;
    });


    //part 2 indirect attributes
    var indirect_lis = '<h6 class="dropdown-header">' + selected_destination_class + ' Attributes</h6>'
    var indirect_attributes = get_class_columns(selected_destination_class);
    $.each(indirect_attributes, function(index, val) {
        if (val.includes("For ")) {
            return;
        }
        if (val.includes("By ")) {
            return;
        }
        var indirect_li = '<li class="dropdown-item"><div class="form-check">  <input class="form-check-input big-checkbox" type="checkbox" value="' + val.replace(" ", "_") + '_filter" id="' + val.replace(" ", "_") + '_filter" checked /><label class="form-check-label" for="' + val.replace(" ", "_") + '_filter">&nbsp; ' + val.replace(" ", "_") + '</label></div></li>'
        indirect_lis = indirect_lis + indirect_li;
    });

    //if destination class is same as current class, then dont display indirect attributes
    if (current_class == selected_destination_class) {
        var final_lis = direct_lis;
    } else {
        var final_lis = direct_lis + '<div class="dropdown-divider"></div>' + indirect_lis;
    }

    $("#filter_ul").html(final_lis); // replaces inner tag and their old data with new data
    $("#dropdownMenuButton").text('Select ' + selected_destination_class + ' Attribute'); // replaces inner tag and their old data with new data
}





function reminder(class_tab) {
    var df = data[class_tab]; //this will get df
    var row = df[0]; //this will get first row
    var columns = Object.keys(row); //this gets column
    return columns;
}


 */