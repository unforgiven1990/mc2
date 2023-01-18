var cy;
var cy2;
var dict_cy={};
var page_class;
var page_instance;
var last_event;


//general helper functions
function get_cy2() {
    return cy2;
}

//get page instance
function get_page_instance() {
    return $("#header").attr("data-current_instance");
}

//get page class
function get_page_class() {
    return $('#header').attr("data-current_class");
}

//replace word
function space2underscore(word) {
    if (typeof(word)=="string"){
        return word.replaceAll(" ", "_");
    }else{
        return word;
    }
}

//replace word
function underscore2space(word) {
    if (typeof(word)=="string"){
        return word.replaceAll("_", " ");
    }else{
        return word;
    }
}

//replace wprd
function noforby(word) {
    var result = word.replaceAll("For ", "").replaceAll("By ", "");
    return result;
}

//check for nan, null
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


//check if a given instance has its own url
function get_instance_url(instance){
    if( checkdata(instance) ==false ){
        return "";
    }

    var result="";
    $.each(data, function(class_tab, df) {
        $.each(df, function(row_index, row) {// [0: [{col: data},{col: data} ]]
            $.each(row, function(row_col, cell_data) {
                if( (row[class_tab]==instance) &&(result=='') ){
                    result = '../../page/'+class_tab+'/'+instance+'.html';
                    console.log("result instance ", instance);
                }
            });
        });
    });
    return result;
}

//get all classes
function get_all_class() {
    var result = [];
    $.each(data, function(key, value) {
        result.push(key);
    });
    return result;
}

//get direct relations
function get_related_class(tab){
var result=new Set();
var df=data[tab];
    $.each(df, function(row_index, row) {
        $.each(row, function(column_name, cell_data) {
            if(column_name.includes("For ") || column_name.includes("By ")){
                result.add(column_name.replace("For ","").replace("By ",""));
            }
        });
    });
return [tab].concat(Array.from(result));
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


//get all instances of one class
function get_all_instance(class_tab){
var result=[];
var df=data[class_tab];
    $.each(df, function(key, row) {
        result.push(row[class_tab]);
    });
    return result;
}


//col is written without For By
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


//draw chart 2
function update_chart2(){
    var event = window.last_event;
    var target_class=event.target.id();
    var traverse_nodes = traverse_to(page_class, event.target.id(), dict_cy["cy"]);
    dict_cy["cy2"]=create_cy(id = "cy2", current_class = page_class, current_instance = page_instance,  elements = generate_instance_elements(page_class, event.target.id() , highlight_class=target_class));
    dict_cy["cy3"]=create_cy(id = "cy3", current_class = page_class, current_instance = page_instance,  elements = generate_instance_elements(page_class, event.target.id() , highlight_class=target_class));
}


//draw chart in general
function create_cy(id, current_class = '', current_instance = '', elements = []) {
    if(id=="cy"){
        var layout_style="cise";
    }else{
        var selected_layout= $("#layoutselect").val();
        if (checkdata(selected_layout)){
            var layout_style=selected_layout.replace(" layout", "");
        }else{
            console.log("selected layout is ",selected_layout);
            var layout_style="concentric";
        }
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
                    'width': '20px',
                    'height': '20px',
                    'color': '#000',
                    'text-halign': 'center',
                    'text-wrap': 'wrap',
                    'text-max-width': "150px",
                    'text-overflow-wrap': "whitespace",
                }
            },
            {
                selector: '.blue',
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
                selector: '.red',
                css: {
                    'background-color': 'red',
                }
            },

            {
                selector: '.highlight',
                css: {
                    'background-color': 'red',
                }
            },

            {
                selector: 'edge.blue',
                css: {
                    'line-color': '#0099ff',
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
            spacingFactor: 1,
            avoidOverlap: true,
            padding: 20,
            refresh:2000,
            animate: true,
            nodeDimensionsIncludeLabels: true,
            idealInterClusterEdgeLengthCoefficient: 0.95,
            nodeRepulsion: 50000,
        },
        ready: function() {

        }
    });




    //initialization
    //cy.$('#' + page_class).addClass('bigger');//make instance node look bigger
    cy.$('#' + page_class).addClass('blue'); // make instance node blue
    cy.$('#' + page_instance).addClass('blue');

    //add default class to edges
    cy.$('edge').addClass('edge_default');
    if (page_class != "index") {
        if (cy == "cy") {
            traverse_to(page_class, page_class, cy);
        }
    }

    //highlight the end node in instance chart

    $.each(cy.$('node'), function(key, val) {
        console.log("asdsadsa ",key,val.data());
        var node_data=val.data();
        var lis=[];
        if(node_data["class"]=="highlight"){
            val.addClass("highlight");
            lis.push("<li>"+underscore2space(node_data['id'])+"</li>");
        }else{
            //for chart 2 and 3
            if (id!="cy"){
                val.addClass("blue");
            }
        }
        $("#indirect_result").append(lis.join());

    });



    //right click even to jump to next page
    cy.on('cxttap', 'node', function() {
        try { // your browser may block popups
            window.open(this.data('href'), "_self");
        } catch (e) { // fall back on url change
            window.location.href = this.data('href');
        }
    });

    //bind tapstart to edges and highlight the connected nodes
    cy.bind('tapstart', 'edge', function(event) {
        var connected = event.target.connectedNodes();
    });

    // bind tapend to edges and remove the highlight from the connected nodes
    cy.bind('tapend', 'edge', function(event) {
        var connected = event.target.connectedNodes();
    });

    // bind tapend to node and remove the highlight from the connected nodes
    if (id == "cy") {
        cy.bind('tapstart', 'node', function(event) {
            window.last_event=event;
            $("#indirect_result").html("Indirect Results:");
            update_chart2();

        }); //end of binding
    }else  if (id == "cy2"){
        cy.bind('tapstart', 'node', function(event) {
            //works
        }); //end of binding
    }

    dict_cy[id]=cy;
    return cy
}




