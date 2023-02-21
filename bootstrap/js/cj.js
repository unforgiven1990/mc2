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
function noforby(word, instance_class='') {
    //it is basically reducing a display id to
    //var result = word.replaceAll("For ", "").replaceAll("By ", "");
    var result = col_linked(instance_class=instance_class, col=word, type=2);
    return result;
}


//get all linkable cols
function get_linkable_cols(instance_class, return_type=1){
    var helper=link[instance_class];
    if (checkdata(helper)==false){
        return ""
    }

    if (return_type == 1){
        return helper;
    }else if (return_type == 2){ //only keys
        return Object.keys(helper);
    }else if (return_type == 3){ // only values
        //console.log(typeof(helper),helper);
        return helper.values;
    }else{
        return helper;
    }
}


//get bool or id of real col
function col_linked(instance_class, col, type=2){
    var all_links_of_class = get_linkable_cols(instance_class=instance_class,return_type=1);

    if (checkdata(all_links_of_class)==false){
        if(type==1){// two times 1 is correct
            return false;
        }else{
            return "";
        }
    }

    if(Object.keys(all_links_of_class).includes(col)){
        if(type==1){//two times 1 is correct
            return true;
        }else{
            //console.log("real col found is ",instance_class, col , " col id is ", all_links_of_class[col]);
            return all_links_of_class[col];
        }
    }else{
        if(type==1){// two times 1 is correct
            return false;
        }else{
            return "";
        }
    }
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
    } else if (value === "null") {
        return false;
    } else if (value == null) {
        return false;
    } else if (value === "null") {
        return false;}
    else if (value.length == 0) {
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
    instance=instance.trim();

    var result="";
    $.each(data, function(class_tab, df) {
        $.each(df, function(row_index, row) {// [0: [{col: data},{col: data} ]]
            $.each(row, function(row_col, cell_data) {
                if( (row[class_tab]==instance) && (result=='') ){
                    result = '../../page/'+class_tab+'/'+instance+'.html';
                    //console.log("result instance ", instance);
                }else{
                    //console.log("result instance ", instance, " not found",row[class_tab] );
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
            //if(column_name.includes("For ") || column_name.includes("By ")){
              //  result.add(column_name.replace("For ","").replace("By ",""));
            //}
            var id_name_bool=col_linked(instance_class=tab, col=column_name, type=1);
            var id_name_value=col_linked(instance_class=tab, col=column_name, type=2);
            if(id_name_bool){
                result.add(id_name_value);
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
    //console.log(class_tab,result);
    return result;
}


//col is written without For By
function get_cell(df, index, col, tab){
    //column is native display data, col is id
    var result;
    $.each(df, function(index_as_number, row) { //traversing through the rows of a df
        $.each(row, function(column, cell_data) { //traversing in 1 row, through the columns
            //if (col_linked(instance_class=tab, col=column) == col) { // we found the column. column matches
            if ((noforby(column, instance_class=tab) == col) || (column == col)) {
                if (index == row[tab]) { //index matches
                    result = cell_data;
                }  else{
                    //console.log("not matching ",index, row[tab], cell_data);
                }
            }else{
                //console.log("not matching column ",column, col);
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


//draw chart 2
function update_chart2_butnotdraw(target_class){
    var traverse_nodes = traverse_to(page_class, target_class, dict_cy["cy"]);
    dict_cy["cy2"]=create_cy(id = "cy2", current_class = page_class, current_instance = page_instance,  elements = generate_instance_elements(page_class, target_class , highlight_class=target_class));
    dict_cy["cy3"]=create_cy(id = "cy3", current_class = page_class, current_instance = page_instance,  elements = generate_instance_elements(page_class, target_class, highlight_class=target_class));
}



function mycise(){
    var fit= true;
    var animate=true;
return {
            name: "cise",
            spacingFactor: 1,
            avoidOverlap: true,
            //rankDir: 'TB',
            //ranker: 'network-simplex',
            fit:fit,
            padding: 20,
            refresh:20000,
            animate: animate,
            nodeDimensionsIncludeLabels: true,
            idealInterClusterEdgeLengthCoefficient: 1.00, //also the bigger the more far away
            nodeRepulsion: 6000, //the bigger the more far away
        }
}



function mydagre(layout="dagre"){
fit=true;
        animate=false;
return {
            name: layout,
            spacingFactor: 1,
            avoidOverlap: true,
            rankDir: 'TB',
            ranker: 'network-simplex',
            fit:fit,
            padding: 20,
            refresh:200,
            animate: animate,
            nodeDimensionsIncludeLabels: true,
            idealInterClusterEdgeLengthCoefficient: 1.00, //also the bigger the more far away
            nodeRepulsion: 6000, //the bigger the more far away
        }
}




//draw chart in general
function create_cy(id, current_class = '', current_instance = '', elements = []) {

    if(id=="cy"){
        var layout_style=mycise(); //bottom left
    }else if(id=="cy2"){
        var selected_layout= $("#layoutselect").val();
        if (checkdata(selected_layout)){
            var layout_style=selected_layout.replace(" layout", "");
        }else{
            //console.log("selected layout is ",selected_layout);
            var layout_style="concentric";
        }

        var layout_style=mydagre(layout_style); //bottom right instance
    }else if(id=="cy3"){
        var layout_style=mydagre(); // fullscreen modal
    }else if (id=="cy4"){
        var layout_style=mydagre(); //department chart
    }else if(id=="cysubprocess"){
        var layout_style=mydagre(); //subprocess chart
    }else{
    /**/
        var layout_style=mycise();

    }


    var cy = cytoscape({
        container: document.getElementById(id), // container to render in
        wheelSensitivity: 0.02,
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

        layout: layout_style,
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
        //console.log("asdsadsa ",key,val.data());
        var node_data=val.data();
        var lis=[];
        if(node_data["class"]=="highlight"){
            val.addClass("highlight");
            lis.push("<li>"+underscore2space(node_data['id'])+"</li>");
            if (id=="cy2"){
                $("#indirect_result").append(produce_lis([node_data['id']]));
            }
        }else if (node_data["class"]=="red"){
            val.addClass("red");

        }else{
            //for chart 2 and 3
            if (id!="cy"){
                val.addClass("blue");
            }
        }


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
        cy.bind('tapend', 'node', function(event) {
            //works
        }); //end of binding
    }

    dict_cy[id]=cy;
    return cy
}


var bugged_departments={"Europe_UserOperation_Department":'Europe_User_Operation_Department',
                            "Europe_UserDevelopment_Department":"Europe_User_Development_Department"};
var bugged_departments={};


function rekursive_parent_children(page_instance, page_class,subclasscol){

//first find all non none cols
var all_instances=get_all_instance(class_tab=page_class);
var notnone_instances=[]
$.each(all_instances, function(key, mainprocess) {
    var has_subprocess=get_cell(df=data[page_class], index=mainprocess, col=subclasscol, tab=page_class);
    has_subprocess=space2underscore(has_subprocess);

    if(!checkdata(has_subprocess)){
        return;
    }

    $.each(has_subprocess.split(","), function(key, subprocess) {
        notnone_instances.push(subprocess);
    });

});


//find all subprocess to see if this subprocess is linked somewhere
//go from current instance to see if he has parents
current_node=page_instance
parent_node=""
    while(true){
        if(notnone_instances.includes(current_node)){


        }
    }


//find all children first

}


//generate department hierarchy
function generate_hierarchy(page_instance, page_class, subclasscol, topdown=true){
    // add all departments to nodes
    // link all departments together
    var elements = []
    var all_instances=get_all_instance(class_tab=page_class);

    //maybe filter out class that are standalone to reduce calcualtion time
    //Find all elements that has  subclasscol !=none
    //Find
    var helper_array=[];



    if (!topdown){
        var all_instances_pure=[]
        $.each(all_instances, function(key, mainprocess) {
            var has_subprocess=get_cell(df=data[page_class], index=mainprocess, col=subclasscol, tab=page_class);
            has_subprocess=space2underscore(has_subprocess);

            if (checkdata(has_subprocess)){
                //console.log(mainprocess+' has subprocess '+has_subprocess);
                //current element has sub element
                if (checkdata(mainprocess)){
                    all_instances_pure.push(mainprocess);
                }


                $.each(has_subprocess.split(","), function(key, subprocess) {

                    all_instances_pure.push(subprocess);

                });
            }else{
                console.log(mainprocess+' has NO subprocess '+has_subprocess);
            }

        });

        all_instances=all_instances_pure;
        //console.log("this is filtered sub instance");
        //console.log(all_instances);
    }




    //calculate nodes
    $.each(all_instances, function(key, val) {
        if (current_class == val && checkdata(current_instance)) {
            var label =  underscore2space(val)+ " =\n"+ underscore2space(current_instance)   ;
        } else {
           //label for cy, shorter, more compat
           if (checkdata(val)){
                var label = underscore2space(val).replace(" ","\n");
           }else{
                var label = String(val);
           }

        }
        var class_val='';
        if (val == page_instance){
            class_val="red"
        }

        elements.push({
            data: {
                'id': val,
                'label': label,
                'href': "../../page/" + page_class + "/" + val + ".html",
                'class':class_val
            }
        });
        helper_array.push(val);
        //elements.push({data: {'id':val , 'label': label, 'href':"../../page/"+val+"/"+val+".html"} });
    });
    elements=elements.reverse()




    //calculate edges way 1: sub class has class
    if (topdown){

        //topdown is one process has many sub processes
        $.each(all_instances, function(key, val) {
            var belongs_to=get_cell(df=data[page_class], index=val, col=subclasscol, tab=page_class);
            belongs_to=space2underscore(belongs_to);

            if (helper_array.includes(belongs_to) ){
                // found the column without bug
            }else if ( belongs_to in  bugged_departments){
                // found the column with bug
                belongs_to=bugged_departments[belongs_to];
            }else{
                //did not found the column
                //console.log(val," not here ",belongs_to);
                return;
            }

            //console.log(val," here ",belongs_to);
                elements.push({
                    data: {
                        'id': belongs_to+'_'+val, // changing display name to display id removes double edges
                        'source': belongs_to,
                        'target': val,
                    }
                });
        });


    }else{


        //bottom up is each subprocess need to check his mother process
        $.each(all_instances, function(key, val) {
            var belongs_to=get_cell(df=data[page_class], index=val, col=subclasscol, tab=page_class);
            belongs_to=space2underscore(belongs_to);

            //if belongs_to is empty, then continue
            if (!checkdata(belongs_to)){
                return;
            }

            $.each(belongs_to.split(","), function(key, val2) {
                elements.push({
                    data: {
                        'id': val+'_'+val2, // changing display name to display id removes double edges
                        'source': val,
                        'target': val2,
                    }
                });
            });



        });

    }




    //console.log("here", elements);
    return elements;

}







//generate hierarchy by find all parents, then find all sub relations
function generate_hierarchy2(page_instance, page_class, subclasscol){
    // first find all parents that has this element has sub class
    // then find all children that has
    var elements = []
    var all_instances=get_all_instance(class_tab=page_class);
    var helper_array=[];


    //calculate nodes
    $.each(all_instances, function(key, val) {
        if (current_class == val && checkdata(current_instance)) {
            var label =  underscore2space(val)+ " =\n"+ underscore2space(current_instance)   ;
        } else {
           //label for cy, shorter, more compat
           if (checkdata(val)){
                var label = underscore2space(val).replace(" ","\n");
           }else{
                var label = String(val);
           }

        }
        var class_val='';
        if (val == page_instance){
            class_val="red"
        }

        //console.log("added node "+val)
        elements.push({
            data: {
                'id': val,
                'label': label,
                'href': "../../page/" + page_class + "/" + val + ".html",
                'class':class_val
            }
        });
        helper_array.push(val);
        //elements.push({data: {'id':val , 'label': label, 'href':"../../page/"+val+"/"+val+".html"} });
    });
    elements=elements.reverse()


    //calculate edges

    $.each(all_instances, function(key, val) {
        var belongs_to=get_cell(df=data[page_class], index=val, col=subclasscol, tab=page_class);
        belongs_to=space2underscore(belongs_to);

        if (helper_array.includes(belongs_to) ){
            // found the column without bug
        }else if ( belongs_to in  bugged_departments){
            // found the column with bug
            belongs_to=bugged_departments[belongs_to];
        }else{
            //did not found the column
            //console.log(val," not here ",belongs_to);
            return;
        }

        //console.log(val," here ",belongs_to);
            elements.push({
                data: {
                    'id': belongs_to+'_'+val, // changing display name to display id removes double edges
                    'source': belongs_to,
                    'target': val,
                }
            });


    });

    //console.log("here", elements);
    return elements;

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
            var label =  underscore2space(val)+ " =\n"+ underscore2space(current_instance)   ;
        } else {
           //label for cy, shorter, more compat
            var label = underscore2space(val).replace(" ","\n");

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


    //calculate edges nodes based edge calculation
    var alreadydone = [];
    $.each(all_class, function(key, val) { //1. for each tab
        var all_attributes_labels = get_class_columns(val); //return all attributes of that particular class /tab

        var all_links = get_linkable_cols(instance_class=val, return_type=1);

        //first time
        $.each(all_links, function(linkkey, linkval) {

            //manual hardcoded remove
            if (val=="Department"&&linkval=="Capability"){
                return
            }else if (val=="Department"&&linkval=="Topic"){
                return
            }else if (val=="Capability"&&linkval=="Department"){
                return
            }else if (val=="Topic"&&linkval=="Department"){
                return
            }





            //console.log("link val ",val ,linkkey,linkval);
            var destination_label=linkkey; // is display name of column
            var destination_id=linkval;// is real edge column name

            //how to only display first link to the same
            if (!alreadydone.includes(linkval+"_"+val) && !alreadydone.includes(val+"_"+linkval)) {
                //for each real link add edge
                elements.push({
                    data: {
                        'id': val+'_'+destination_label, // changing display name to display id removes double edges
                        'source': val,
                        'target': destination_id
                    }
                });


            }


        });

        //second time to mark them as read. the entire node to node relation is finished
        $.each(all_links, function(linkkey, linkval) {
            alreadydone.push(linkval+"_"+val);
            alreadydone.push(val+"_"+linkval);
        });




        /**
         *
         * $.each(all_attributes_labels, function(row_index, row_val) { //2. for each tab, for each column
            //console.log("compare: ",val, " vs ",row_val);
            //if (row_val.includes("For ") || row_val.includes("By ")) {
            if ( col_linked(instance_class=val, col=row_val, type=1) ) {
                //console.log("yer");
                //var replaced_val = row_val.replaceAll("By ", "");
                //replaced_val = replaced_val.replaceAll("For ", "");
                var replaced_val = col_linked(instance_class=val, col=row_val, type=2);
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

         */


    });




    return elements;
}


//generate instance network
function generate_instance_elements(current_class, target_class, highlight_class) {
    var elements = []
    var all_class = get_all_class();
    if (!checkdata(dict_cy["cy"].elements())){
        return elements;
    }


    //check what user has selected on the first chart

    try{
        //console.log("in generate_instance_elements ",dict_cy["cy"].elements());
        cy_helper=dict_cy["cy"].elements();
        //console.log("cy no problem");
        var aStar = cy_helper.aStar({
            root: "#" + current_class,
            goal: "#" + target_class
        });
    }catch{
        //console.log("error");
        return elements;

    }

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
        //console.log("section 0. ", a_nodes, a_nodes.length, came);
        return [];
    }
    if (a_nodes.length==0){// a_nodes.leng == 0
        //console.log("section 1. ", a_nodes,  a_nodes.length, came);
        return [];
    }else if (a_nodes.length>1){// a_nodes.leng > 1

        //do the first one, give the next one to rekursion
        var first_part=rekursive_traverse([a_nodes[0]], cleared_path, came="2.1"); //split first node
        //console.log("section 2.1 ", a_nodes, a_nodes.length, came, [a_nodes[0]]);

        var other_part=rekursive_traverse(a_nodes.slice(1), cleared_path, came="2.2"); //rest of the nodes
        //console.log("section 2.2 ", a_nodes, a_nodes.length, came, a_nodes.slice(1));
        return first_part.concat(other_part);

    }else { // a_nodes.leng == 1

        //if a_nodes is undefined, then continue
        //expand of existing information
        try{
            var source_class=a_nodes[0]["source_class"];
            var target_class=a_nodes[0]["target_class"];
            var source_instance=a_nodes[0]["source_instance"];
        }catch{
            //console.log("section 3.1 ", a_nodes,  a_nodes.length,came);
            return [];
        }

        // the node has children but user doesnt want to see it. potential bug
        if (target_class==-1){
            //console.log("section 3.2 ", a_nodes, a_nodes.length, came);
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
        //console.log("section 3.3 ", a_nodes, a_nodes.length, came, next_a_nodes);
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
    var dot = row_index!="" ? ": ": "";
    row_index=row_index.replace("_", " ");

    //console.log("start instance url ",cell_data, row_index);
    var url = get_instance_url(cell_data);
    //console.log("finish instance url ",cell_data, row_index,url);

    if (url !=''){
        var li="<li class='noli'>"+row_index+dot+"<a href='"+url+"'>"+underscore2space(cell_data)+"</a></li>";
    }else{
        var li="<li class='noli'>"+row_index+dot+""+underscore2space(cell_data)+"</li>";
    }
    return li;
}


//only calculates the table, that shall be displayed
function display_instance_attribute_aslist(instance,instance_class){
    var df=data[instance_class];
    var tds='';
    $.each(df, function(df_index, row) {
        if(row[instance_class]==instance){
            $.each(row, function(row_index, cell_data) {
                //console.log(cell_data, typeof(cell_data));
                var result_display;// result can belink, can be <a></a>
                if (checkdata(cell_data)==false){// not string at all
                    //lis=lis+produce_li_for_word(row_index, cell_data);
                }else if (row_index == "MC2 Link" || row_index == "Process Flow" || row_index == instance_class){
                    //do nothing, dont show these labels and data
                }else if(typeof(cell_data)=="string"){
                    tds=tds+'<tr id="'+row_index+'"><td class="labeltd" >'+row_index.replace("_", " ")+'</td>' +'<td>'+produce_lis(cell_data.split(","))+'</td></tr>';
                }
            });
        }
    });

    if (tds==""){
        return "<p> there is no direct data for this entry </p>"
    }

    //old ul with row
    var ul=`<table class="table">    <tbody> ${tds}   </tbody>  </table>`;
    return tds;
}



function display_instance_indirect_attribute_aslist(instance,instance_class){
var predefined_classes=$("#predefined_relations").data("predefined_relations");
var a_classes=predefined_classes.split(",");
var tds;

//this class has no predefined classes
if(checkdata(a_classes[0])==false){
    return "";
}

$.each(a_classes, function(index, predef_class) {
    var a_result=[];// a results is displayed as each individual instance

    //for each predefined class, calculate the shortest path
    //go to the instance chart and calculate all instances
    // get all leaves of it, and display it as calculated variable

    //calculate instances of the general path
    // the result format can be directly put int cy json
    //console.log("wtf "+predef_class);
    var instance_elements = generate_instance_elements(current_class=page_class, target_class=predef_class, highlight_class=predef_class);

    //get highlight the leaf instances.
    $.each(instance_elements, function(index, instance_val) {
        //check if instance is highlighted, if yes, it means it is a destination node
        var node_data=instance_val["data"];
        if(node_data["class"]=="highlight"){//remove double entry
            if(!a_result.includes(node_data["id"])){
                a_result.push(node_data["id"]);
            }
        }
    });

    //display them as table in direct relations
    if ( a_result.length == 0) {
        //pass
    }else{
        tds=tds+'<tr id="'+predef_class+'"><td class="labeltd" >'+predef_class.replace("_", " ")+' <div class="text-muted">(calculated)</div></td>' +'<td>'+produce_lis(a_result)+'</td></tr>';
        //console.log("predef_class "+predef_class);
    }


});

    //var ul=`<table class="table">    <tbody> ${tds}   </tbody>  </table>`;
    return tds;

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
        var tds= display_instance_attribute_aslist(instance=selected_instance,instance_class=selected_class);
        var ul=`<table class="table">    <tbody> ${tds}   </tbody>  </table>`;
        $('#versus').html(ul);
    });


    //create cy
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


    //add department hierarchy for people section
    if (page_class =="Department" && checkdata(page_instance)){
        var instance_elements=generate_hierarchy(page_instance, page_class, subclasscol="Belongs to Department",topdown=true);
        var cy4 = create_cy(id = "cy4", current_class = page_class, current_instance = page_instance, elements = instance_elements);

        //focus on the position
        cy.ready(function() {
            var parent_dept=get_cell(df=data["Department"], index=page_instance, col="Belongs to Department", tab=page_class);
            if(parent_dept in bugged_departments){
                //parent_dept=bugged_departments[parent_dept];
            }
            parent_dept=space2underscore(parent_dept); //to correct bug, should not be here
            //console.log("parentdept",parent_dept);
            var focus=cy4.$('#'+page_instance+", #"+parent_dept);
            //console.log(focus);
            cy4.fit(focus, 50);
        });
    }



    //add sub process hierarchy
    /*
    if(page_class=="Employee_Process" && checkdata(page_instance)){
        // create subprocess chart
        var a_subprocess=generate_hierarchy(page_instance, page_class, subclasscol="Has Subprocess",topdown=false);

        //create CY is too slow, drawing too many nodes
        cysubprocess = create_cy(id = "cysubprocess", current_class = page_class, current_instance = page_instance, elements = a_subprocess);

        var pagenode=cysubprocess.$('#'+page_instance );
        var relatednodes=pagenode.connectedNodes();
        console.log("related pagenode are  ");
        console.log(pagenode.id());
        console.log("related relatednodes are  ");
        console.log(relatednodes.id());
        // .not() filters out whatever is not specified in connected, e.g. every other node/edge not present in connected
        //var notConnected = cysubprocess.elements().not(relatednodes);

        // if you want, you can later add the saved elements again
        //var saved = cysubprocess.remove(notConnected);
    }
*/



    //update the left side
    //needs to be after cy has created
    var ul_direct= display_instance_attribute_aslist(instance=page_instance,instance_class=page_class);
    //console.log("start cy",dict_cy["cy"].elements());
    var ul_indirect= display_instance_indirect_attribute_aslist(instance=page_instance, instance_class = page_class);
    //console.log("1 cy",dict_cy["cy"].elements());


    var ul='<table class="table"><tbody>'+ ul_direct+  ul_indirect+'</tbody></table>';
    $('#left_direct').html(ul);
    //some operational bug that creates undefined word before the table
    $("#left_direct").contents().filter(function(){
        return (this.nodeType == 3);
    }).remove();
    //console.log("2 cy",dict_cy["cy"].elements());



    //only for user journey
    /**
     *
     * $(window).on('scroll', () => {
      update_nav();
    })
     *
     */



});