//generate class network
function generate_class_elements(current_class, current_instance) {
    var elements = []
    var all_class = get_all_class();
    if (current_instance==""){
        all_class = get_related_class(current_class);
    }

    //calculate nodes
    $.each(all_class, function(key, val) {
        if (current_class == val && checkdata(current_instance)) {
            var label =  underscore2space(val)+ " = "+ underscore2space(current_instance)   ;
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
function generate_instance_elements(current_class, target_class, highlight_class) {
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
            'label': underscore2space(page_class)+" =\n"+underscore2space(source_instance),
            'href': "../../page/" + source_instance + "/" + source_instance + ".html"
        }
    });

    //first node
    var first_target_class = get_target_class(current_class, cleared_path);
    var a_nodes=[{source_class:page_class, target_class:first_target_class, source_instance:page_instance}];
    var elements=rekursive_traverse(a_nodes=a_nodes,cleared_path=cleared_path);


    //first node
    elements.push({
        data: {
            'id': current_instance,
            'label': underscore2space(current_class)+" =\n"+underscore2space(current_instance),
            'href': "../../page/" + current_class + "/" + current_instance + ".html"

        }
    });

    return elements;
}



// each mission is just to find the next instance, provided column, tab , class,df
//1. stop condition is when the the source_class is last class in path
//2. find all untraversed nodes, and continue rekursive_traverse(sad)
//3. starting position of untraversed noes = current_class & current_instance
//4. result is a list of nodes + their connected edges in form of elements
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
//a_nodes = nodes to be traversed andprocessed, cleared path is result
function rekursive_traverse(a_nodes, cleared_path, came="0"){
    if (checkdata(a_nodes==false)){ //a_nodes is undefined
        console.log("section 0. ", a_nodes, a_nodes.length, came);
        return [];
    }
    if (a_nodes.length==0){// a_nodes.leng == 0
        console.log("section 1. ", a_nodes,  a_nodes.length, came);
        return [];
    }else if (a_nodes.length>1){// a_nodes.leng > 1

        //do the first one, give the next one to rekursion
        var first_part=rekursive_traverse([a_nodes[0]], cleared_path, came="2.1"); //split first node
        console.log("section 2.1 ", a_nodes, a_nodes.length, came, [a_nodes[0]]);

        var other_part=rekursive_traverse(a_nodes.slice(1), cleared_path, came="2.2"); //rest of the nodes
        console.log("section 2.2 ", a_nodes, a_nodes.length, came, a_nodes.slice(1));
        return first_part.concat(other_part);

    }else { // a_nodes.leng == 1

        //if a_nodes is undefined, then continue
        //expand of existing information
        try{
            var source_class=a_nodes[0]["source_class"];
            var target_class=a_nodes[0]["target_class"];
            var source_instance=a_nodes[0]["source_instance"];
        }catch{
            console.log("section 3.1 ", a_nodes,  a_nodes.length,came);
            return [];
        }

        // the node has children but user doesnt want to see it. potential bug
        if (target_class==-1){
            console.log("section 3.2 ", a_nodes, a_nodes.length, came);
            return [];  }

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

            //add class for the last element in instance chart
            if(source_class==cleared_path[cleared_path.length-1]){
                var highlightornot='highlight';
            }else{
                var highlightornot='';
            }

            //result for cy nodes
            var one_found_node={
                data: {
                    'id': cell_content,
                    'label': source_class.replace("_"," ")+" =\n"+underscore2space(cell_content),
                    'href': "../../page/" + target_class + "/" + cell_content + ".html",
                    'class': highlightornot
                }
            };

            //add to array
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
        console.log("section 3.3 ", a_nodes, a_nodes.length, came, next_a_nodes);
        return found_together.concat(rekursive_traverse(a_nodes=next_a_nodes, cleared_path=cleared_path , came="3.3"));
    }
}


//traverse to nodes
var selected_destination_class = '';
function traverse_to(start_node, end_node, cy) {

    //prepare to traverse in aStar
    selected_destination_class = end_node;
    var friking_elements = cy.elements();
    var aStar = friking_elements.aStar({
        root: "#" + start_node,
        goal: "#" + end_node
    });
    var traverse_nodes = aStar.path.connectedNodes();

    //add style
    cy.$('.blue').removeClass('blue').addClass('edge_default');
    cy.$('.red').removeClass('red').addClass('edge_default');
    $.each(traverse_nodes, function(node_key, node_class) {
        node_class.addClass('blue');
    });

    //adjust color
    var last = traverse_nodes[traverse_nodes.length - 1];
    last.addClass('red').removeClass('blue');
    $.each(aStar.path, function(edge_key, edge_obj) {
        edge_obj.addClass('blue').removeClass('edge_default');
    });

    return traverse_nodes;
}


//update select by option
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

//create lis with ul
function produce_lis(a_lis){
    var ul="";
    var lis="";
    $.each(a_lis, function(index, item) {
    var li=produce_li_for_word("",item);
    lis=lis+li;
    });
return "<ul>"+lis+"</ul>";
}

//produce individual lis
function produce_li_for_word(row_index,cell_data){
    var url = get_instance_url(cell_data);
    var dot = row_index!="" ? ": ": "";
    row_index=row_index.replace("_", " ");
    if (url !=''){
        var li="<li class='noli'>"+row_index+dot+"<a href='"+url+"'>"+underscore2space(cell_data)+"</a></li>";
    }else{
        var li="<li class='noli'>"+row_index+dot+""+underscore2space(cell_data)+"</li>";
    }
    return li;
}

//display left or right side list
function display_instance_attribute_aslist(instance,instance_class){
    var df=data[instance_class];
    var lis="";
    var tds='';
    $.each(df, function(df_index, row) {
        if(row[instance_class]==instance){
            $.each(row, function(row_index, cell_data) {
                console.log(cell_data, typeof(cell_data));
                var result_display;// result can belink, can be <a></a>
                if (checkdata(cell_data)==false){// not string at all
                    //lis=lis+produce_li_for_word(row_index, cell_data);
                }else if (row_index == "MC2 Link" || row_index == "Process Flow" || row_index == instance_class){

                }else if(typeof(cell_data)=="string"){

                    tds=tds+'<tr><td class="labeltd" >'+row_index.replace("_", " ")+'</td>' +'<td>'+produce_lis(cell_data.split(","))+'</td></tr>'







                }

            });
        }
    });

    if (tds==""){

        return "<p> there is no direct data for this entry </p>"
    }

    //old ul with row
    var ul="<ul>"+lis+"</ul>";
    var ul=`<table class="table">    <tbody> ${tds}   </tbody>  </table>`;
    return ul;
}






//create all layouts
function get_layout_options(){
    return ["dagre layout", "breadthfirst layout", "cose layout", "cise layout",  "concentric layout","circle layout"];
}

//only used for user journey page
window.addEventListener('DOMContentLoaded', function(){
const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        const id = entry.target.getAttribute('id');
        if (entry.intersectionRatio > 0) {
            document.querySelector(`nav li a[href="#${id}"]`).parentElement.classList.add('active');
        } else {
            document.querySelector(`nav li a[href="#${id}"]`).parentElement.classList.remove('active');
        }
    });
});

// Track all sections that have an `id` applied
document.querySelectorAll('section[id]').forEach(function(section)  {
    observer.observe(section);
});
});


//update country select
function update_select_country(){
    var options='';//list of all available countries
    var countries=get_all_instance("Country");
    $.each(countries, function(row_index, country) {
    options=options+'<option value="'+country+'" >'+country+'</option>'
    });
    $("#select_country").html(options);
}

//update business mode select
function update_select_business(){
    var options='';//list of all available countries
    var businesses=get_all_instance("Business_Model");
    $.each(businesses, function(row_index, business) {
        options=options+'<option value="'+business+'" >'+business+'</option>'
    });
    $("#select_business").html(options);

    //select the one of the current page
    var selected_bm= $("#main").data("forjourney");
    $("#select_business").val(selected_bm);
}

//update user view or employee perspective select
function update_select_perspective(){
    $("#select_perspective").html('<option value="User_Journey">User Perspective</option><option value="Employee_Journey">Employee Perspective</option>');

    var selected_persp= $("#main").data("forperspective");
    $("#select_perspective").val(selected_persp);

}


//update business model options
function update_bm_options(){
    var selected_country=$('#select_country').val();

    //provide only business model denmark can select
    df_country=data["Country"];
    var allowed_bm=get_cell(df=df_country, index=selected_country, col="Business_Model", tab="Country");
    var new_options="";

    $.each(allowed_bm.split(","), function(index, val) {
        new_options=new_options+"<option value='"+val+"'>"+val+"</option>"
    });
    $("#select_business").html(new_options);
}


//switch user journet to other user journey
function jump_to_journey(){
    var selected_bm=$('#select_business').val();
    var selected_perspective=$('#select_perspective').val();
    var url = "../"+selected_perspective+"/"+selected_perspective+"_"+selected_bm+".html";
    $(location).attr('href',url);
}


//main function
$(document).ready(function() {

    //initialize
    page_class = get_page_class();
    page_instance = get_page_instance();
    update_select_business();
    update_select_perspective();
    $('#select_business, #select_perspective').change(function(){
        jump_to_journey();
    });


    //initialization filter class and instance to allow dropdown to be selected
    update_select("#filter_class",get_all_class());
    update_select("#layoutselect", get_layout_options());

    //modal show and hide
    $('#fullscreen_button').click(function(){         $("#modal").modal("show");});
    $('#modal_close').click(function(){        $("#modal").modal("hide");    });
    
    $('#layoutselect').change(function(){
        var selected_layout = $('#layoutselect').val();
        update_chart2();
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

    //update the left side
    var ul= display_instance_attribute_aslist(instance=page_instance,instance_class=page_class);
    $('#left_direct').html(ul);



    if (page_class == "index") { //index page
        cy = create_cy(id = "cy", current_class = '', current_instance = '', elements = generate_class_elements(page_class, page_instance));
        cy.$('node').addClass('blue'); //highlight and make all nodes blue
    } else if (checkdata(page_class) && checkdata(page_instance)) { //instance page
        cy = create_cy(id = "cy", current_class = page_class, current_instance = page_instance, elements = generate_class_elements(page_class, page_instance));
    } else if (page_class != "" && page_instance == "") { // class page
        if ($("#cy").length > 0){//if this chart exists
            cy = create_cy(id = "cy", current_class = page_class, current_instance = '', elements = generate_class_elements(page_class, page_instance));
          }
    }

    //only for user journey
    $(window).on('scroll', () => {
      update_nav();
    })


});
